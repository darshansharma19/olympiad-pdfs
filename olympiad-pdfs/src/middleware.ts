import { NextResponse, type NextRequest } from 'next/server';
import { verifySessionToken, ADMIN_COOKIE } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public auth endpoints
  if (
    pathname === '/admin/login' ||
    pathname === '/api/admin/auth/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // 2. Protect /admin routes (UI pages)
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    const isValid = verifySessionToken(token);

    if (!isValid) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Protect /api/admin routes (Backend APIs)
  if (pathname.startsWith('/api/admin')) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    const isValid = verifySessionToken(token);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
