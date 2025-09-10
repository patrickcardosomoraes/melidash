// Tipos para o sistema de radar de tendências e monitoramento de concorrência

export interface TrendData {
  id: string;
  keyword: string;
  category: string;
  searchVolume: number;
  growth: number; // Percentual de crescimento
  period: TrendPeriod;
  region: string;
  lastUpdated: Date;
  relatedKeywords: string[];
  seasonality?: SeasonalityData;
}

export type TrendPeriod = 
  | '24h'
  | '7d'
  | '30d'
  | '90d'
  | '1y';

export interface SeasonalityData {
  peak: string; // Mês de pico
  low: string; // Mês de baixa
  pattern: 'seasonal' | 'stable' | 'growing' | 'declining';
  confidence: number; // 0-100
}

export interface CompetitorMonitoring {
  id: string;
  competitorName: string;
  competitorUrl: string;
  products: CompetitorProduct[];
  marketShare: number;
  priceStrategy: PriceStrategy;
  lastAnalyzed: Date;
  alerts: CompetitorAlert[];
  performance: CompetitorPerformance;
}

export interface CompetitorProduct {
  id: string;
  name: string;
  price: number;
  previousPrice?: number;
  priceChange?: number;
  availability: boolean;
  rating: number;
  reviewCount: number;
  lastUpdated: Date;
  url: string;
  images: string[];
  specifications?: Record<string, any>;
}

export type PriceStrategy = 
  | 'aggressive' // Preços muito baixos
  | 'competitive' // Preços competitivos
  | 'premium' // Preços altos
  | 'dynamic' // Preços que mudam frequentemente
  | 'stable'; // Preços estáveis

export interface CompetitorAlert {
  id: string;
  type: CompetitorAlertType;
  severity: AlertSeverity;
  message: string;
  productId?: string;
  data: Record<string, any>;
  createdAt: Date;
  isRead: boolean;
}

export type CompetitorAlertType = 
  | 'price_drop'
  | 'price_increase'
  | 'new_product'
  | 'out_of_stock'
  | 'back_in_stock'
  | 'promotion_started'
  | 'promotion_ended'
  | 'rating_change'
  | 'market_share_change';

export type AlertSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface CompetitorPerformance {
  salesEstimate: number;
  marketPosition: number; // Posição no mercado (1 = líder)
  priceCompetitiveness: number; // 0-100
  productQuality: number; // 0-100 baseado em reviews
  customerSatisfaction: number; // 0-100
  growthRate: number; // Percentual
  threats: ThreatLevel;
}

export type ThreatLevel = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface MarketTrend {
  id: string;
  category: string;
  trend: TrendDirection;
  impact: TrendImpact;
  description: string;
  startDate: Date;
  endDate?: Date;
  confidence: number; // 0-100
  sources: string[];
  relatedProducts: string[];
  recommendations: string[];
}

export type TrendDirection = 
  | 'rising'
  | 'falling'
  | 'stable'
  | 'volatile';

export type TrendImpact = 
  | 'low'
  | 'medium'
  | 'high'
  | 'disruptive';

export interface TrendAnalysis {
  productId: string;
  trends: MarketTrend[];
  opportunities: Opportunity[];
  threats: Threat[];
  recommendations: Recommendation[];
  lastAnalyzed: Date;
  nextAnalysis: Date;
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  description: string;
  potential: number; // Potencial de receita (R$)
  effort: EffortLevel;
  timeframe: string;
  confidence: number; // 0-100
}

export type OpportunityType = 
  | 'new_market'
  | 'price_optimization'
  | 'product_improvement'
  | 'marketing_channel'
  | 'seasonal_demand'
  | 'competitor_weakness';

export type EffortLevel = 
  | 'low'
  | 'medium'
  | 'high';

export interface Threat {
  id: string;
  type: ThreatType;
  description: string;
  impact: number; // Impacto potencial na receita (R$)
  probability: number; // 0-100
  timeframe: string;
  mitigation: string[];
}

export type ThreatType = 
  | 'new_competitor'
  | 'price_war'
  | 'market_decline'
  | 'regulation_change'
  | 'technology_shift'
  | 'supply_chain';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: RecommendationPriority;
  expectedImpact: number; // Impacto esperado na receita (R$)
  implementationCost: number;
  timeToImplement: string;
  kpis: string[];
}

export type RecommendationType = 
  | 'pricing'
  | 'inventory'
  | 'marketing'
  | 'product'
  | 'competitive'
  | 'operational';

export type RecommendationPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export interface TrendConfig {
  monitoringFrequency: number; // em horas
  keywords: string[];
  competitors: string[];
  categories: string[];
  regions: string[];
  alertThresholds: {
    priceChange: number; // %
    volumeChange: number; // %
    marketShareChange: number; // %
  };
  notifications: {
    email: boolean;
    webhook: boolean;
    inApp: boolean;
  };
}

