export interface AIInsight {
  id: string;
  type: 'optimization' | 'trend' | 'pricing' | 'competition' | 'performance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  category: string;
  productId?: string;
  productTitle?: string;
  recommendations: AIRecommendation[];
  metrics: {
    currentValue: number;
    projectedValue: number;
    improvement: number;
    unit: string;
  };
  createdAt: Date;
  status: 'new' | 'viewed' | 'applied' | 'dismissed';
  tags: string[];
}

export interface AIRecommendation {
  id: string;
  action: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'easy' | 'moderate' | 'complex';
  estimatedImpact: string;
  steps: string[];
  resources?: {
    type: 'link' | 'guide' | 'tool';
    title: string;
    url: string;
  }[];
}

export interface AIChat {
  id: string;
  messages: AIChatMessage[];
  context: {
    productId?: string;
    insightId?: string;
    topic: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'chart' | 'table' | 'image';
    data: Record<string, unknown>;
    title: string;
  }[];
}

export interface AIAnalysis {
  id: string;
  type: 'product' | 'listing' | 'pricing' | 'competition';
  targetId: string; // product ID, listing ID, etc.
  analysis: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  suggestions: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }[];
  createdAt: Date;
}

export interface AISettings {
  enableAutoInsights: boolean;
  insightFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  focusAreas: {
    pricing: boolean;
    listings: boolean;
    competition: boolean;
    trends: boolean;
    performance: boolean;
  };
  notificationPreferences: {
    highImpact: boolean;
    mediumImpact: boolean;
    lowImpact: boolean;
  };
  chatHistory: boolean;
  dataRetention: number; // days
}

// Mock data
export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'optimization',
    title: 'Otimize o título do seu produto mais vendido',
    description: 'Análise de SEO indica que adicionar palavras-chave específicas pode aumentar a visibilidade em 35%',
    impact: 'high',
    confidence: 92,
    category: 'SEO',
    productId: 'MLB123456',
    productTitle: 'Smartphone Samsung Galaxy A54',
    recommendations: [
      {
        id: '1-1',
        action: 'Adicionar palavras-chave relevantes',
        description: 'Inclua termos como "5G", "128GB", "Câmera 50MP" no título',
        priority: 'high',
        effort: 'easy',
        estimatedImpact: '+35% visibilidade',
        steps: [
          'Acesse a edição do produto',
          'Modifique o título incluindo as palavras-chave sugeridas',
          'Mantenha o título dentro do limite de caracteres',
          'Salve as alterações'
        ]
      }
    ],
    metrics: {
      currentValue: 1250,
      projectedValue: 1688,
      improvement: 35,
      unit: 'visualizações/dia'
    },
    createdAt: new Date('2024-01-15T10:30:00'),
    status: 'new',
    tags: ['SEO', 'Título', 'Otimização']
  },
  {
    id: '2',
    type: 'pricing',
    title: 'Ajuste de preço competitivo detectado',
    description: 'Concorrentes reduziram preços em 8%. Recomendamos ajuste para manter competitividade',
    impact: 'medium',
    confidence: 87,
    category: 'Precificação',
    productId: 'MLB789012',
    productTitle: 'Notebook Lenovo IdeaPad 3',
    recommendations: [
      {
        id: '2-1',
        action: 'Reduzir preço em 5%',
        description: 'Mantenha competitividade sem comprometer muito a margem',
        priority: 'medium',
        effort: 'easy',
        estimatedImpact: '+15% vendas',
        steps: [
          'Analise a margem atual do produto',
          'Calcule o novo preço com desconto de 5%',
          'Atualize o preço na plataforma',
          'Monitore o desempenho por 7 dias'
        ]
      }
    ],
    metrics: {
      currentValue: 2899,
      projectedValue: 2754,
      improvement: -5,
      unit: 'R$'
    },
    createdAt: new Date('2024-01-15T09:15:00'),
    status: 'new',
    tags: ['Preço', 'Competição', 'Margem']
  },
  {
    id: '3',
    type: 'trend',
    title: 'Tendência emergente: Produtos sustentáveis',
    description: 'Crescimento de 45% em buscas por produtos eco-friendly. Oportunidade para destacar características sustentáveis',
    impact: 'high',
    confidence: 78,
    category: 'Tendências',
    recommendations: [
      {
        id: '3-1',
        action: 'Destacar características sustentáveis',
        description: 'Adicione badges e descrições sobre sustentabilidade nos produtos aplicáveis',
        priority: 'medium',
        effort: 'moderate',
        estimatedImpact: '+25% conversão',
        steps: [
          'Identifique produtos com características sustentáveis',
          'Crie badges visuais para sustentabilidade',
          'Atualize descrições destacando aspectos eco-friendly',
          'Monitore o impacto nas conversões'
        ]
      }
    ],
    metrics: {
      currentValue: 12,
      projectedValue: 15,
      improvement: 25,
      unit: '% conversão'
    },
    createdAt: new Date('2024-01-15T08:45:00'),
    status: 'viewed',
    tags: ['Sustentabilidade', 'Tendência', 'Marketing']
  }
];

