// Tipos para o sistema de automação de preços

export interface PricingRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  priority: number; // Ordem de execução (menor número = maior prioridade)
  conditions: PricingCondition[];
  actions: PricingAction[];
  schedule?: PricingSchedule;
  createdAt: Date;
  updatedAt: Date;
  lastExecuted?: Date;
  executionCount: number;
}

export interface PricingCondition {
  id: string;
  type: ConditionType;
  operator: ConditionOperator;
  value: any;
  field: string;
}

export type ConditionType = 
  | 'competitor_price'
  | 'stock_level'
  | 'sales_velocity'
  | 'profit_margin'
  | 'time_based'
  | 'category_trend'
  | 'product_age'
  | 'conversion_rate';

export type ConditionOperator = 
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'greater_equal'
  | 'less_equal'
  | 'between'
  | 'contains'
  | 'not_contains';

export interface PricingAction {
  id: string;
  type: ActionType;
  value: number;
  unit: ActionUnit;
  limits?: PricingLimits;
}

export type ActionType = 
  | 'increase_price'
  | 'decrease_price'
  | 'set_price'
  | 'match_competitor'
  | 'set_margin'
  | 'pause_product'
  | 'activate_product';

export type ActionUnit = 
  | 'percentage'
  | 'fixed_amount'
  | 'competitor_offset';

export interface PricingLimits {
  minPrice?: number;
  maxPrice?: number;
  minMargin?: number;
  maxMargin?: number;
  maxChangePercentage?: number;
}

export interface PricingSchedule {
  frequency: ScheduleFrequency;
  interval: number;
  daysOfWeek?: number[]; // 0-6 (domingo-sábado)
  timeOfDay?: string; // HH:MM format
  timezone: string;
}

export type ScheduleFrequency = 
  | 'minutes'
  | 'hours'
  | 'daily'
  | 'weekly'
  | 'monthly';

export interface PricingExecution {
  id: string;
  ruleId: string;
  productId: string;
  executedAt: Date;
  status: ExecutionStatus;
  oldPrice: number;
  newPrice: number;
  reason: string;
  error?: string;
  metadata?: Record<string, any>;
}

export type ExecutionStatus = 
  | 'success'
  | 'failed'
  | 'skipped'
  | 'partial';

export interface CompetitorData {
  productId: string;
  competitorName: string;
  competitorPrice: number;
  competitorUrl: string;
  lastUpdated: Date;
  availability: boolean;
  shipping?: {
    cost: number;
    time: string;
  };
}

export interface PricingAnalytics {
  productId: string;
  period: AnalyticsPeriod;
  metrics: {
    averagePrice: number;
    priceChanges: number;
    salesImpact: {
      before: number;
      after: number;
      changePercentage: number;
    };
    profitImpact: {
      before: number;
      after: number;
      changePercentage: number;
    };
    competitorComparison: {
      averageCompetitorPrice: number;
      pricePosition: 'lowest' | 'competitive' | 'premium';
      marketShare: number;
    };
  };
}

export type AnalyticsPeriod = 
  | '24h'
  | '7d'
  | '30d'
  | '90d'
  | 'custom';

export interface PricingStrategy {
  id: string;
  name: string;
  description: string;
  type: StrategyType;
  rules: string[]; // IDs das regras
  isActive: boolean;
  products: string[]; // IDs dos produtos
  createdAt: Date;
  updatedAt: Date;
}

export type StrategyType = 
  | 'competitive'
  | 'profit_maximization'
  | 'market_penetration'
  | 'inventory_clearance'
  | 'dynamic_pricing'
  | 'custom';

export interface PricingRecommendation {
  productId: string;
  currentPrice: number;
  recommendedPrice: number;
  confidence: number; // 0-100
  reasoning: string[];
  expectedImpact: {
    salesChange: number;
    profitChange: number;
    competitivePosition: string;
  };
  validUntil: Date;
}

export interface PricingAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  productId: string;
  message: string;
  data: Record<string, any>;
  createdAt: Date;
  isRead: boolean;
  actionRequired: boolean;
}

export type AlertType = 
  | 'competitor_price_drop'
  | 'competitor_price_increase'
  | 'low_margin_warning'
  | 'high_price_warning'
  | 'stock_level_critical'
  | 'rule_execution_failed'
  | 'price_change_significant';

export type AlertSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface PricingConfig {
  globalLimits: PricingLimits;
  defaultSchedule: PricingSchedule;
  competitorMonitoring: {
    enabled: boolean;
    frequency: number; // em minutos
    sources: string[];
  };
  notifications: {
    email: boolean;
    webhook: boolean;
    inApp: boolean;
  };
  riskManagement: {
    maxDailyChanges: number;
    maxChangePercentage: number;
    requireApprovalAbove: number;
  };
}

// Utilitários para validação
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Mock data para desenvolvimento
export const mockPricingRules: PricingRule[] = [
  {
    id: '1',
    name: 'Competir com Concorrentes',
    description: 'Ajustar preço para ficar 5% abaixo do menor concorrente',
    isActive: true,
    priority: 1,
    conditions: [
      {
        id: 'c1',
        type: 'competitor_price',
        operator: 'less_than',
        value: 0,
        field: 'current_price'
      }
    ],
    actions: [
      {
        id: 'a1',
        type: 'match_competitor',
        value: -5,
        unit: 'percentage',
        limits: {
          minMargin: 15,
          maxChangePercentage: 20
        }
      }
    ],
    schedule: {
      frequency: 'hours',
      interval: 6,
      timezone: 'America/Sao_Paulo'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    lastExecuted: new Date('2024-01-20T10:00:00'),
    executionCount: 45
  },
  {
    id: '2',
    name: 'Liquidação de Estoque',
    description: 'Reduzir preços quando estoque estiver baixo',
    isActive: true,
    priority: 2,
    conditions: [
      {
        id: 'c2',
        type: 'stock_level',
        operator: 'less_than',
        value: 10,
        field: 'available_quantity'
      }
    ],
    actions: [
      {
        id: 'a2',
        type: 'decrease_price',
        value: 10,
        unit: 'percentage',
        limits: {
          minMargin: 5,
          maxChangePercentage: 25
        }
      }
    ],
    schedule: {
      frequency: 'daily',
      interval: 1,
      timeOfDay: '09:00',
      timezone: 'America/Sao_Paulo'
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    lastExecuted: new Date('2024-01-20T09:00:00'),
    executionCount: 12
  }
];