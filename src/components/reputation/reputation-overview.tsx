'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Thermometer, TrendingUp, TrendingDown, Minus, Star, MessageSquare, AlertTriangle, RefreshCw, Download } from 'lucide-react';
import { getReputationService } from '@/lib/services/reputation-service';
import { ReputationMetrics, Review, ReputationAlert } from '@/types/reputation';
import { ReputationThermometer } from './reputation-thermometer';
import { ReviewsPanel } from './reviews-panel';
import { AlertsPanel } from './alerts-panel';
import { GoalsPanel } from './goals-panel';

export function ReputationOverview() {
  const [metrics, setMetrics] = useState<ReputationMetrics | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [alerts, setAlerts] = useState<ReputationAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const reputationService = getReputationService();

  const loadData = async () => {
    try {
      setLoading(true);
      const [metricsData, reviewsData, alertsData] = await Promise.all([
        reputationService.getReputationMetrics(),
        reputationService.getReviews({ limit: 10 }),
        reputationService.getReputationAlerts()
      ]);

      setMetrics(metricsData);
      setReviews(reviewsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Erro ao carregar dados de reputação:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        reputationService.simulateRealtimeUpdate();
        loadData();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatMetricName = (key: string) => {
    const names: Record<string, string> = {
      overall: 'Geral',
      delivery: 'Entrega',
      communication: 'Comunicação',
      productQuality: 'Qualidade',
      customerService: 'Atendimento'
    };
    return names[key] || key;
  };

  const getMetricColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 80) return 'text-yellow-600';
    if (value >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  const unreadAlerts = alerts.filter(a => !a.isRead);
  const pendingReviews = reviews.filter(r => !r.response && r.sentiment === 'negative');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Reputação</h1>
          <p className="text-muted-foreground">
            Monitore e gerencie sua reputação no Mercado Livre
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Alertas Críticos */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-800">Alertas Críticos</CardTitle>
              <Badge variant="destructive">{criticalAlerts.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Pendentes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews.length}</div>
            <p className="text-xs text-muted-foreground">
              Necessitam resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Não Lidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((metrics?.overall || 0) / 20).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              De 5 estrelas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendência</CardTitle>
            {getTrendIcon(metrics?.trend || 'stable')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {metrics?.trend === 'up' ? 'Subindo' : 
               metrics?.trend === 'down' ? 'Descendo' : 'Estável'}
            </div>
            <p className="text-xs text-muted-foreground">
              Última semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Termômetro de Reputação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Termômetro de Reputação
                </CardTitle>
                <CardDescription>
                  Visualização em tempo real da sua reputação
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metrics && <ReputationThermometer metrics={metrics} />}
              </CardContent>
            </Card>

            {/* Métricas Detalhadas */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas Detalhadas</CardTitle>
                <CardDescription>
                  Breakdown por categoria de avaliação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics && Object.entries(metrics)
                  .filter(([key]) => !['trend', 'lastUpdated'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {formatMetricName(key)}
                        </span>
                        <span className={`text-sm font-bold ${getMetricColor(value as number)}`}>
                          {value}%
                        </span>
                      </div>
                      <Progress value={value as number} className="h-2" />
                    </div>
                  ))
                }
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsPanel 
            reviews={reviews} 
            onRefresh={loadData}
            onRespond={(reviewId: string, response: string) => {
              reputationService.respondToReview(reviewId, response);
              loadData();
            }}
          />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsPanel 
            alerts={alerts} 
            onMarkAsRead={(alertId: string) => {
              reputationService.markAlertAsRead(alertId);
              loadData();
            }}
            onDismiss={(alertId: string) => {
              reputationService.dismissAlert(alertId);
              loadData();
            }}
          />
        </TabsContent>

        <TabsContent value="goals">
          <GoalsPanel onRefresh={loadData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
