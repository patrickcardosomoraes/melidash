'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  Plus, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { mockPricingRules, PricingRule, PricingExecution, PricingAlert } from '@/types/pricing';
import { getConfig } from '@/lib/config/production';
import { PricingRuleCard } from './pricing-rule-card';
import { PricingMetrics } from './pricing-metrics';
import { PricingHistory } from './pricing-history';
import { CreateRuleDialog } from './create-rule-dialog';

export function PricingOverview() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [executions, setExecutions] = useState<PricingExecution[]>([]);
  const [alerts, setAlerts] = useState<PricingAlert[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Simular dados de execução e alertas
  useEffect(() => {
    const config = getConfig();
    
    // Mock executions
    const mockExecutions: PricingExecution[] = [
      {
        id: '1',
        ruleId: '1',
        productId: 'MLB123456',
        executedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'success',
        oldPrice: 299.99,
        newPrice: 284.99,
        reason: 'Preço ajustado para competir com concorrentes'
      },
      {
        id: '2',
        ruleId: '2',
        productId: 'MLB789012',
        executedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'success',
        oldPrice: 149.90,
        newPrice: 134.91,
        reason: 'Liquidação de estoque baixo'
      },
      {
        id: '3',
        ruleId: '1',
        productId: 'MLB345678',
        executedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'failed',
        oldPrice: 89.99,
        newPrice: 89.99,
        reason: 'Margem mínima não atendida',
        error: 'Nova margem seria de 8%, abaixo do mínimo de 15%'
      }
    ];

    // Mock alerts
    const mockAlerts: PricingAlert[] = [
      {
        id: '1',
        type: 'competitor_price_drop',
        severity: 'high',
        productId: 'MLB123456',
        message: 'Concorrente reduziu preço em 15%',
        data: {
          competitorName: 'Loja ABC',
          oldPrice: 299.99,
          newPrice: 254.99
        },
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        actionRequired: true
      },
      {
        id: '2',
        type: 'low_margin_warning',
        severity: 'medium',
        productId: 'MLB789012',
        message: 'Margem de lucro abaixo de 20%',
        data: {
          currentMargin: 18.5,
          threshold: 20
        },
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        isRead: false,
        actionRequired: false
      }
    ];

    if (config.USE_MOCK_DATA) {
      setRules(mockPricingRules);
      setExecutions(mockExecutions);
      setAlerts(mockAlerts);
    }
  }, []);

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const activeRules = rules.filter(rule => rule.isActive);
  const recentExecutions = executions.slice(0, 5);
  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  // Calcular métricas
  const successfulExecutions = executions.filter(e => e.status === 'success').length;
  const failedExecutions = executions.filter(e => e.status === 'failed').length;
  const totalPriceChanges = executions.filter(e => e.status === 'success' && e.oldPrice !== e.newPrice).length;
  const avgPriceChange = executions
    .filter(e => e.status === 'success' && e.oldPrice !== e.newPrice)
    .reduce((sum, e) => sum + Math.abs((e.newPrice - e.oldPrice) / e.oldPrice * 100), 0) / Math.max(totalPriceChanges, 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automação de Preços</h1>
          <p className="text-muted-foreground">
            Configure regras inteligentes para otimizar seus preços automaticamente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nova Regra
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {unreadAlerts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você tem {unreadAlerts.length} alerta{unreadAlerts.length > 1 ? 's' : ''} não lido{unreadAlerts.length > 1 ? 's' : ''} que {unreadAlerts.length > 1 ? 'requerem' : 'requer'} atenção.
          </AlertDescription>
        </Alert>
      )}

      {/* Métricas Rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regras Ativas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRules.length}</div>
            <p className="text-xs text-muted-foreground">
              de {rules.length} regras totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execuções (24h)</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executions.length}</div>
            <p className="text-xs text-muted-foreground">
              {successfulExecutions} sucessos, {failedExecutions} falhas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mudanças de Preço</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPriceChanges}</div>
            <p className="text-xs text-muted-foreground">
              Média de {avgPriceChange.toFixed(1)}% de variação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {alerts.filter(a => a.actionRequired).length} requerem ação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Regras Ativas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Regras Ativas
                </CardTitle>
                <CardDescription>
                  Regras que estão sendo executadas automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeRules.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma regra ativa no momento
                  </p>
                ) : (
                  activeRules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            Prioridade {rule.priority}
                          </Badge>
                          {rule.lastExecuted && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(rule.lastExecuted).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRule(rule.id)}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Execuções Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Execuções Recentes
                </CardTitle>
                <CardDescription>
                  Últimas execuções das regras de precificação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentExecutions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma execução recente
                  </p>
                ) : (
                  recentExecutions.map(execution => (
                    <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {execution.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : execution.status === 'failed' ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {execution.status === 'success' && execution.oldPrice !== execution.newPrice
                              ? `R$ ${execution.oldPrice.toFixed(2)} → R$ ${execution.newPrice.toFixed(2)}`
                              : execution.reason
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {execution.executedAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={execution.status === 'success' ? 'default' : execution.status === 'failed' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {execution.status === 'success' ? 'Sucesso' : execution.status === 'failed' ? 'Falha' : 'Ignorado'}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4">
            {rules.map(rule => (
              <PricingRuleCard
                key={rule.id}
                rule={rule}
                onToggle={() => toggleRule(rule.id)}
                onDelete={() => deleteRule(rule.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <PricingHistory executions={executions} />
        </TabsContent>

        <TabsContent value="analytics">
          <PricingMetrics executions={executions} rules={rules} />
        </TabsContent>
      </Tabs>

      {/* Dialog para criar nova regra */}
      <CreateRuleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onRuleCreated={(newRule) => {
          setRules(prev => [...prev, newRule]);
          setIsCreateDialogOpen(false);
        }}
      />
    </div>
  );
}