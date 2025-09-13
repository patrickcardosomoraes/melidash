'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Settings,
  Zap,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { getAIAssistantService } from '@/lib/services/ai-assistant-service';
import { AIInsight } from '@/types/ai-assistant';
import { InsightsPanel } from './insights-panel';
import { ChatPanel } from './chat-panel';
import { AnalysisPanel } from './analysis-panel';
import { SettingsPanel } from './settings-panel';

export function AIAssistantOverview() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    byImpact: { high: 0, medium: 0, low: 0 },
    byStatus: { new: 0, viewed: 0, applied: 0, dismissed: 0 }
  });

  const aiService = useMemo(() => getAIAssistantService(), []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [insightsData, statsData] = await Promise.all([
        aiService.getInsights(),
        aiService.getInsightStats()
      ]);
      setInsights(insightsData);
      setStats({
        total: statsData.total,
        byImpact: {
          high: statsData.byImpact.high || 0,
          medium: statsData.byImpact.medium || 0,
          low: statsData.byImpact.low || 0
        },
        byStatus: {
          new: statsData.byStatus.new || 0,
          viewed: statsData.byStatus.viewed || 0,
          applied: statsData.byStatus.applied || 0,
          dismissed: statsData.byStatus.dismissed || 0
        }
      });
    } catch (error) {
      console.error('Erro ao carregar dados do assistente IA:', error);
    } finally {
      setLoading(false);
    }
  }, [aiService]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    loadData();
  };

  const handleGenerateInsights = async () => {
    try {
      await aiService.generateNewInsights();
      loadData();
    } catch (error) {
      console.error('Erro ao gerar novos insights:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Assistente IA
          </h1>
          <p className="text-muted-foreground">
            Insights inteligentes e otimizações automáticas para seus produtos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleGenerateInsights} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Gerar Insights
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Insights</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Sugestões disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alto Impacto</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.byImpact.high}</div>
            <p className="text-xs text-muted-foreground">
              Prioridade máxima
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aplicados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.byStatus.applied}</div>
            <p className="text-xs text-muted-foreground">
              Implementados com sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.byStatus.new}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando análise
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades do assistente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Target className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Otimizar Produto</div>
                <div className="text-xs text-muted-foreground">Análise completa</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Análise de Preços</div>
                <div className="text-xs text-muted-foreground">Competitividade</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Relatório de Performance</div>
                <div className="text-xs text-muted-foreground">Métricas detalhadas</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Chat com IA</div>
                <div className="text-xs text-muted-foreground">Perguntas personalizadas</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat IA
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Análises
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <InsightsPanel insights={insights} onRefresh={handleRefresh} />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <ChatPanel onRefresh={handleRefresh} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <AnalysisPanel onRefresh={handleRefresh} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SettingsPanel onRefresh={handleRefresh} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
