export interface ReputationMetrics {
  overall: number; // 0-100
  delivery: number;
  communication: number;
  productQuality: number;
  customerService: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  rating: number; // 1-5
  comment: string;
  customerName: string;
  date: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: ReviewCategory;
  response?: SellerResponse;
  isResolved: boolean;
}

export interface SellerResponse {
  id: string;
  message: string;
  date: Date;
  isPublic: boolean;
}

export type ReviewCategory = 
  | 'delivery'
  | 'product_quality'
  | 'communication'
  | 'packaging'
  | 'price'
  | 'other';

export interface ReputationAlert {
  id: string;
  type: 'negative_review' | 'rating_drop' | 'response_needed' | 'trend_warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  reviewId?: string;
  date: Date;
  isRead: boolean;
  actionRequired: boolean;
}

export interface ReputationGoal {
  id: string;
  metric: keyof ReputationMetrics;
  target: number;
  current: number;
  deadline: Date;
  isActive: boolean;
}

export interface ReputationTrend {
  date: Date;
  overall: number;
  delivery: number;
  communication: number;
  productQuality: number;
  customerService: number;
  reviewCount: number;
}

// Mock data
export const mockReputationMetrics: ReputationMetrics = {
  overall: 87,
  delivery: 92,
  communication: 85,
  productQuality: 89,
  customerService: 83,
  trend: 'up',
  lastUpdated: new Date()
};

export const mockReviews: Review[] = [
  {
    id: '1',
    productId: 'prod-1',
    productName: 'Smartphone Samsung Galaxy A54',
    rating: 5,
    comment: 'Produto excelente, entrega rápida e bem embalado!',
    customerName: 'Maria Silva',
    date: new Date('2024-01-15'),
    sentiment: 'positive',
    category: 'delivery',
    isResolved: true
  },
  {
    id: '2',
    productId: 'prod-2',
    productName: 'Notebook Dell Inspiron',
    rating: 2,
    comment: 'Produto chegou com defeito, tela com riscos.',
    customerName: 'João Santos',
    date: new Date('2024-01-14'),
    sentiment: 'negative',
    category: 'product_quality',
    isResolved: false
  },
  {
    id: '3',
    productId: 'prod-3',
    productName: 'Fone de Ouvido JBL',
    rating: 4,
    comment: 'Bom produto, mas a entrega demorou mais que o esperado.',
    customerName: 'Ana Costa',
    date: new Date('2024-01-13'),
    sentiment: 'neutral',
    category: 'delivery',
    response: {
      id: 'resp-1',
      message: 'Obrigado pelo feedback! Estamos trabalhando para melhorar nossos prazos de entrega.',
      date: new Date('2024-01-14'),
      isPublic: true
    },
    isResolved: true
  }
];

export const mockReputationAlerts: ReputationAlert[] = [
  {
    id: 'alert-1',
    type: 'negative_review',
    severity: 'high',
    title: 'Nova avaliação negativa',
    description: 'Produto chegou com defeito - necessária resposta',
    reviewId: '2',
    date: new Date('2024-01-14'),
    isRead: false,
    actionRequired: true
  },
  {
    id: 'alert-2',
    type: 'rating_drop',
    severity: 'medium',
    title: 'Queda na avaliação geral',
    description: 'Avaliação geral caiu 2 pontos na última semana',
    date: new Date('2024-01-13'),
    isRead: false,
    actionRequired: false
  }
];

export const mockReputationTrends: ReputationTrend[] = [
  {
    date: new Date('2024-01-01'),
    overall: 85,
    delivery: 88,
    communication: 82,
    productQuality: 87,
    customerService: 80,
    reviewCount: 45
  },
  {
    date: new Date('2024-01-08'),
    overall: 86,
    delivery: 90,
    communication: 84,
    productQuality: 88,
    customerService: 82,
    reviewCount: 52
  },
  {
    date: new Date('2024-01-15'),
    overall: 87,
    delivery: 92,
    communication: 85,
    productQuality: 89,
    customerService: 83,
    reviewCount: 58
  }
];