/**
 * Utilitários para garantir segurança de URLs e forçar HTTPS
 */

// Domínios confiáveis que devem sempre usar HTTPS
const TRUSTED_DOMAINS = [
  'api.mercadolibre.com',
  'api.mercadolivre.com.br',
  'auth.mercadolivre.com.br',
  'http2.mlstatic.com',
  'mla-s1-p.mlstatic.com',
  'mla-s2-p.mlstatic.com',
  'mlb-s1-p.mlstatic.com',
  'mlb-s2-p.mlstatic.com',
  'js-agent.newrelic.com',
  'bam.nr-data.net',
  '*.nr-data.net',
  'print1.mercadoclics.com'
];

/**
 * Força uma URL para usar HTTPS se for de um domínio confiável
 * @param url - URL a ser verificada
 * @returns URL com HTTPS forçado se necessário
 */
export function enforceHttps(url: string): string {
  try {
    const parsedUrl = new URL(url);
    
    // Se já é HTTPS, retorna como está
    if (parsedUrl.protocol === 'https:') {
      return url;
    }
    
    // Se é HTTP e é um domínio confiável, força HTTPS
    if (parsedUrl.protocol === 'http:' && isTrustedDomain(parsedUrl.hostname)) {
      parsedUrl.protocol = 'https:';
      return parsedUrl.toString();
    }
    
    // Em produção, força HTTPS para todos os domínios externos
    if (process.env.NODE_ENV === 'production' && parsedUrl.protocol === 'http:') {
      parsedUrl.protocol = 'https:';
      return parsedUrl.toString();
    }
    
    return url;
  } catch (error) {
    console.warn('Erro ao processar URL:', url, error);
    return url;
  }
}

/**
 * Verifica se um domínio está na lista de domínios confiáveis
 * @param hostname - Nome do host a ser verificado
 * @returns true se o domínio é confiável
 */
export function isTrustedDomain(hostname: string): boolean {
  return TRUSTED_DOMAINS.some(domain => 
    hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

/**
 * Valida se uma URL é segura para uso
 * @param url - URL a ser validada
 * @returns true se a URL é segura
 */
export function isSecureUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    
    // Em produção, apenas HTTPS é permitido
    if (process.env.NODE_ENV === 'production' && parsedUrl.protocol !== 'https:') {
      return false;
    }
    
    // Localhost é permitido apenas em desenvolvimento
    if (parsedUrl.hostname === 'localhost' && process.env.NODE_ENV !== 'development') {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitiza uma URL removendo parâmetros sensíveis
 * @param url - URL a ser sanitizada
 * @param sensitiveParams - Lista de parâmetros a serem removidos
 * @returns URL sanitizada
 */
export function sanitizeUrl(url: string, sensitiveParams: string[] = ['access_token', 'client_secret', 'password']): string {
  try {
    const parsedUrl = new URL(url);
    
    sensitiveParams.forEach(param => {
      parsedUrl.searchParams.delete(param);
    });
    
    return parsedUrl.toString();
  } catch {
    return url;
  }
}

/**
 * Gera uma URL segura para imagens do Mercado Livre
 * @param imageUrl - URL original da imagem
 * @returns URL segura com HTTPS
 */
export function getSecureImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  
  // Se já é uma URL completa, força HTTPS
  if (imageUrl.startsWith('http')) {
    return enforceHttps(imageUrl);
  }
  
  // Se é apenas um ID de imagem, constrói a URL completa
  if (imageUrl.match(/^[A-Z0-9_-]+$/i)) {
    return `https://http2.mlstatic.com/D_${imageUrl}-O.jpg`;
  }
  
  return imageUrl;
}

/**
 * Middleware para interceptar e corrigir URLs HTTP em desenvolvimento
 * @param url - URL a ser processada
 * @returns URL corrigida
 */
export function processExternalUrl(url: string): string {
  // Força HTTPS para URLs externas
  const secureUrl = enforceHttps(url);
  
  // Log em desenvolvimento para debug
  if (process.env.NODE_ENV === 'development' && url !== secureUrl) {
    console.log(`🔒 URL convertida para HTTPS: ${url} -> ${secureUrl}`);
  }
  
  return secureUrl;
}