import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Kullanıcının login durumunu kontrol et
  const userData = request.cookies.get('userData');
  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard');

  // Eğer kullanıcı giriş yapmamışsa ve dashboard'a erişmeye çalışıyorsa
  if (!userData && isDashboardPath) {
    // Ana sayfaya yönlendir
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Middleware'in çalışacağı path'leri belirt
export const config = {
  matcher: [
    '/dashboard/:path*'
  ]
};
