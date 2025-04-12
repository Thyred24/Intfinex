import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    // Kullanıcının login durumunu kontrol et
    const userData = request.cookies.get('userData');
    const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard');

    // Cookie içeriğini parse et ve kontrol et
    let isValidUserData = false;
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData.value);
        isValidUserData = parsedUserData && parsedUserData.isSuccess === true;
      } catch {
        isValidUserData = false;
      }
    }

    // Eğer kullanıcı giriş yapmamışsa veya geçersiz cookie varsa ve dashboard'a erişmeye çalışıyorsa
    if ((!userData || !isValidUserData) && isDashboardPath) {
      // Ana sayfaya yönlendir
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Hata durumunda güvenli bir şekilde ana sayfaya yönlendir
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Middleware'in çalışacağı path'leri belirt
export const config = {
  matcher: [
    '/dashboard/:path*'
  ]
};
