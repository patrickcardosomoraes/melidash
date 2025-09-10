import {
  AIInsight,
  AIRecommendation,
  AIChat,
  AIChatMessage,
  AIAnalysis,
  AISettings,
  mockAIInsights,
  mockAIChats,
  mockAIAnalyses,
  defaultAISettings
} from '@/types/ai-assistant';

export class AIAssistantService {
  private insights: AIInsight[] = [...mockAIInsights];
  private chats: AIChat[] = [...mockAIChats];
  private analyses: AIAnalysis[] = [...mockAIAnalyses];
  private settings: AISettings = { ...defaultAISettings };

  // Insights Management
  async getInsights(filters?: {
    type?: string;
    impact?: string;
    status?: string;
    productId?: string;
  }): Promise<AIInsight[]> {
    await this.simulateDelay();
    
    let filteredInsights = [...this.insights];
    
    if (filters?.type) {
      filteredInsights = filteredInsights.filter(insight => insight.type === filters.type);
    }
    
    if (filters?.impact) {
      filteredInsights = filteredInsights.filter(insight => insight.impact === filters.impact);
    }
    
    if (filters?.status) {
      filteredInsights = filteredInsights.filter(insight => insight.status === filters.status);
    }
    
    if (filters?.productId) {
      filteredInsights = filteredInsights.filter(insight => insight.productId === filters.productId);
    }
    
    return filteredInsights.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getInsightById(id: string): Promise<AIInsight | null> {
    await this.simulateDelay();
    return this.insights.find(insight => insight.id === id) || null;
  }

  async updateInsightStatus(id: string, status: AIInsight['status']): Promise<void> {
    await this.simulateDelay();
    const insight = this.insights.find(i => i.id === id);
    if (insight) {
      insight.status = status;
    }
  }

  async dismissInsight(id: string): Promise<void> {
    await this.updateInsightStatus(id, 'dismissed');
  }

  async applyRecommendation(insightId: string, recommendationId: string): Promise<void> {
    await this.simulateDelay();
    await this.updateInsightStatus(insightId, 'applied');
    // Here you would implement the actual recommendation application logic
  }

  // Chat Management
  async getChats(): Promise<AIChat[]> {
    await this.simulateDelay();
    return [...this.chats].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getChatById(id: string): Promise<AIChat | null> {
    await this.simulateDelay();
    return this.chats.find(chat => chat.id === id) || null;
  }

  async createChat(context: AIChat['context']): Promise<AIChat> {
    await this.simulateDelay();
    
    const newChat: AIChat = {
      id: Date.now().toString(),
      messages: [],
      context,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.chats.unshift(newChat);
    return newChat;
  }

  async sendMessage(chatId: string, content: string): Promise<AIChatMessage> {
    await this.simulateDelay();
    
    const chat = this.chats.find(c => c.id === chatId);
    if (!chat) {
      throw new Error('Chat não encontrado');
    }
    
    const userMessage: AIChatMessage = {
      id: `${chatId}-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    chat.messages.push(userMessage);
    
    // Simulate AI response
    const aiResponse = await this.generateAIResponse(content, chat.context);
    const assistantMessage: AIChatMessage = {
      id: `${chatId}-${Date.now() + 1}`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    
    chat.messages.push(assistantMessage);
    chat.updatedAt = new Date();
    
    return assistantMessage;
  }

  private async generateAIResponse(userMessage: string, context: AIChat['context']): Promise<string> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = {
      pricing: [
        'Com base na análise de mercado, recomendo ajustar o preço considerando a margem de lucro e competitividade.',
        'Identifiquei que seus concorrentes estão praticando preços 5-8% menores. Vamos analisar estratégias de precificação.',
        'Para otimizar seus preços, sugiro implementar uma estratégia dinâmica baseada na demanda e sazonalidade.'
      ],
      optimization: [
        'Analisando seu produto, vejo oportunidades de melhoria no título, imagens e descrição.',
        'Seus produtos podem ter melhor performance com algumas otimizações de SEO e apresentação visual.',
        'Identifiquei 3 áreas principais para otimização: título, imagens e palavras-chave.'
      ],
      trends: [
        'As tendências atuais mostram crescimento em categorias sustentáveis e tecnológicas.',
        'Detectei uma oportunidade emergente no seu nicho de mercado.',
        'Com base nos dados de tendências, recomendo focar em produtos com características específicas.'
      ],
      general: [
        'Posso ajudá-lo com análises detalhadas, otimizações e estratégias personalizadas.',
        'Vamos trabalhar juntos para melhorar o desempenho dos seus produtos no Mercado Livre.',
        'Com base nos seus dados, posso sugerir várias estratégias de crescimento.'
      ]
    };
    
    // Simple keyword matching for response selection
    let responseCategory = 'general';
    const message = userMessage.toLowerCase();
    
    if (message.includes('preço') || message.includes('custo') || message.includes('valor')) {
      responseCategory = 'pricing';
    } else if (message.includes('otimiz') || message.includes('melhor') || message.includes('título')) {
      responseCategory = 'optimization';
    } else if (message.includes('tendência') || message.includes('mercado') || message.includes('oportunidade')) {
      responseCategory = 'trends';
    }
    
    const categoryResponses = responses[responseCategory as keyof typeof responses];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  }

  // Analysis Management
  async getAnalyses(type?: AIAnalysis['type']): Promise<AIAnalysis[]> {
    await this.simulateDelay();
    
    let filteredAnalyses = [...this.analyses];
    
    if (type) {
      filteredAnalyses = filteredAnalyses.filter(analysis => analysis.type === type);
    }
    
    return filteredAnalyses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAnalysisById(id: string): Promise<AIAnalysis | null> {
    await this.simulateDelay();
    return this.analyses.find(analysis => analysis.id === id) || null;
  }

  async createAnalysis(type: AIAnalysis['type'], targetId: string): Promise<AIAnalysis> {
    await this.simulateDelay();
    
    // Simulate analysis generation
    const newAnalysis: AIAnalysis = {
      id: Date.now().toString(),
      type,
      targetId,
      analysis: {
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        strengths: [
          'Preço competitivo no mercado',
          'Boa reputação do vendedor',
          'Descrição detalhada do produto'
        ],
        weaknesses: [
          'Título pode ser otimizado',
          'Poucas imagens do produto',
          'Falta de promoções ativas'
        ],
        opportunities: [
          'Adicionar mais palavras-chave',
          'Melhorar qualidade das imagens',
          'Implementar estratégias promocionais'
        ],
        threats: [
          'Concorrência com preços menores',
          'Produtos similares com mais avaliações',
          'Mudanças no algoritmo da plataforma'
        ]
      },
      suggestions: [
        {
          title: 'Otimizar título do produto',
          description: 'Adicione palavras-chave relevantes para melhorar o SEO',
          priority: 'high',
          category: 'SEO'
        },
        {
          title: 'Melhorar apresentação visual',
          description: 'Adicione mais imagens de alta qualidade',
          priority: 'medium',
          category: 'Visual'
        }
      ],
      createdAt: new Date()
    };
    
    this.analyses.unshift(newAnalysis);
    return newAnalysis;
  }

  // Settings Management
  async getSettings(): Promise<AISettings> {
    await this.simulateDelay();
    return { ...this.settings };
  }

  async updateSettings(newSettings: Partial<AISettings>): Promise<AISettings> {
    await this.simulateDelay();
    this.settings = { ...this.settings, ...newSettings };
    return { ...this.settings };
  }

  // Statistics
  async getInsightStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byImpact: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    await this.simulateDelay();
    
    const stats = {
      total: this.insights.length,
      byType: {} as Record<string, number>,
      byImpact: {} as Record<string, number>,
      byStatus: {} as Record<string, number>
    };
    
    this.insights.forEach(insight => {
      stats.byType[insight.type] = (stats.byType[insight.type] || 0) + 1;
      stats.byImpact[insight.impact] = (stats.byImpact[insight.impact] || 0) + 1;
      stats.byStatus[insight.status] = (stats.byStatus[insight.status] || 0) + 1;
    });
    
    return stats;
  }

  // Utility methods
  private async simulateDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
  }

  // Generate new insights (simulate AI analysis)
  async generateNewInsights(): Promise<AIInsight[]> {
    await this.simulateDelay();
    
    const newInsights: AIInsight[] = [
      {
        id: Date.now().toString(),
        type: 'optimization',
        title: 'Nova oportunidade de otimização detectada',
        description: 'Análise automática identificou melhorias possíveis em seus produtos',
        impact: 'medium',
        confidence: 85,
        category: 'Automático',
        recommendations: [
          {
            id: `${Date.now()}-1`,
            action: 'Implementar sugestões automáticas',
            description: 'Aplicar otimizações baseadas em IA',
            priority: 'medium',
            effort: 'easy',
            estimatedImpact: '+20% performance',
            steps: ['Revisar sugestões', 'Aplicar mudanças', 'Monitorar resultados']
          }
        ],
        metrics: {
          currentValue: 100,
          projectedValue: 120,
          improvement: 20,
          unit: '% performance'
        },
        createdAt: new Date(),
        status: 'new',
        tags: ['Automático', 'IA', 'Otimização']
      }
    ];
    
    this.insights.unshift(...newInsights);
    return newInsights;
  }
}

// Singleton instance
let aiAssistantServiceInstance: AIAssistantService | null = null;

export function getAIAssistantService(): AIAssistantService {
  if (!aiAssistantServiceInstance) {
    aiAssistantServiceInstance = new AIAssistantService();
  }
  return aiAssistantServiceInstance;
}