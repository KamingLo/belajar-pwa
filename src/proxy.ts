import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || "fallback-login-secret-32-chars-min";
const SECRET = new TextEncoder().encode(SECRET_KEY);

// 1. Mapping Role ke Default Dashboard & Allowed Prefix
const ROLE_CONFIG: Record<string, { dashboard: string; prefix: string }> = {
  admin: {
    dashboard: '/admin',
    prefix: '/admin'
  },
  student: {
    dashboard: '/student',
    prefix: '/student'
  },
};

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Logic Belum Login
  if (!token) {
    if (pathname === '/login') return NextResponse.next();
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const role = payload.role as string;
    const config = ROLE_CONFIG[role];

    // Jika token valid tapi role tidak dikenali (keamanan tambahan)
    if (!config) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }

    // 3. Logic Redirect Login (Jika sudah login tapi akses /login)
    if (pathname === '/login') {
      return NextResponse.redirect(new URL(config.dashboard, request.url));
    }

    // 4. PROTEKSI RUTE (Modern & Dynamic)
    
    // Cek apakah user mencoba akses rute role lain
    // Contoh: Admin mencoba akses /student atau sebaliknya
    const isAccessingOtherRole = Object.values(ROLE_CONFIG).some(
      (other) => pathname.startsWith(other.prefix) && other.prefix !== config.prefix
    );

    // Cek apakah user berada di root "/" atau rute yang tidak sesuai prefix-nya
    const isNotOnCorrectPrefix = !pathname.startsWith(config.prefix);

    if (isAccessingOtherRole || isNotOnCorrectPrefix) {
      return NextResponse.redirect(new URL(config.dashboard, request.url));
    }

    return NextResponse.next();

  } catch (e) {
    // Token expired atau invalid
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

// Matcher yang lebih bersih (exclude public files)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.png$).*)',
  ],
};