import { MLProduct, MLUser, MLTokenData, MLOrder, MLQuestion } from '@/types/api';

// Configurações da API do Mercado Livre
const ML_API_BASE_URL = 'https://api.mercadolibre.com';
const ML_AUTH_URL = 'https://auth.mercadolivre.com.br/authorization';

// Configurações OAuth (em produção, usar variáveis de ambiente)
const CLIENT_ID = process.env.NEXT_PUBLIC_ML_CLIENT_ID || 'your_client_id';
const CLIENT_SECRET = process.env.ML_CLIENT_SECRET || 'your_client_secret';
const REDIRECT_URI = process.env.NEXT_PUBLIC_ML_REDIRECT_URI || `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'https://your-app.vercel.app'}/api/auth/mercado-livre/callback`;

export class MercadoLivreAPI {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(accessToken?: string, refreshToken?: string) {
    this.accessToken = accessToken || null;
    this.refreshToken = refreshToken || null;
  }

  // Gerar URL de autorização OAuth
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'read write offline_access'
    });

    // Adicionar parâmetro state para segurança adicional
    if (state) {
      params.set('state', state);
    }

    return `${ML_AUTH_URL}?${params.toString()}`;
  }

  // Trocar código de autorização por token de acesso
  async exchangeCodeForToken(code: string): Promise<MLTokenData> {
    const response = await fetch(`${ML_API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao trocar código por token: ${response.statusText}`);
    }

    const tokenData = await response.json() as MLTokenData;
    this.accessToken = tokenData.accessToken;
    this.refreshToken = tokenData.refreshToken;
    
    return tokenData;
  }

  // Renovar token de acesso
  async refreshAccessToken(): Promise<MLTokenData> {
    if (!this.refreshToken) {
      throw new Error('Refresh token não disponível');
    }

    const response = await fetch(`${ML_API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: this.refreshToken
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao renovar token: ${response.statusText}`);
    }

    const tokenData = await response.json() as MLTokenData;
    this.accessToken = tokenData.accessToken;
    this.refreshToken = tokenData.refreshToken;
    
    return tokenData;
  }

  // Fazer requisição autenticada
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Token de acesso não disponível');
    }

    const response = await fetch(`${ML_API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token expirado, tentar renovar
      try {
        await this.refreshAccessToken();
        // Repetir a requisição com o novo token
        return this.makeAuthenticatedRequest<T>(endpoint, options);
      } catch (error) {
        throw new Error('Falha na autenticação. Faça login novamente.');
      }
    }

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    return response.json();
  }

  // Obter informações do usuário
  async getUserInfo(): Promise<MLUser> {
    return this.makeAuthenticatedRequest<MLUser>('/users/me');
  }

  // Listar produtos do usuário
  async getMyProducts(limit: number = 50, offset: number = 0): Promise<{
    results: MLProduct[];
    paging: {
      total: number;
      offset: number;
      limit: number;
    };
  }> {
    const userInfo = await this.getUserInfo();
    return this.makeAuthenticatedRequest(
      `/users/${userInfo.id}/items/search?limit=${limit}&offset=${offset}`
    );
  }

  // Obter detalhes de um produto específico
  async getProduct(itemId: string): Promise<MLProduct> {
    return this.makeAuthenticatedRequest<MLProduct>(`/items/${itemId}`);
  }

  // Atualizar produto
  async updateProduct(itemId: string, updates: Partial<MLProduct>): Promise<MLProduct> {
    return this.makeAuthenticatedRequest<MLProduct>(`/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Pausar produto
  async pauseProduct(itemId: string): Promise<MLProduct> {
    return this.updateProduct(itemId, { status: 'paused' });
  }

  // Ativar produto
  async activateProduct(itemId: string): Promise<MLProduct> {
    return this.updateProduct(itemId, { status: 'active' });
  }

  // Obter pedidos
  async getOrders(limit: number = 50, offset: number = 0): Promise<{
    results: MLOrder[];
    paging: {
      total: number;
      offset: number;
      limit: number;
    };
  }> {
    const userInfo = await this.getUserInfo();
    return this.makeAuthenticatedRequest(
      `/orders/search/recent?seller=${userInfo.id}&limit=${limit}&offset=${offset}`
    );
  }

  // Obter perguntas
  async getQuestions(itemId?: string, limit: number = 50, offset: number = 0): Promise<{
    questions: MLQuestion[];
    total: number;
  }> {
    const endpoint = itemId 
      ? `/questions/search?item_id=${itemId}&limit=${limit}&offset=${offset}`
      : `/my/received_questions/search?limit=${limit}&offset=${offset}`;
    
    return this.makeAuthenticatedRequest(endpoint);
  }

  // Responder pergunta
  async answerQuestion(questionId: string, text: string): Promise<void> {
    await this.makeAuthenticatedRequest(`/answers`, {
      method: 'POST',
      body: JSON.stringify({
        question_id: questionId,
        text
      })
    });
  }

  // Obter métricas de reputação
  async getReputationMetrics(): Promise<Record<string, unknown>> {
    const userInfo = await this.getUserInfo();
    return this.makeAuthenticatedRequest(`/users/${userInfo.id}/reputation`);
  }

  // Buscar produtos por categoria
  async searchProducts(query: string, categoryId?: string, limit: number = 50): Promise<{
    results: MLProduct[];
    paging: {
      total: number;
      offset: number;
      limit: number;
    };
  }> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });

    if (categoryId) {
      params.append('category', categoryId);
    }

    return this.makeAuthenticatedRequest(`/sites/MLB/search?${params.toString()}`);
  }

  // Obter categorias
  async getCategories(): Promise<Record<string, unknown>[]> {
    return this.makeAuthenticatedRequest('/sites/MLB/categories');
  }

  // Obter tendências de uma categoria
  async getCategoryTrends(categoryId: string): Promise<Record<string, unknown>> {
    return this.makeAuthenticatedRequest(`/trends/MLB/${categoryId}`);
  }
}

// Instância singleton da API
let mlApiInstance: MercadoLivreAPI | null = null;

export function getMercadoLivreAPI(accessToken?: string, refreshToken?: string): MercadoLivreAPI {
  if (!mlApiInstance || (accessToken && refreshToken)) {
    mlApiInstance = new MercadoLivreAPI(accessToken, refreshToken);
  }
  return mlApiInstance;
}

// Utilitários
export function formatMLPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

export function getMLProductUrl(permalink: string): string {
  return permalink;
}

export function getMLImageUrl(pictureId: string, size: 'I' | 'O' | 'V' | 'U' | 'P' | 'S' | 'B' | 'T' | 'D' | 'N' = 'O'): string {
  // Sempre usar HTTPS para imagens do Mercado Livre
  return `https://http2.mlstatic.com/D_${pictureId}-${size}.jpg`;
}