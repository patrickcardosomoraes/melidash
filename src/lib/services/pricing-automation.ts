import { 
  PricingRule, 
  PricingExecution, 
  CompetitorData, 
  PricingRecommendation,
  PricingAlert,
  ValidationResult,
  PricingCondition,
  PricingAction,
  PricingLimits
} from '@/types/pricing';
import { MLProduct } from '@/types/api';
import { getMercadoLivreAPI } from '@/lib/api/mercado-livre';

export class PricingAutomationService {
  private mlApi: ReturnType<typeof getMercadoLivreAPI>;
  private executionHistory: PricingExecution[] = [];
  private competitorData: Map<string, CompetitorData[]> = new Map();
  private alerts: PricingAlert[] = [];

  constructor(mlApi: ReturnType<typeof getMercadoLivreAPI>) {
    this.mlApi = mlApi;
  }

  // Executar uma regra específica
  async executeRule(rule: PricingRule, products: MLProduct[]): Promise<PricingExecution[]> {
    const executions: PricingExecution[] = [];

    if (!rule.isActive) {
      console.log(`Regra ${rule.name} está inativa`);
      return executions;
    }

    for (const product of products) {
      try {
        const execution = await this.executeRuleForProduct(rule, product);
        executions.push(execution);
        this.executionHistory.push(execution);
      } catch (error) {
        console.error(`Erro ao executar regra ${rule.name} para produto ${product.id}:`, error);
        
        const failedExecution: PricingExecution = {
          id: this.generateId(),
          ruleId: rule.id,
          productId: product.id,
          executedAt: new Date(),
          status: 'failed',
          oldPrice: product.price,
          newPrice: product.price,
          reason: 'Erro na execução',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        };
        
        executions.push(failedExecution);
        this.executionHistory.push(failedExecution);
      }
    }

    return executions;
  }

  // Executar regra para um produto específico
  private async executeRuleForProduct(rule: PricingRule, product: MLProduct): Promise<PricingExecution> {
    const execution: PricingExecution = {
      id: this.generateId(),
      ruleId: rule.id,
      productId: product.id,
      executedAt: new Date(),
      status: 'skipped',
      oldPrice: product.price,
      newPrice: product.price,
      reason: 'Condições não atendidas'
    };

    // Verificar condições
    const conditionsMet = await this.evaluateConditions(rule.conditions, product);
    
    if (!conditionsMet.isValid) {
      execution.reason = `Condições não atendidas: ${conditionsMet.errors.join(', ')}`;
      return execution;
    }

    // Calcular novo preço baseado nas ações
    const newPrice = await this.calculateNewPrice(rule.actions, product);
    
    if (newPrice === product.price) {
      execution.reason = 'Preço já está no valor correto';
      return execution;
    }

    // Validar limites
    const validation = this.validatePriceChange(product, newPrice, rule.actions[0].limits);
    
    if (!validation.isValid) {
      execution.status = 'failed';
      execution.reason = `Validação falhou: ${validation.errors.join(', ')}`;
      execution.error = validation.errors.join(', ');
      return execution;
    }

    // Aplicar mudança de preço
    try {
      await this.mlApi.updateProduct(product.id, { price: newPrice });
      
      execution.status = 'success';
      execution.newPrice = newPrice;
      execution.reason = `Preço atualizado de R$ ${product.price.toFixed(2)} para R$ ${newPrice.toFixed(2)}`;
      
      // Criar alerta se a mudança for significativa
      const changePercentage = Math.abs((newPrice - product.price) / product.price) * 100;
      if (changePercentage > 15) {
        this.createAlert({
          type: 'price_change_significant',
          severity: 'medium',
          productId: product.id,
          message: `Preço alterado em ${changePercentage.toFixed(1)}%`,
          data: {
            oldPrice: product.price,
            newPrice,
            changePercentage,
            ruleName: rule.name
          }
        });
      }
      
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Erro ao atualizar preço';
      execution.reason = 'Falha ao aplicar mudança de preço';
    }

    return execution;
  }

  // Avaliar condições da regra
  private async evaluateConditions(conditions: PricingCondition[], product: MLProduct): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    for (const condition of conditions) {
      const conditionResult = await this.evaluateCondition(condition, product);
      
      if (!conditionResult) {
        result.isValid = false;
        result.errors.push(`Condição ${condition.type} não atendida`);
      }
    }