export const mockAIChats: AIChat[] = [
  {
    id: '1',
    messages: [
      {
        id: '1-1',
        role: 'user',
        content: 'Como posso melhorar as vendas do meu produto mais popular?',
        timestamp: new Date('2024-01-15T14:30:00')
      },
      {
        id: '1-2',
        role: 'assistant',
        content: 'Analisando seu produto mais vendido, identifiquei 3 oportunidades principais:\n\n1. **Otimização de título**: Adicionar palavras-chave específicas pode aumentar a visibilidade em 35%\n2. **Melhoria nas imagens**: Produtos com 5+ imagens vendem 23% mais\n3. **Estratégia de preço**: Considere promoções sazonais\n\nGostaria que eu detalhe alguma dessas estratégias?',
        timestamp: new Date('2024-01-15T14:30:15')
      }
    ],
    context: {
      productId: 'MLB123456',
      topic: 'otimização de vendas'
    },
    createdAt: new Date('2024-01-15T14:30:00'),
    updatedAt: new Date('2024-01-15T14:30:15')
  }
];

export const mockAIAnalyses: AIAnalysis[] = [
  {
    id: '1',
    type: 'product',
    targetId: 'MLB123456',
    analysis: {
      score: 78,
      strengths: [
        'Preço competitivo',
        'Boa avaliação dos clientes (4.5/5)',
        'Descrição detalhada'
      ],
      weaknesses: [
        'Título pode ser otimizado para SEO',
        'Apenas 3 imagens do produto',
        'Falta de badges promocionais'
      ],
      opportunities: [
        'Adicionar mais palavras-chave no título',
        'Incluir vídeo demonstrativo',
        'Criar promoções sazonais'
      ],
      threats: [
        'Concorrentes com preços 5% menores',
        'Produtos similares com mais avaliações',
        'Mudanças no algoritmo do ML'
      ]
    },
    suggestions: [
      {
        title: 'Otimizar título para SEO',
        description: 'Adicione palavras-chave relevantes para melhorar o ranking',
        priority: 'high',
        category: 'SEO'
      },
      {
        title: 'Adicionar mais imagens',
        description: 'Produtos com 5+ imagens têm 23% mais conversões',
        priority: 'medium',
        category: 'Visual'
      }
    ],
    createdAt: new Date('2024-01-15T12:00:00')
  }
];

export const defaultAISettings: AISettings = {
  enableAutoInsights: true,
  insightFrequency: 'daily',
  focusAreas: {
    pricing: true,
    listings: true,
    competition: true,
    trends: true,
    performance: true
  },
  notificationPreferences: {
    highImpact: true,
    mediumImpact: true,
    lowImpact: false
  },
  chatHistory: true,
  dataRetention: 30
};