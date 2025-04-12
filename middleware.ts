import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userData = request.cookies.get('userData');
  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard');

  if (!userData && isDashboardPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*'
  ]
};
