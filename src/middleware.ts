import { NextRequest, NextResponse } from "next/server"
import { securityMiddleware } from "@/lib/security/middleware"

export async function middleware(request: NextRequest) {
  // Aplicar validações de segurança
  const securityResponse = await securityMiddleware(request);
  if (securityResponse) {
    return securityResponse;
  }
  
  // Verificar se é rota protegida
  const { pathname } = request.nextUrl;
  const protectedRoutes = ['/dashboard', '/products', '/pricing', '/analytics', '/reputation', '/trends'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Verificar se tem cookie de sessão do NextAuth
    const sessionToken = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');
    
    if (!sessionToken) {
      // Redirecionar para login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}