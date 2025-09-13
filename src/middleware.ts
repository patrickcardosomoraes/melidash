import { NextRequest, NextResponse } from "next/server"
import { securityMiddleware } from "@/lib/security/middleware"
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request: NextRequest) {
  // Aplicar validações de segurança
  const securityResponse = await securityMiddleware(request);
  if (securityResponse) {
    return securityResponse;
  }
  
  // Verificar se é rota protegida
  const { pathname } = request.nextUrl;
  const protectedRoutes = [
    '/dashboard', 
    '/products', 
    '/pricing', 
    '/analytics', 
    '/reputation', 
    '/trends',
    '/automation',
    '/reports',
    '/settings'
  ];
  
  // Rotas públicas
  const publicRoutes = [
    '/login',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/mercado-livre',
    '/api/auth/callback'
  ];
  
  // Permitir acesso a rotas públicas
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Verificar token JWT (autenticação tradicional)
    const jwtToken = request.cookies.get('auth-token')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (jwtToken) {
      try {
        jwt.verify(jwtToken, JWT_SECRET);
        return NextResponse.next();
      } catch {
        // Token JWT inválido, limpar cookie e continuar verificação
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        return response;
      }
    }
    
    // Verificar se tem cookie de sessão do NextAuth (OAuth)
    const sessionToken = request.cookies.get('next-auth.session-token') || 
                        request.cookies.get('__Secure-next-auth.session-token');
    
    if (!sessionToken) {
      // Redirecionar para login se não houver nenhum tipo de autenticação
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
