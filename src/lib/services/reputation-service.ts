import { 
  ReputationMetrics, 
  Review, 
  ReputationAlert, 
  ReputationGoal, 
  ReputationTrend,
  ReviewCategory,
  SellerResponse,
  ReputationSettings,
  defaultReputationSettings,
  mockReputationMetrics,
  mockReviews,
  mockReputationAlerts,
  mockReputationTrends
} from '@/types/reputation';
import { getConfig } from '@/lib/config/production';

export class ReputationService {
  private metrics: ReputationMetrics;
  private reviews: Review[] = [];
  private alerts: ReputationAlert[] = [];
  private trends: ReputationTrend[] = [];
  private goals: ReputationGoal[] = [];
  private settings: ReputationSettings = { ...defaultReputationSettings };

  constructor() {
    const config = getConfig();
    if (config.USE_MOCK_DATA) {
      this.metrics = mockReputationMetrics;
      this.reviews = mockReviews;
      this.alerts = mockReputationAlerts;
      this.trends = mockReputationTrends;
    } else {
      // Inicializar com dados vazios em produção
      this.metrics = {
        overall: 0,
        delivery: 0,
        communication: 0,
        productQuality: 0,
        customerService: 0,
        totalReviews: 0,
        averageRating: 0,
        responseRate: 0,
        lastUpdated: new Date()
      };
    }
  }

