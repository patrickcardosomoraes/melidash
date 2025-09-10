// Configuração para ambiente de produção
// Remove dados mock e configura chamadas reais da API

export const PRODUCTION_CONFIG = {
  // Desabilitar dados mock em produção
  USE_MOCK_DATA: false,
  
  // Configurações de API
  API_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  
  // Configurações de cache
  CACHE_TTL: 300000, // 5 minutos
  
  // Configurações de segurança
  SECURE_COOKIES: true,
  HTTPS_ONLY: true,
  
  // Configurações de logging
  LOG_LEVEL: 'error',
  ENABLE_DEBUG: false,
};

// Função para verificar se está em produção
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

// Função para obter configuração baseada no ambiente
export const getConfig = () => {
  if (isProduction()) {
    return PRODUCTION_CONFIG;
  }
  
  // Configuração de desenvolvimento
  return {
    ...PRODUCTION_CONFIG,
    USE_MOCK_DATA: true,
    LOG_LEVEL: 'debug',
    ENABLE_DEBUG: true,
    SECURE_COOKIES: false,
    HTTPS_ONLY: false,
  };
};