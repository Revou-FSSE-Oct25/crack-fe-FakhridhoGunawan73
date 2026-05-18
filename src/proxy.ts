import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ACCESS_TOKEN_KEY = "kostify_access_token";

const PROTECTED_PREFIXES = [
  "/profile",
  "/my-bookings",
  "/owner",
  "/bookings/create",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

async function verifyToken(token: string): Promise<any> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const raw = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const token = raw ? decodeURIComponent(raw) : null;

  if (!token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith("/owner")) {
    const role = payload.role;
    if (role !== "OWNER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/profile/:path*",
    "/my-bookings",
    "/my-bookings/:path*",
    "/owner/:path*",
    "/bookings/create",
  ],
};