    return result;
  }

  // Avaliar uma condição específica
  private async evaluateCondition(condition: PricingCondition, product: MLProduct): Promise<boolean> {
    switch (condition.type) {
      case 'competitor_price':
        return this.evaluateCompetitorPriceCondition(condition, product);
      
      case 'stock_level':
        return this.evaluateStockCondition(condition, product);
      
      case 'sales_velocity':
        return this.evaluateSalesVelocityCondition(condition, product);
      
      case 'profit_margin':
        return this.evaluateProfitMarginCondition(condition, product);
      
      case 'time_based':
        return this.evaluateTimeBasedCondition(condition, product);
      
      default:
        console.warn(`Tipo de condição não implementado: ${condition.type}`);
        return false;
    }
  }

  // Avaliar condição de preço de concorrente
  private async evaluateCompetitorPriceCondition(condition: PricingCondition, product: MLProduct): Promise<boolean> {
    const competitors = this.competitorData.get(product.id) || [];
    
    if (competitors.length === 0) {
      // Simular dados de concorrente para demonstração
      const mockCompetitor: CompetitorData = {
        productId: product.id,
        competitorName: 'Concorrente A',
        competitorPrice: product.price * (0.9 + Math.random() * 0.2), // ±10%
        competitorUrl: 'https://exemplo.com',
        lastUpdated: new Date(),
        availability: true
      };
      
      this.competitorData.set(product.id, [mockCompetitor]);
      return mockCompetitor.competitorPrice < product.price;
    }

    const lowestCompetitorPrice = Math.min(...competitors.map(c => c.competitorPrice));
    
    switch (condition.operator) {
      case 'less_than':
        return lowestCompetitorPrice < product.price;
      case 'greater_than':
        return lowestCompetitorPrice > product.price;
      case 'less_equal':
        return lowestCompetitorPrice <= product.price;
      case 'greater_equal':
        return lowestCompetitorPrice >= product.price;
      default:
        return false;
    }
  }

  // Avaliar condição de estoque
  private evaluateStockCondition(condition: PricingCondition, product: MLProduct): boolean {
    const stockLevel = product.availableQuantity;
    
    const conditionValue = typeof condition.value === 'number' ? condition.value : 0;
    
    switch (condition.operator) {
      case 'less_than':
        return stockLevel < conditionValue;
      case 'greater_than':
        return stockLevel > conditionValue;
      case 'less_equal':
        return stockLevel <= conditionValue;
      case 'greater_equal':
        return stockLevel >= conditionValue;
      case 'equals':
        return stockLevel === conditionValue;
      default:
        return false;
    }
  }

  // Avaliar condição de velocidade de vendas (mock)
  private evaluateSalesVelocityCondition(condition: PricingCondition, product: MLProduct): boolean {
    // Simular velocidade de vendas baseada no estoque vendido
    const salesVelocity = product.soldQuantity / Math.max(1, product.initialQuantity);
    
    const conditionValue = typeof condition.value === 'number' ? condition.value : 0;
    
    switch (condition.operator) {
      case 'less_than':
        return salesVelocity < conditionValue;
      case 'greater_than':
        return salesVelocity > conditionValue;
      default:
        return false;
    }
  }

  // Avaliar condição de margem de lucro (mock)
  private evaluateProfitMarginCondition(condition: PricingCondition, product: MLProduct): boolean {
    // Simular margem de lucro (assumindo custo de 70% do preço)
    const estimatedCost = product.price * 0.7;
    const margin = ((product.price - estimatedCost) / product.price) * 100;
    
    const conditionValue = typeof condition.value === 'number' ? condition.value : 0;
    
    switch (condition.operator) {
      case 'less_than':
        return margin < conditionValue;
      case 'greater_than':
        return margin > conditionValue;
      default:
        return false;
    }
  }

  // Avaliar condição baseada em tempo
  private evaluateTimeBasedCondition(condition: PricingCondition, product: MLProduct): boolean {
    const now = new Date();
    const productAge = now.getTime() - new Date(product.dateCreated).getTime();
    const ageInDays = productAge / (1000 * 60 * 60 * 24);
    
    const conditionValue = typeof condition.value === 'number' ? condition.value : 0;
    
    switch (condition.operator) {
      case 'greater_than':
        return ageInDays > conditionValue;
      case 'less_than':
        return ageInDays < conditionValue;
      default:
        return false;
    }
  }

  // Calcular novo preço baseado nas ações
  private async calculateNewPrice(actions: PricingAction[], product: MLProduct): Promise<number> {
    let newPrice = product.price;
    
    for (const action of actions) {
      switch (action.type) {
        case 'increase_price':
          if (action.unit === 'percentage') {
            newPrice = newPrice * (1 + action.value / 100);
          } else {
            newPrice = newPrice + action.value;
          }
          break;
          
        case 'decrease_price':
          if (action.unit === 'percentage') {
            newPrice = newPrice * (1 - action.value / 100);
          } else {
            newPrice = newPrice - action.value;
          }
          break;
          
        case 'set_price':
          newPrice = action.value;
          break;
          
        case 'match_competitor':
          const competitors = this.competitorData.get(product.id) || [];
          if (competitors.length > 0) {
            const lowestPrice = Math.min(...competitors.map(c => c.competitorPrice));
            if (action.unit === 'percentage') {
              newPrice = lowestPrice * (1 + action.value / 100);
            } else {
              newPrice = lowestPrice + action.value;
            }
          }
          break;
      }
    }
    
    return Math.round(newPrice * 100) / 100; // Arredondar para 2 casas decimais
  }

  // Validar mudança de preço
  private validatePriceChange(product: MLProduct, newPrice: number, limits?: PricingLimits): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    if (!limits) return result;

    // Verificar preço mínimo
    if (limits.minPrice && newPrice < limits.minPrice) {
      result.isValid = false;
      result.errors.push(`Preço abaixo do mínimo permitido (R$ ${limits.minPrice})`);
    }

    // Verificar preço máximo
    if (limits.maxPrice && newPrice > limits.maxPrice) {
      result.isValid = false;
      result.errors.push(`Preço acima do máximo permitido (R$ ${limits.maxPrice})`);
    }

    // Verificar mudança percentual máxima
    if (limits.maxChangePercentage) {
      const changePercentage = Math.abs((newPrice - product.price) / product.price) * 100;
      if (changePercentage > limits.maxChangePercentage) {
        result.isValid = false;
        result.errors.push(`Mudança de ${changePercentage.toFixed(1)}% excede o limite de ${limits.maxChangePercentage}%`);
      }
    }

    // Verificar margem mínima (mock)
    if (limits.minMargin) {
      const estimatedCost = product.price * 0.7; // Assumir custo de 70%
      const newMargin = ((newPrice - estimatedCost) / newPrice) * 100;
      if (newMargin < limits.minMargin) {
        result.isValid = false;
        result.errors.push(`Margem de ${newMargin.toFixed(1)}% abaixo do mínimo de ${limits.minMargin}%`);
      }
    }

    return result;
  }

  // Criar alerta
  private createAlert(alertData: Omit<PricingAlert, 'id' | 'createdAt' | 'isRead' | 'actionRequired'>) {
    const alert: PricingAlert = {
      ...alertData,
      id: this.generateId(),
      createdAt: new Date(),
      isRead: false,
      actionRequired: alertData.severity === 'high' || alertData.severity === 'critical'
    };
    
    this.alerts.push(alert);
  }

  // Gerar recomendações de preço
  async generateRecommendations(products: MLProduct[]): Promise<PricingRecommendation[]> {
    const recommendations: PricingRecommendation[] = [];
    
    for (const product of products) {
      const recommendation = await this.generateProductRecommendation(product);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    }
    
    return recommendations;
  }

  // Gerar recomendação para um produto
  private async generateProductRecommendation(product: MLProduct): Promise<PricingRecommendation | null> {
    const competitors = this.competitorData.get(product.id) || [];
    
    if (competitors.length === 0) {
      return null;
    }
    
    const avgCompetitorPrice = competitors.reduce((sum, c) => sum + c.competitorPrice, 0) / competitors.length;
    const lowestCompetitorPrice = Math.min(...competitors.map(c => c.competitorPrice));
    
    let recommendedPrice = product.price;
    const reasoning: string[] = [];
    let confidence = 50;
    
    // Lógica de recomendação baseada em concorrência
    if (product.price > avgCompetitorPrice * 1.1) {
      recommendedPrice = avgCompetitorPrice * 0.95;
      reasoning.push('Preço atual está 10% acima da média dos concorrentes');
      reasoning.push('Recomendação: reduzir para ficar 5% abaixo da média');
      confidence = 80;
    } else if (product.price < lowestCompetitorPrice * 0.9) {
      recommendedPrice = lowestCompetitorPrice * 0.95;
      reasoning.push('Preço atual está muito abaixo dos concorrentes');
      reasoning.push('Oportunidade de aumentar margem mantendo competitividade');
      confidence = 70;
    }
    
    // Ajustar baseado no estoque
    if (product.availableQuantity < 5) {
      recommendedPrice *= 1.05;
      reasoning.push('Estoque baixo: pequeno aumento para controlar demanda');
      confidence += 10;
    }
    
    return {
      productId: product.id,
      currentPrice: product.price,
      recommendedPrice: Math.round(recommendedPrice * 100) / 100,
      confidence: Math.min(confidence, 95),
      reasoning,
      expectedImpact: {
        salesChange: recommendedPrice < product.price ? 15 : -10,
        profitChange: ((recommendedPrice - product.price * 0.7) - (product.price - product.price * 0.7)) / (product.price - product.price * 0.7) * 100,
        competitivePosition: recommendedPrice < avgCompetitorPrice ? 'Competitivo' : 'Premium'
      },
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    };
  }

  // Métodos de acesso aos dados
  getExecutionHistory(): PricingExecution[] {
    return [...this.executionHistory];
  }

  getAlerts(): PricingAlert[] {
    return [...this.alerts];
  }

  markAlertAsRead(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
    }
  }

  // Utilitário para gerar IDs
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Instância singleton
let pricingService: PricingAutomationService | null = null;

export function getPricingAutomationService(mlApi: ReturnType<typeof getMercadoLivreAPI>): PricingAutomationService {
  if (!pricingService) {
    pricingService = new PricingAutomationService(mlApi);
  }
  return pricingService;
}