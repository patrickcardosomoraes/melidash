// User Types
export interface User {
  id: string;
  email: string;
  mlUserId: string;
  role: 'admin' | 'operator';
  subscription: 'free' | 'pro' | 'enterprise';
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: DashboardLayout[];
    refreshInterval: number;
  };
}

// Product Types
export interface Product {
  id: string;
  mlId: string;
  title: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: 'active' | 'paused' | 'closed';
  categoryId: string;
  condition: 'new' | 'used';
  listingType: 'gold_special' | 'gold_pro' | 'gold' | 'silver' | 'bronze' | 'free';
  automationRules: AutomationRule[];
  analytics: ProductAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductAnalytics {
  views: number;
  visits: number;
  sales: number;
  conversionRate: number;
  averageRating: number;
  questionsCount: number;
  competitorCount: number;
  rankingPosition?: number;
}

// Automation Types
export interface AutomationRule {
  id: string;
  name: string;
  type: 'price' | 'stock' | 'status' | 'listing';
  conditions: Condition[];
  actions: Action[];
  isActive: boolean;
  schedule?: ScheduleConfig;
  lastExecuted?: Date;
  executionCount: number;
  createdAt: Date;
}

export interface Condition {
  id: string;
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: string | number | boolean;
  logicalOperator?: 'AND' | 'OR';
}

export interface Action {
  id: string;
  type: 'update_price' | 'update_stock' | 'pause_listing' | 'activate_listing' | 'send_notification';
  parameters: Record<string, string | number | boolean>;
  delay?: number;
}

export interface ScheduleConfig {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  time?: string;
  days?: number[];
  timezone: string;
}

// Dashboard Types
export interface DashboardLayout {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'alert';
  title: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config: Record<string, string | number | boolean>;
  isVisible: boolean;
}

export interface DashboardMetric {
  id: string;
  name: string;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  format: 'number' | 'currency' | 'percentage';
  icon?: string;
  color?: string;
}

// Analytics Types
export interface SalesAnalytics {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Product[];
  salesByCategory: CategorySales[];
  salesTrend: TrendData[];
}

export interface CategorySales {
  categoryId: string;
  categoryName: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

// Competitor Types
export interface Competitor {
  id: string;
  mlUserId: string;
  nickname: string;
  reputation: {
    level: string;
    transactions: number;
    rating: number;
  };
  products: CompetitorProduct[];
  isMonitored: boolean;
}

export interface CompetitorProduct {
  id: string;
  mlId: string;
  title: string;
  price: number;
  stock: number;
  sales: number;
  ranking: number;
  lastUpdated: Date;
}

// Reputation Types
export interface ReputationData {
  level: 'green' | 'yellow' | 'orange' | 'red';
  score: number;
  transactions: number;
  positiveRating: number;
  neutralRating: number;
  negativeRating: number;
  claims: ClaimData[];
  metrics: ReputationMetrics;
}

export interface ClaimData {
  id: string;
  type: 'delay' | 'quality' | 'description' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  orderId: string;
  createdAt: Date;
  resolvedAt?: Date;
  autoResponse?: string;
}

export interface ReputationMetrics {
  responseTime: number;
  resolutionTime: number;
  satisfactionScore: number;
  claimsRate: number;
  improvementSuggestions: string[];
}

// AI Types
export interface AIInsight {
  id: string;
  type: 'optimization' | 'trend' | 'alert' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestedActions?: string[];
  relatedProducts?: string[];
  createdAt: Date;
}

export interface ContentOptimization {
  productId: string;
  suggestions: {
    title?: string;
    description?: string;
    attributes?: Record<string, string>;
    keywords?: string[];
    images?: string[];
  };
  currentScore: number;
  projectedScore: number;
  estimatedImpact: {
    views: number;
    sales: number;
    ranking: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Mercado Livre API Types
export interface MLProduct {
  id: string;
  title: string;
  price: number;
  available_quantity: number;
  sold_quantity: number;
  status: string;
  listing_type_id: string;
  category_id: string;
  condition: string;
  permalink: string;
  thumbnail: string;
  pictures: MLPicture[];
  attributes: MLAttribute[];
}

export interface MLPicture {
  id: string;
  url: string;
  secure_url: string;
  size: string;
  max_size: string;
}

export interface MLAttribute {
  id: string;
  name: string;
  value_id?: string;
  value_name?: string;
  values?: MLAttributeValue[];
}

export interface MLAttributeValue {
  id: string;
  name: string;
  struct?: Record<string, unknown>;
}

export interface MLUser {
  id: number;
  nickname: string;
  registration_date: string;
  first_name: string;
  last_name: string;
  country_id: string;
  email: string;
  identification: {
    number: string;
    type: string;
  };
  address: {
    state: string;
    city: string;
  };
  phone: {
    area_code: string;
    number: string;
    extension: string;
    verified: boolean;
  };
  alternative_phone: {
    area_code: string;
    number: string;
    extension: string;
  };
  user_type: string;
  tags: string[];
  logo: string;
  points: number;
  site_id: string;
  permalink: string;
  seller_reputation: {
    level_id: string;
    power_seller_status: string;
    transactions: {
      period: string;
      total: number;
      completed: number;
      canceled: number;
      ratings: {
        positive: number;
        negative: number;
        neutral: number;
      };
    };
  };
}

// Export all types
export * from './api';
export * from './components';