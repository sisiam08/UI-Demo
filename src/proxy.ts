import { NextRequest, NextResponse } from "next/server";
import { getRouteRule } from "./lib/auth-routes";
import { getCurrentUser } from "./lib/auth";
import { SystemRole } from "./constants/user-role";

const redirectHomeByRole: Record<SystemRole, string> = {
  [SystemRole.ADMIN]: "/admin/dashboard",
  [SystemRole.SUPER_ADMIN]: "/admin/dashboard",
  [SystemRole.USER]: "/requirements/browse",
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const routeRule = getRouteRule(pathname);

  if (!routeRule) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!routeRule.allowedRoles.includes(currentUser.systemRole)) {
      const redirectUrl =
        redirectHomeByRole[currentUser.systemRole] || "/login";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
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
