import { withAuth } from "next-auth/middleware"
import { securityMiddleware } from "@/lib/security/middleware"
import { NextRequest } from "next/server"

export default withAuth(
  async function middleware(req: NextRequest) {
    // Aplicar validações de segurança
    const securityResponse = await securityMiddleware(req);
    if (securityResponse) {
      return securityResponse;
    }
    
    // Continuar com middleware de autenticação
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acesso a rotas públicas
        const publicRoutes = ['/', '/login', '/api/auth', '/api/health'];
        const isPublicRoute = publicRoutes.some(route => 
          req.nextUrl.pathname.startsWith(route)
        );
        
        if (isPublicRoute) return true;
        
        // Requerer token para rotas protegidas
        return !!token;
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}