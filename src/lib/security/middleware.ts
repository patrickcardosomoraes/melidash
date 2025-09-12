import { NextRequest, NextResponse } from 'next/server';

// Lista de rotas que requerem autenticação
const PROTECTED_ROUTES = [
  '/dashboard',
  '/products',
  '/pricing',
  '/analytics',
  '/reputation',
  '/trends',
  '/api/mercado-livre',
  '/api/webhooks/mercado-livre'
];

// Rate limiting simples (em produção, use Redis ou similar)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests por minuto

export async function securityMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  // 1. Verificar User-Agent suspeito
  if (isSuspiciousUserAgent(userAgent)) {
    console.warn(`Suspicious user agent detected: ${userAgent} from IP: ${ip}`);
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. Rate limiting básico
  if (isRateLimited(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // 3. Verificar se a rota requer autenticação
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Validações específicas para webhooks
    if (pathname.startsWith('/api/webhooks/')) {
      return validateWebhookRequest(request);
    }
    
    // Para outras rotas protegidas, deixar o NextAuth.js lidar com autenticação
  }

  // 5. Headers de segurança
  const response = NextResponse.next();
  addSecurityHeaders(response);

  return response;
}

// Verificar User-Agent suspeito
function isSuspiciousUserAgent(userAgent: string): boolean {
  // Em desenvolvimento, não bloquear nenhum user-agent
  if (process.env.NODE_ENV === 'development') {
    return false;
  }

  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http-client/i
  ];

  // Permitir bots legítimos e ferramentas de desenvolvimento
  const allowedBots = [
    /googlebot/i,
    /bingbot/i,
    /slackbot/i,
    /twitterbot/i,
    /facebookexternalhit/i,
    /linkedinbot/i,
    /curl/i, // Permitir curl para testes
    /postman/i, // Permitir Postman para testes
    /insomnia/i // Permitir Insomnia para testes
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  const isAllowed = allowedBots.some(pattern => pattern.test(userAgent));

  return isSuspicious && !isAllowed;
}

// Rate limiting simples
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  // Reset contador se passou da janela de tempo
  if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  // Incrementar contador
  userLimit.count++;

  return userLimit.count > RATE_LIMIT_MAX_REQUESTS;
}

// Validar requisições de webhook
function validateWebhookRequest(request: NextRequest): NextResponse | undefined {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Verificar se é do Mercado Livre
  if (!userAgent.includes('MercadoLibre')) {
    console.warn(`Invalid webhook user agent: ${userAgent}`);
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Verificar método HTTP
  if (request.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  return undefined;
}

// Adicionar headers de segurança
function addSecurityHeaders(response: NextResponse): void {
  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevenir MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );
  
  // HSTS (apenas em HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }
}

// Limpar rate limit map periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.lastReset > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);