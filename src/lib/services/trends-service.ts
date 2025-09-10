// Serviço para radar de tendências e monitoramento de concorrência

import {
  TrendData,
  CompetitorMonitoring,
  MarketTrend,
  TrendAnalysis,
  Opportunity,
  Threat,
  Recommendation,
  TrendConfig,
  CompetitorAlert,
  TrendPeriod,
  mockTrendData,
  mockCompetitors,
  mockMarketTrends
} from '@/types/trends';
import { getConfig } from '@/lib/config/production';

export class TrendsService {
  private static instance: TrendsService;
  private config: TrendConfig;
  private trendData: TrendData[] = [];
  private competitors: CompetitorMonitoring[] = [];
  private marketTrends: MarketTrend[] = [];
  private alerts: CompetitorAlert[] = [];

  private constructor() {
    this.config = {
      monitoringFrequency: 6, // 6 horas
      keywords: ['smartphone', 'notebook', 'tablet', 'smartwatch'],
      competitors: ['techstore.com.br', 'megaeletro.com.br', 'digitalstore.com.br'],
      categories: ['Eletrônicos', 'Informática', 'Casa e Jardim', 'Esportes'],
      regions: ['Brasil', 'São Paulo', 'Rio de Janeiro'],
      alertThresholds: {
        priceChange: 5, // 5%
        volumeChange: 20, // 20%
        marketShareChange: 2 // 2%
      },
      notifications: {
        email: true,
        webhook: false,
        inApp: true
      }
    };
    
    const config = getConfig();
    if (config.USE_MOCK_DATA) {
      // Inicializar com dados mock apenas em desenvolvimento
      this.loadMockData();
    }
  }

  public static getInstance(): TrendsService {
    if (!TrendsService.instance) {
      TrendsService.instance = new TrendsService();
    }
    return TrendsService.instance;
  }

  private loadMockData(): void {
    this.trendData = [...mockTrendData];
    this.competitors = [...mockCompetitors];
    this.marketTrends = [...mockMarketTrends];
    
    // Carregar alertas dos concorrentes
    this.alerts = this.competitors.flatMap(competitor => competitor.alerts);
  }

  // Métodos para Tendências
  public async getTrendData(period: TrendPeriod = '30d', category?: string): Promise<TrendData[]> {
    let filteredData = this.trendData.filter(trend => trend.period === period);
    
    if (category) {
      filteredData = filteredData.filter(trend => trend.category === category);
    }
    
    return filteredData.sort((a, b) => b.growth - a.growth);
  }

  public async searchTrends(query: string): Promise<TrendData[]> {
    const lowerQuery = query.toLowerCase();
    return this.trendData.filter(trend => 
      trend.keyword.toLowerCase().includes(lowerQuery) ||
      trend.relatedKeywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );
  }

  public async getTrendsByCategory(category: string): Promise<TrendData[]> {
    return this.trendData.filter(trend => trend.category === category);
  }

  public async getTopGrowingTrends(limit: number = 10): Promise<TrendData[]> {
    return this.trendData
      .sort((a, b) => b.growth - a.growth)
      .slice(0, limit);
  }

  public async getSeasonalTrends(): Promise<TrendData[]> {
    return this.trendData.filter(trend => trend.seasonality);
  }

  // Métodos para Monitoramento de Concorrência
  public async getCompetitors(): Promise<CompetitorMonitoring[]> {
    return this.competitors.sort((a, b) => b.marketShare - a.marketShare);
  }

  public async getCompetitorById(id: string): Promise<CompetitorMonitoring | null> {
    return this.competitors.find(competitor => competitor.id === id) || null;
  }

  public async addCompetitor(competitor: Omit<CompetitorMonitoring, 'id' | 'lastAnalyzed'>): Promise<CompetitorMonitoring> {
    const newCompetitor: CompetitorMonitoring = {
      ...competitor,
      id: Date.now().toString(),
      lastAnalyzed: new Date()
    };
    
    this.competitors.push(newCompetitor);
    return newCompetitor;
  }

  public async updateCompetitor(id: string, updates: Partial<CompetitorMonitoring>): Promise<CompetitorMonitoring | null> {
    const index = this.competitors.findIndex(competitor => competitor.id === id);
    if (index === -1) return null;
    
    this.competitors[index] = {
      ...this.competitors[index],
      ...updates,
      lastAnalyzed: new Date()
    };
    
    return this.competitors[index];
  }

  public async removeCompetitor(id: string): Promise<boolean> {
    const index = this.competitors.findIndex(competitor => competitor.id === id);
    if (index === -1) return false;
    
    this.competitors.splice(index, 1);
    return true;
  }

