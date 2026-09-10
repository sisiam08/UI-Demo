import { NextRequest, NextResponse } from "next/server";
import { getRouteRule } from "./lib/auth-routes";
import { SystemRole } from "./constants/user-role";
import { getCurrentUser } from "./services/auth.service";
import { createApiClient, getServerCookieHeader } from "./lib/api-client";
import { IApiResponse } from "./interfaces";

const redirectHomeByRole: Record<SystemRole, string> = {
  [SystemRole.ADMIN]: "/admin/dashboard",
  [SystemRole.SUPER_ADMIN]: "/admin/dashboard",
  [SystemRole.USER]: "/requirements/browse",
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;

  try {
    if (!accessToken) {
      throw new Error("Unauthorized");
    }

    const routeRule = getRouteRule(pathname);

    if (!routeRule) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    if (!routeRule.allowedRoles.includes(currentUser.systemRole)) {
      const redirectUrl =
        redirectHomeByRole[currentUser.systemRole] || "/login";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.next();
  } catch {
    const refreshServer = createApiClient(await getServerCookieHeader());

    try {
      const refreshResponse = await refreshServer.post<IApiResponse<void>>(
        "/auth/refresh",
        {}
      );

      const setCookies = refreshResponse.headers["set-cookie"];

      const response = NextResponse.redirect(request.url);

      if (setCookies) {
        setCookies.forEach((cookie) => {
          response.headers.append("Set-Cookie", cookie);
        });
      }

      return response;
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/requirements/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
    "/applications/:path*",
    "/change-password/:path*",
    "/startups/:path*",
    "/sessions/:path*",
  ],
};
