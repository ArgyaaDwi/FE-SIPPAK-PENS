import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifySessionToken } from "./lib/auth/encrypt";

const protectedRouteByRoles = [
  { path: /^\/kadep/, roles: ["kadep"] },
  { path: /^\/kaprodi/, roles: ["kaprodi"] },
  { path: /^\/dosen-wali/, roles: ["dosen_wali"] },
  { path: /^\/wali-murid/, roles: ["wali_murid"] },
];

const publicRoutes = ["/login", "/api/login"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isApiRoute = pathname.startsWith("/api/");

  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/publication") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  let sessionToken = req.cookies.get("session")?.value;

  if (!sessionToken) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      sessionToken = authHeader.split(" ")[1];
    }
  }

  if (!sessionToken) {
    console.log("[Middleware] Blocked: No Token for", pathname);
    return isApiRoute
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", req.url));
  }

  const session = await verifySessionToken(sessionToken);

  if (!session?.role) {
    console.log("[Middleware] Blocked: Invalid Token for", pathname);
    return isApiRoute
      ? NextResponse.json({ error: "Invalid Session" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = session.role.toString().toLowerCase();

  const matchedRoute = protectedRouteByRoles.find((route) =>
    route.path.test(pathname)
  );

  if (matchedRoute) {
    if (!matchedRoute.roles.includes(userRole)) {
      console.log(`[Middleware] Akses ditolak: Role ${userRole} dilarang masuk ke ${pathname}`);
      return isApiRoute
        ? NextResponse.json({ error: "Forbidden: Akses ditolak" }, { status: 403 })
        : NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets).*)",
  ],
};