  // Métodos para Alertas
  public async getAlerts(unreadOnly: boolean = false): Promise<CompetitorAlert[]> {
    let filteredAlerts = this.alerts;
    
    if (unreadOnly) {
      filteredAlerts = filteredAlerts.filter(alert => !alert.isRead);
    }
    
    return filteredAlerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public async markAlertAsRead(alertId: string): Promise<boolean> {
    const alert = this.alerts.find(alert => alert.id === alertId);
    if (!alert) return false;
    
    alert.isRead = true;
    return true;
  }

  public async markAllAlertsAsRead(): Promise<void> {
    this.alerts.forEach(alert => alert.isRead = true);
  }

  public async getAlertsByType(type: string): Promise<CompetitorAlert[]> {
    return this.alerts.filter(alert => alert.type === type);
  }

  // Métodos para Análise de Mercado
  public async getMarketTrends(): Promise<MarketTrend[]> {
    return this.marketTrends.sort((a, b) => b.confidence - a.confidence);
  }

  public async getTrendAnalysis(productId: string): Promise<TrendAnalysis> {
    // Simular análise de tendências para um produto
    const relevantTrends = this.marketTrends.filter(trend => 
      trend.relatedProducts.some(product => product.includes(productId.toLowerCase()))
    );
    
    const opportunities: Opportunity[] = [
      {
        id: '1',
        type: 'price_optimization',
        description: 'Oportunidade de ajustar preços baseado em tendências de mercado',
        potential: 15000,
        effort: 'low',
        timeframe: '1-2 semanas',
        confidence: 78
      },
      {
        id: '2',
        type: 'seasonal_demand',
        description: 'Aproveitar pico sazonal de demanda em dezembro',
        potential: 45000,
        effort: 'medium',
        timeframe: '2-3 meses',
        confidence: 85
      }
    ];
    
    const threats: Threat[] = [
      {
        id: '1',
        type: 'price_war',
        description: 'Concorrentes podem iniciar guerra de preços',
        impact: 25000,
        probability: 65,
        timeframe: '1 mês',
        mitigation: [
          'Monitorar preços diariamente',
          'Preparar estratégia de resposta rápida',
          'Focar em diferenciação de valor'
        ]
      }
    ];
    
    const recommendations: Recommendation[] = [
      {
        id: '1',
        type: 'pricing',
        title: 'Otimizar Estratégia de Preços',
        description: 'Ajustar preços baseado em análise competitiva e tendências',
        priority: 'high',
        expectedImpact: 20000,
        implementationCost: 2000,
        timeToImplement: '1 semana',
        kpis: ['Margem de lucro', 'Volume de vendas', 'Posição competitiva']
      },
      {
        id: '2',
        type: 'marketing',
        title: 'Campanha Sazonal',
        description: 'Criar campanha focada no pico de demanda sazonal',
        priority: 'medium',
        expectedImpact: 35000,
        implementationCost: 8000,
        timeToImplement: '3 semanas',
        kpis: ['ROI da campanha', 'Conversão', 'Awareness']
      }
    ];
    
    return {
      productId,
      trends: relevantTrends,
      opportunities,
      threats,
      recommendations,
      lastAnalyzed: new Date(),
      nextAnalysis: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
    };
  }

  // Métodos para Configuração
  public getConfig(): TrendConfig {
    return { ...this.config };
  }

  public async updateConfig(updates: Partial<TrendConfig>): Promise<TrendConfig> {
    this.config = { ...this.config, ...updates };
    return this.config;
  }

  // Métodos de Análise e Insights
  public async getCompetitiveInsights(): Promise<{
    marketLeader: CompetitorMonitoring;
    fastestGrowing: CompetitorMonitoring;
    biggestThreat: CompetitorMonitoring;
    priceAggressor: CompetitorMonitoring;
  }> {
    const marketLeader = this.competitors.reduce((leader, competitor) => 
      competitor.marketShare > leader.marketShare ? competitor : leader
    );
    
    const fastestGrowing = this.competitors.reduce((fastest, competitor) => 
      competitor.performance.growthRate > fastest.performance.growthRate ? competitor : fastest
    );
    
    const biggestThreat = this.competitors.reduce((threat, competitor) => 
      competitor.performance.threats === 'critical' || competitor.performance.threats === 'high' ? competitor : threat
    );
    
    const priceAggressor = this.competitors.find(competitor => 
      competitor.priceStrategy === 'aggressive'
    ) || this.competitors[0];
    
    return {
      marketLeader,
      fastestGrowing,
      biggestThreat,
      priceAggressor
    };
  }

  public async getTrendSummary(): Promise<{
    totalTrends: number;
    growingTrends: number;
    decliningTrends: number;
    stableTrends: number;
    topCategories: { category: string; count: number; avgGrowth: number }[];
  }> {
    const totalTrends = this.trendData.length;
    const growingTrends = this.trendData.filter(trend => trend.growth > 0).length;
    const decliningTrends = this.trendData.filter(trend => trend.growth < 0).length;
    const stableTrends = this.trendData.filter(trend => trend.growth === 0).length;
    
    const categoryStats = this.trendData.reduce((acc, trend) => {
      if (!acc[trend.category]) {
        acc[trend.category] = { count: 0, totalGrowth: 0 };
      }
      acc[trend.category].count++;
      acc[trend.category].totalGrowth += trend.growth;
      return acc;
    }, {} as Record<string, { count: number; totalGrowth: number }>);
    
    const topCategories = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        count: stats.count,
        avgGrowth: stats.totalGrowth / stats.count
      }))
      .sort((a, b) => b.avgGrowth - a.avgGrowth);
    
    return {
      totalTrends,
      growingTrends,
      decliningTrends,
      stableTrends,
      topCategories
    };
  }

  // Simulação de monitoramento em tempo real
  public async startMonitoring(): Promise<void> {
    console.log('Iniciando monitoramento de tendências e concorrência...');
    // Em uma implementação real, isso iniciaria um processo de monitoramento
    // que faria chamadas para APIs externas periodicamente
  }

  public async stopMonitoring(): Promise<void> {
    console.log('Parando monitoramento de tendências e concorrência...');
  }
}

// Singleton instance
export const getTrendsService = (): TrendsService => {
  return TrendsService.getInstance();
};