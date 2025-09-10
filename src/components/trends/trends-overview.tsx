'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Bell, 
  Eye, 
  AlertTriangle,
  Target,
  BarChart3,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';
import { getTrendsService } from '@/lib/services/trends-service';
import {
  TrendData,
  CompetitorMonitoring,
  MarketTrend,
  CompetitorAlert,
  TrendPeriod
} from '@/types/trends';
import { TrendCard } from './trend-card';
import { CompetitorCard } from './competitor-card';
import { TrendsChart } from './trends-chart';
import { AlertsPanel } from './alerts-panel';

export function TrendsOverview() {
  const [activeTab, setActiveTab] = useState('overview');
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorMonitoring[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [alerts, setAlerts] = useState<CompetitorAlert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<TrendPeriod>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);

  const trendsService = getTrendsService();

  useEffect(() => {
    loadData();
  }, [selectedPeriod, selectedCategory]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [trendsData, competitorsData, marketTrendsData, alertsData, summaryData, insightsData] = await Promise.all([
        trendsService.getTrendData(selectedPeriod, selectedCategory === 'all' ? undefined : selectedCategory),
        trendsService.getCompetitors(),
        trendsService.getMarketTrends(),
        trendsService.getAlerts(),
        trendsService.getTrendSummary(),
        trendsService.getCompetitiveInsights()
      ]);

      setTrends(trendsData);
      setCompetitors(competitorsData);
      setMarketTrends(marketTrendsData);
      setAlerts(alertsData);
      setSummary(summaryData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await trendsService.searchTrends(searchQuery);
      setTrends(searchResults);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high');

  if (isLoading && !summary) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Radar de Tendências</h1>
          <p className="text-muted-foreground">
            Monitore tendências de mercado e concorrência em tempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alertas ({unreadAlerts.length})
          </Button>
        </div>
      </div>

      {/* Alertas Críticos */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Você tem {criticalAlerts.length} alerta(s) crítico(s) que requerem atenção imediata.
          </AlertDescription>
        </Alert>
      )}

      {/* Métricas Resumo */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tendências</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalTrends}</div>
              <p className="text-xs text-muted-foreground">
                {summary.growingTrends} em crescimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concorrentes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{competitors.length}</div>
              <p className="text-xs text-muted-foreground">
                {insights?.biggestThreat?.competitorName || 'N/A'} é a maior ameaça
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Pendentes</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadAlerts.length}</div>
              <p className="text-xs text-muted-foreground">
                {criticalAlerts.length} críticos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Líder de Mercado</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insights?.marketLeader?.marketShare?.toFixed(1) || '0'}%
              </div>
              <p className="text-xs text-muted-foreground">
                {insights?.marketLeader?.competitorName || 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controles de Filtro */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tendências..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="max-w-sm"
          />
          <Button onClick={handleSearch} size="sm">
            Buscar
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={(value: TrendPeriod) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 horas</SelectItem>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
              <SelectItem value="Informática">Informática</SelectItem>
              <SelectItem value="Casa e Jardim">Casa e Jardim</SelectItem>
              <SelectItem value="Esportes">Esportes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="competitors">Concorrentes</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Tendências */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendências em Alta
                </CardTitle>
                <CardDescription>
                  Palavras-chave com maior crescimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trends.slice(0, 5).map((trend) => (
                    <div key={trend.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{trend.keyword}</p>
                        <p className="text-sm text-muted-foreground">{trend.category}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={trend.growth > 0 ? 'default' : 'secondary'}>
                          {trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}%
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {trend.searchVolume.toLocaleString()} buscas
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Concorrentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Principais Concorrentes
                </CardTitle>
                <CardDescription>
                  Monitoramento de market share
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {competitors.slice(0, 5).map((competitor) => (
                    <div key={competitor.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{competitor.competitorName}</p>
                        <p className="text-sm text-muted-foreground">
                          Estratégia: {competitor.priceStrategy}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{competitor.marketShare.toFixed(1)}%</p>
                        <Badge 
                          variant={
                            competitor.performance.threats === 'critical' ? 'destructive' :
                            competitor.performance.threats === 'high' ? 'secondary' : 'outline'
                          }
                        >
                          {competitor.performance.threats}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Tendências */}
          <TrendsChart trends={trends} period={selectedPeriod} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trends.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {competitors.map((competitor) => (
              <CompetitorCard key={competitor.id} competitor={competitor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <AlertsPanel alerts={alerts} onMarkAsRead={(id: string) => {
            trendsService.markAlertAsRead(id);
            loadData();
          }} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Insights Competitivos */}
            {insights && (
              <Card>
                <CardHeader>
                  <CardTitle>Insights Competitivos</CardTitle>
                  <CardDescription>
                    Análise automática da concorrência
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Líder de Mercado</p>
                        <p className="text-sm text-muted-foreground">
                          {insights.marketLeader.competitorName}
                        </p>
                      </div>
                      <Badge>{insights.marketLeader.marketShare.toFixed(1)}%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Crescimento Mais Rápido</p>
                        <p className="text-sm text-muted-foreground">
                          {insights.fastestGrowing.competitorName}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        +{insights.fastestGrowing.performance.growthRate.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">Maior Ameaça</p>
                        <p className="text-sm text-muted-foreground">
                          {insights.biggestThreat.competitorName}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {insights.biggestThreat.performance.threats}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resumo de Categorias */}
            {summary && (
              <Card>
                <CardHeader>
                  <CardTitle>Análise por Categoria</CardTitle>
                  <CardDescription>
                    Performance das principais categorias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {summary.topCategories.slice(0, 5).map((category: any, index: number) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{category.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.count} tendências
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={category.avgGrowth > 0 ? 'default' : 'secondary'}>
                            {category.avgGrowth > 0 ? '+' : ''}{category.avgGrowth.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}