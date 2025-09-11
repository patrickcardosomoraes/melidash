'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Target,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { PricingExecution, PricingRule } from '@/types/pricing';

interface PricingMetricsProps {
  executions: PricingExecution[];
  rules: PricingRule[];
}

export function PricingMetrics({ executions, rules }: PricingMetricsProps) {
  // Calcular métricas
  const totalExecutions = executions.length;
  const successfulExecutions = executions.filter(e => e.status === 'success').length;
  const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;
  
  const priceChanges = executions.filter(e => e.status === 'success' && e.oldPrice !== e.newPrice);
  const avgPriceChange = priceChanges.length > 0 
    ? priceChanges.reduce((sum, e) => sum + Math.abs((e.newPrice - e.oldPrice) / e.oldPrice * 100), 0) / priceChanges.length
    : 0;
  
  const totalSavings = priceChanges.reduce((sum, e) => {
    const change = e.newPrice - e.oldPrice;
    return sum + (change > 0 ? change : 0); // Apenas aumentos de preço
  }, 0);
  
  const activeRules = rules.filter(r => r.isActive).length;
  const totalRules = rules.length;
  
  // Execuções por hora (últimas 24h)
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const executionsLast24h = executions.filter(e => e.executedAt >= last24h);
  
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    const hourStart = new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours());
    const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
    
    const hourExecutions = executionsLast24h.filter(e => 
      e.executedAt >= hourStart && e.executedAt < hourEnd
    );
    
    return {
      hour: hourStart.getHours(),
      executions: hourExecutions.length,
      successful: hourExecutions.filter(e => e.status === 'success').length,
      failed: hourExecutions.filter(e => e.status === 'failed').length
    };
  });
  
  const maxExecutionsInHour = Math.max(...hourlyData.map(h => h.executions), 1);

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {successfulExecutions} de {totalExecutions} execuções
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variação Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPriceChange.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {priceChanges.length} mudanças de preço
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Adicional</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalSavings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Através de otimizações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regras Ativas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRules}</div>
            <p className="text-xs text-muted-foreground">
              de {totalRules} regras totais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Execuções por Hora */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Execuções por Hora (Últimas 24h)
          </CardTitle>
          <CardDescription>
            Distribuição das execuções de regras ao longo do dia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Gráfico simples com barras */}
            <div className="flex items-end justify-between h-32 border-b border-l pl-2 pb-2">
              {hourlyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-1 flex-1">
                  <div className="flex flex-col items-center gap-1 h-24 justify-end">
                    {data.executions > 0 && (
                      <>
                        {data.failed > 0 && (
                          <div 
                            className="w-3 bg-red-500 rounded-t" 
                            style={{ height: `${(data.failed / maxExecutionsInHour) * 80}px` }}
                          />
                        )}
                        {data.successful > 0 && (
                          <div 
                            className="w-3 bg-green-500" 
                            style={{ height: `${(data.successful / maxExecutionsInHour) * 80}px` }}
                          />
                        )}
                      </>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {data.hour.toString().padStart(2, '0')}h
                  </span>
                </div>
              ))}
            </div>
            
            {/* Legenda */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Sucessos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span>Falhas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise de Performance por Regra */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance por Regra
          </CardTitle>
          <CardDescription>
            Estatísticas de execução para cada regra ativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.filter(r => r.isActive).map(rule => {
              const ruleExecutions = executions.filter(e => e.ruleId === rule.id);
              const ruleSuccesses = ruleExecutions.filter(e => e.status === 'success').length;
              const ruleFails = ruleExecutions.filter(e => e.status === 'failed').length;
              const ruleSuccessRate = ruleExecutions.length > 0 ? (ruleSuccesses / ruleExecutions.length) * 100 : 0;
              
              return (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {ruleExecutions.length} execuções • {ruleSuccessRate.toFixed(1)}% sucesso
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{ruleSuccesses}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span>{ruleFails}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {rules.filter(r => r.isActive).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma regra ativa para analisar
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}