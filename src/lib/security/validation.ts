import { z } from 'zod';

// Schemas de validação para dados de entrada
export const webhookDataSchema = z.object({
  resource: z.string().min(1),
  user_id: z.number().positive(),
  topic: z.string().min(1),
  application_id: z.number().positive(),
  attempts: z.number().min(0),
  sent: z.string().datetime(),
  received: z.string().datetime()
});

export const productDataSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(500),
  price: z.number().positive(),
  available_quantity: z.number().min(0),
  condition: z.enum(['new', 'used']),
  listing_type_id: z.string(),
  category_id: z.string(),
  currency_id: z.string().length(3)
});

export const userInputSchema = z.object({
  query: z.string().min(1).max(1000),
  filters: z.object({
    category: z.string().optional(),
    price_min: z.number().min(0).optional(),
    price_max: z.number().positive().optional(),
    condition: z.enum(['new', 'used']).optional()
  }).optional()
});

// Função para sanitizar strings
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  return input
    .trim()
    .replace(/[<>"'&]/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    })
    .slice(0, 1000); // Limitar tamanho
}

// Função para sanitizar objetos
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeObject(value) as T[keyof T];
    } else if (Array.isArray(value)) {
      sanitized[key as keyof T] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : 
        typeof item === 'object' && item !== null ? sanitizeObject(item) : item
      ) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
}

// Validar e sanitizar dados de webhook
export function validateWebhookData(data: unknown) {
  try {
    const parsed = webhookDataSchema.parse(data);
    return { success: true, data: sanitizeObject(parsed), error: null };
  } catch (error) {
    return { 
      success: false, 
      data: null, 
      error: error instanceof z.ZodError ? error.issues : 'Invalid data format' 
    };
  }
}

// Validar dados de produto
export function validateProductData(data: unknown) {
  try {
    const parsed = productDataSchema.parse(data);
    return { success: true, data: sanitizeObject(parsed), error: null };
  } catch (error) {
    return { 
      success: false, 
      data: null, 
      error: error instanceof z.ZodError ? error.issues : 'Invalid product data' 
    };
  }
}

// Validar entrada do usuário
export function validateUserInput(data: unknown) {
  try {
    const parsed = userInputSchema.parse(data);
    return { success: true, data: sanitizeObject(parsed), error: null };
  } catch (error) {
    return { 
      success: false, 
      data: null, 
      error: error instanceof z.ZodError ? error.issues : 'Invalid user input' 
    };
  }
}

// Verificar se uma URL é segura
export function isSecureUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    
    // Apenas HTTPS em produção
    if (process.env.NODE_ENV === 'production' && parsedUrl.protocol !== 'https:') {
      return false;
    }
    
    // Verificar domínios permitidos
    const allowedDomains = [
      'api.mercadolibre.com',
      'api.mercadolivre.com.br',
      'auth.mercadolivre.com.br',
      'localhost',
      process.env.VERCEL_URL,
      process.env.NEXTAUTH_URL
    ].filter(Boolean);
    
    const isAllowedDomain = allowedDomains.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );
    
    return isAllowedDomain;
  } catch {
    return false;
  }
}

// Verificar se um token JWT é válido (estrutura básica)
export function isValidJWTStructure(token: string): boolean {
  if (typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  try {
    // Verificar se cada parte é base64 válida
    parts.forEach(part => {
      if (part.length === 0) throw new Error('Empty part');
      atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    });
    return true;
  } catch {
    return false;
  }
}

// Limitar tamanho de payload
export function validatePayloadSize(data: any, maxSizeKB: number = 100): boolean {
  try {
    const jsonString = JSON.stringify(data);
    const sizeKB = new Blob([jsonString]).size / 1024;
    return sizeKB <= maxSizeKB;
  } catch {
    return false;
  }
}

// Detectar tentativas de injeção SQL básicas
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /('|(\-\-)|(;)|(\||\|)|(\*|\*))/i,
    /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

// Detectar tentativas de XSS básicas
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]+src[\s]*=[\s]*["']?[\s]*javascript:/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}