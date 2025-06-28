// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true"; // Ambil dari cookies jika disimpan di sana, atau dari header jika JWT
  const userRole = request.cookies.get("userRole")?.value; // Ambil role dari cookies

  const { pathname } = request.nextUrl;

  // Rute yang tidak memerlukan autentikasi
  const publicPaths = ["/login", "/register", "/"];

  // Cek apakah rute saat ini adalah rute publik
  const isPublicPath = publicPaths.includes(pathname);

  // Jika user belum login dan mencoba mengakses rute non-publik, redirect ke login
  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika user sudah login dan mencoba mengakses rute login/register, redirect ke halaman utama (atau dashboard)
  if (isLoggedIn && isPublicPath && pathname !== "/") {
    return NextResponse.redirect(new URL("/user/articles", request.url)); // Atau ke dashboard sesuai role
  }

  // Contoh otorisasi berdasarkan role
  if (isLoggedIn) {
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/user/articles", request.url)); // Redirect jika user biasa mencoba akses admin
    }
    if (
      pathname.startsWith("/user") &&
      userRole !== "user" &&
      userRole !== "admin"
    ) {
      // Jika ada role lain selain user/admin, atau jika admin mencoba akses user-specific tapi ingin dipisahkan
      // Untuk kasus ini, admin juga bisa akses user, jadi ini mungkin tidak perlu ketat
    }
  }

  return NextResponse.next();
}

// Konfigurasi matcher untuk middleware
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Kecualikan folder api, static files, dll.
  ],
};