  // Métricas de reputação
  async getReputationMetrics(): Promise<ReputationMetrics> {
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...this.metrics };
  }

  async getReputationTrends(days: number = 30): Promise<ReputationTrend[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.trends.slice(-days);
  }

  // Simulador de termômetro
  calculateTemperature(metrics: ReputationMetrics): {
    temperature: number;
    status: 'cold' | 'cool' | 'warm' | 'hot' | 'burning';
    color: string;
  } {
    const temperature = metrics.overall;
    
    let status: 'cold' | 'cool' | 'warm' | 'hot' | 'burning';
    let color: string;

    if (temperature >= 95) {
      status = 'burning';
      color = '#ef4444'; // red-500
    } else if (temperature >= 85) {
      status = 'hot';
      color = '#f97316'; // orange-500
    } else if (temperature >= 70) {
      status = 'warm';
      color = '#eab308'; // yellow-500
    } else if (temperature >= 50) {
      status = 'cool';
      color = '#3b82f6'; // blue-500
    } else {
      status = 'cold';
      color = '#6366f1'; // indigo-500
    }

    return { temperature, status, color };
  }

  // Gerenciamento de avaliações
  async getReviews(filters?: {
    sentiment?: 'positive' | 'negative' | 'neutral';
    category?: ReviewCategory;
    needsResponse?: boolean;
    limit?: number;
  }): Promise<Review[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filteredReviews = [...this.reviews];

    if (filters?.sentiment) {
      filteredReviews = filteredReviews.filter(r => r.sentiment === filters.sentiment);
    }

    if (filters?.category) {
      filteredReviews = filteredReviews.filter(r => r.category === filters.category);
    }

    if (filters?.needsResponse) {
      filteredReviews = filteredReviews.filter(r => !r.response && !r.isResolved);
    }

    if (filters?.limit) {
      filteredReviews = filteredReviews.slice(0, filters.limit);
    }

    return filteredReviews.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async respondToReview(reviewId: string, response: string, isPublic: boolean = true): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex !== -1) {
      const sellerResponse: SellerResponse = {
        id: `resp-${Date.now()}`,
        message: response,
        date: new Date(),
        isPublic
      };

      this.reviews[reviewIndex].response = sellerResponse;
      this.reviews[reviewIndex].isResolved = true;

      // Remove alerta relacionado
      this.alerts = this.alerts.filter(a => a.reviewId !== reviewId);
    }
  }

  // Alertas de reputação
  async getReputationAlerts(unreadOnly: boolean = false): Promise<ReputationAlert[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let filteredAlerts = [...this.alerts];
    
    if (unreadOnly) {
      filteredAlerts = filteredAlerts.filter(a => !a.isRead);
    }

    return filteredAlerts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    const alertIndex = this.alerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      this.alerts[alertIndex].isRead = true;
    }
  }

  async dismissAlert(alertId: string): Promise<void> {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
  }

  // Metas de reputação
  async getReputationGoals(): Promise<ReputationGoal[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.goals];
  }

  async createReputationGoal(goal: Omit<ReputationGoal, 'id'>): Promise<ReputationGoal> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newGoal: ReputationGoal = {
      ...goal,
      id: `goal-${Date.now()}`
    };

    this.goals.push(newGoal);
    return newGoal;
  }

  async updateReputationGoal(goalId: string, updates: Partial<ReputationGoal>): Promise<void> {
    const goalIndex = this.goals.findIndex(g => g.id === goalId);
    if (goalIndex !== -1) {
      this.goals[goalIndex] = { ...this.goals[goalIndex], ...updates };
    }
  }

  async deleteReputationGoal(goalId: string): Promise<void> {
    this.goals = this.goals.filter(g => g.id !== goalId);
  }

  // Análise de sentimento
  analyzeSentiment(comment: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['excelente', 'ótimo', 'bom', 'recomendo', 'perfeito', 'rápido', 'qualidade'];
    const negativeWords = ['ruim', 'péssimo', 'defeito', 'problema', 'demorou', 'não recomendo', 'horrível'];
    
    const lowerComment = comment.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => lowerComment.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerComment.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Simulação de dados em tempo real
  simulateRealtimeUpdate(): void {
    // Simula mudanças nas métricas
    const variation = () => Math.random() * 4 - 2; // -2 a +2
    
    this.metrics = {
      ...this.metrics,
      overall: Math.max(0, Math.min(100, this.metrics.overall + variation())),
      delivery: Math.max(0, Math.min(100, this.metrics.delivery + variation())),
      communication: Math.max(0, Math.min(100, this.metrics.communication + variation())),
      productQuality: Math.max(0, Math.min(100, this.metrics.productQuality + variation())),
      customerService: Math.max(0, Math.min(100, this.metrics.customerService + variation())),
      lastUpdated: new Date()
    };
  }

  // Relatórios
  async generateReputationReport(period: 'week' | 'month' | 'quarter'): Promise<{
    summary: ReputationMetrics;
    trends: ReputationTrend[];
    topIssues: { category: ReviewCategory; count: number; avgRating: number }[];
    improvements: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const trends = this.trends.slice(-days);
    
    // Análise de problemas por categoria
    const negativeReviews = this.reviews.filter(r => r.sentiment === 'negative');
    const issuesByCategory = negativeReviews.reduce((acc, review) => {
      if (!acc[review.category]) {
        acc[review.category] = { count: 0, totalRating: 0 };
      }
      acc[review.category].count++;
      acc[review.category].totalRating += review.rating;
      return acc;
    }, {} as Record<ReviewCategory, { count: number; totalRating: number }>);

    const topIssues = Object.entries(issuesByCategory)
      .map(([category, data]) => ({
        category: category as ReviewCategory,
        count: data.count,
        avgRating: data.totalRating / data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Sugestões de melhoria
    const improvements = [
      'Responder mais rapidamente às avaliações negativas',
      'Melhorar o processo de embalagem dos produtos',
      'Implementar follow-up pós-venda',
      'Criar templates de resposta para problemas comuns',
      'Monitorar métricas de entrega mais de perto'
    ];

    return {
      summary: this.metrics,
      trends,
      topIssues,
      improvements
    };
  }
}

// Singleton instance
let reputationServiceInstance: ReputationService | null = null;

export function getReputationService(): ReputationService {
  if (!reputationServiceInstance) {
    reputationServiceInstance = new ReputationService();
  }
  return reputationServiceInstance;
}