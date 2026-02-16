// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || "rahasia-super-aman-123";
const SECRET = new TextEncoder().encode(SECRET_KEY);

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. BYPASS ASET STATIS & API (Mencegah loop pada file sistem)
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. LOGIKA BELUM LOGIN
  if (!token) {
    if (pathname === '/login') return NextResponse.next();
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. LOGIKA SUDAH LOGIN
  try {
    const { payload } = await jwtVerify(token, SECRET);
    // Pastikan role sesuai dengan data dummy di login/page.tsx
    const role = payload.role as string; 

    // Jika user berada di /login padahal sudah login, arahkan ke dashboard yang benar
    if (pathname === '/login') {
      const target = role === 'admin' ? '/admin/scanner' : '/student/profile';
      return NextResponse.redirect(new URL(target, request.url));
    }

    // --- PROTEKSI ROLE (CEK DISINI) ---
    
    // Jika mencoba akses /admin tapi bukan admin, lempar ke student profile
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/student/profile', request.url));
    }

    // Jika mencoba akses /student tapi dia adalah admin, lempar ke admin scanner
    if (pathname.startsWith('/student') && role === 'admin') {
      return NextResponse.redirect(new URL('/admin/scanner', request.url));
    }

    // Jika sudah di rute yang benar atau rute umum lainnya, izinkan lewat
    return NextResponse.next();

  } catch (e) {
    // Jika token expired atau dimodifikasi, hapus cookie dan paksa login ulang
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)'],
};