// Mock data para desenvolvimento
export const mockTrendData: TrendData[] = [
  {
    id: '1',
    keyword: 'smartphone 5G',
    category: 'Eletrônicos',
    searchVolume: 125000,
    growth: 23.5,
    period: '30d',
    region: 'Brasil',
    lastUpdated: new Date(),
    relatedKeywords: ['celular 5G', 'telefone 5G', 'mobile 5G'],
    seasonality: {
      peak: 'Dezembro',
      low: 'Fevereiro',
      pattern: 'seasonal',
      confidence: 85
    }
  },
  {
    id: '2',
    keyword: 'notebook gamer',
    category: 'Informática',
    searchVolume: 89000,
    growth: -5.2,
    period: '30d',
    region: 'Brasil',
    lastUpdated: new Date(),
    relatedKeywords: ['laptop gamer', 'computador gamer', 'pc gamer'],
    seasonality: {
      peak: 'Novembro',
      low: 'Janeiro',
      pattern: 'seasonal',
      confidence: 78
    }
  },
  {
    id: '3',
    keyword: 'tênis running',
    category: 'Esportes',
    searchVolume: 67000,
    growth: 15.8,
    period: '30d',
    region: 'Brasil',
    lastUpdated: new Date(),
    relatedKeywords: ['tênis corrida', 'sapato corrida', 'calçado esportivo']
  }
];

export const mockCompetitors: CompetitorMonitoring[] = [
  {
    id: '1',
    competitorName: 'TechStore',
    competitorUrl: 'https://techstore.com.br',
    products: [
      {
        id: 'p1',
        name: 'iPhone 15 Pro 128GB',
        price: 7999.99,
        previousPrice: 8299.99,
        priceChange: -3.6,
        availability: true,
        rating: 4.8,
        reviewCount: 1250,
        lastUpdated: new Date(),
        url: 'https://techstore.com.br/iphone-15-pro',
        images: ['/placeholder-phone.jpg']
      }
    ],
    marketShare: 15.2,
    priceStrategy: 'competitive',
    lastAnalyzed: new Date(),
    alerts: [
      {
        id: 'a1',
        type: 'price_drop',
        severity: 'high',
        message: 'Reduziu preço do iPhone 15 Pro em 3.6%',
        productId: 'p1',
        data: { oldPrice: 8299.99, newPrice: 7999.99 },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false
      }
    ],
    performance: {
      salesEstimate: 2500000,
      marketPosition: 3,
      priceCompetitiveness: 85,
      productQuality: 88,
      customerSatisfaction: 82,
      growthRate: 12.5,
      threats: 'medium'
    }
  },
  {
    id: '2',
    competitorName: 'MegaEletro',
    competitorUrl: 'https://megaeletro.com.br',
    products: [
      {
        id: 'p2',
        name: 'Samsung Galaxy S24 256GB',
        price: 4299.99,
        availability: true,
        rating: 4.6,
        reviewCount: 890,
        lastUpdated: new Date(),
        url: 'https://megaeletro.com.br/galaxy-s24',
        images: ['/placeholder-phone.jpg']
      }
    ],
    marketShare: 22.8,
    priceStrategy: 'aggressive',
    lastAnalyzed: new Date(),
    alerts: [],
    performance: {
      salesEstimate: 3200000,
      marketPosition: 2,
      priceCompetitiveness: 92,
      productQuality: 85,
      customerSatisfaction: 79,
      growthRate: 18.3,
      threats: 'high'
    }
  }
];

export const mockMarketTrends: MarketTrend[] = [
  {
    id: '1',
    category: 'Eletrônicos',
    trend: 'rising',
    impact: 'high',
    description: 'Crescimento na demanda por dispositivos com IA integrada',
    startDate: new Date('2024-01-01'),
    confidence: 87,
    sources: ['Google Trends', 'Mercado Livre Insights', 'Pesquisa de Mercado'],
    relatedProducts: ['smartphones', 'tablets', 'smartwatches'],
    recommendations: [
      'Investir em produtos com recursos de IA',
      'Destacar funcionalidades inteligentes nas descrições',
      'Monitorar lançamentos de concorrentes'
    ]
  },
  {
    id: '2',
    category: 'Casa e Jardim',
    trend: 'rising',
    impact: 'medium',
    description: 'Aumento na procura por produtos sustentáveis e eco-friendly',
    startDate: new Date('2024-02-15'),
    confidence: 73,
    sources: ['Pesquisas de Consumo', 'Redes Sociais', 'Mercado Livre Trends'],
    relatedProducts: ['produtos de limpeza', 'decoração', 'jardinagem'],
    recommendations: [
      'Destacar certificações ambientais',
      'Criar linha de produtos sustentáveis',
      'Comunicar benefícios ecológicos'
    ]
  }
];