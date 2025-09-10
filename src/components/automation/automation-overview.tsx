'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Settings, Play, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  type: 'price' | 'stock' | 'promotion';
  status: 'active' | 'paused' | 'error';
  trigger: string;
  action: string;
  lastRun: string;
  performance: number;
}

export function AutomationOverview() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setRules([
        {
          id: '1',
          name: 'Ajuste Competitivo',
          type: 'price',
          status: 'active',
          trigger: 'Concorrente reduz preço',
          action: 'Reduzir 5% até margem mínima',
          lastRun: '2 horas atrás',
          performance: 85
        },
        {
          id: '2',
          name: 'Estoque Baixo',
          type: 'stock',
          status: 'active',
          trigger: 'Estoque < 10 unidades',
          action: 'Aumentar preço 10%',
          lastRun: '1 dia atrás',
          performance: 92
        },
        {
          id: '3',
          name: 'Promoção Sazonal',
          type: 'promotion',
          status: 'paused',
          trigger: 'Data específica',
          action: 'Aplicar desconto 15%',
          lastRun: '3 dias atrás',
          performance: 78
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
        : rule
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price': return <TrendingUp className="h-4 w-4" />;
      case 'stock': return <TrendingDown className="h-4 w-4" />;
      case 'promotion': return <AlertTriangle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Automação</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activeRules = rules.filter(rule => rule.status === 'active').length;
  const totalRules = rules.length;
  const avgPerformance = rules.reduce((acc, rule) => acc + rule.performance, 0) / rules.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Automação</h1>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Nova Regra
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regras Ativas</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRules}</div>
            <p className="text-xs text-muted-foreground">
              de {totalRules} regras totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPerformance.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execuções Hoje</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              +12% vs média
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.2k</div>
            <p className="text-xs text-muted-foreground">
              economizados este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(rule.type)}
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(rule.status)} text-white`}
                      >
                        {rule.status}
                      </Badge>
                    </div>
                    <Switch 
                      checked={rule.status === 'active'}
                      onCheckedChange={() => toggleRuleStatus(rule.id)}
                    />
                  </div>
                  <CardDescription>
                    <strong>Gatilho:</strong> {rule.trigger}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        <strong>Ação:</strong> {rule.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Última execução:</strong> {rule.lastRun}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance</span>
                        <span>{rule.performance}%</span>
                      </div>
                      <Progress value={rule.performance} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Execuções</CardTitle>
              <CardDescription>
                Últimas execuções das regras de automação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Ajuste Competitivo</p>
                      <p className="text-sm text-muted-foreground">
                        Produto XYZ - Preço ajustado de R$ 99,90 para R$ 94,90
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Sucesso</p>
                      <p className="text-xs text-muted-foreground">
                        {i + 1}h atrás
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure o comportamento das automações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Execução Automática</p>
                  <p className="text-sm text-muted-foreground">
                    Permitir que as regras sejam executadas automaticamente
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações</p>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações sobre execuções
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Modo Conservador</p>
                  <p className="text-sm text-muted-foreground">
                    Aplicar mudanças menores e mais seguras
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}