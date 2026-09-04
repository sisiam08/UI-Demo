import { ADMIN_ROUTES, USER_ROUTES } from "@/constants/role-routes";
import { SystemRole } from "@/constants/user-role";
import { IAuthRouteRule } from "@/interfaces";

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

const authRouteRules: IAuthRouteRule[] = [
  {
    match: (pathname) => matchesRoute(pathname, ADMIN_ROUTES),
    allowedRoles: [SystemRole.ADMIN, SystemRole.SUPER_ADMIN],
  },
  {
    match: (pathname) => matchesRoute(pathname, USER_ROUTES),
    allowedRoles: [SystemRole.USER],
  },
];

export const getRouteRule = (pathname: string): IAuthRouteRule | undefined =>
  authRouteRules.find((rule) => rule.match(pathname));
