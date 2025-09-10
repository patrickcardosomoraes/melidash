'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Lightbulb,
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  Eye,
  Check,
  X,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { AIInsight } from '@/types/ai-assistant';
import { getAIAssistantService } from '@/lib/services/ai-assistant-service';

interface InsightsPanelProps {
  insights: AIInsight[];
  onRefresh: () => void;
}

export function InsightsPanel({ insights, onRefresh }: InsightsPanelProps) {
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    impact: 'all',
    status: 'all'
  });
  const [loading, setLoading] = useState(false);

  const aiService = getAIAssistantService();

  const filteredInsights = insights.filter(insight => {
    if (filters.type !== 'all' && insight.type !== filters.type) return false;
    if (filters.impact !== 'all' && insight.impact !== filters.impact) return false;
    if (filters.status !== 'all' && insight.status !== filters.status) return false;
    return true;
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return Target;
      case 'pricing': return DollarSign;
      case 'trend': return TrendingUp;
      case 'competition': return BarChart3;
      case 'performance': return Zap;
      default: return Lightbulb;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return Clock;
      case 'viewed': return Eye;
      case 'applied': return CheckCircle;
      case 'dismissed': return X;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600';
      case 'viewed': return 'text-yellow-600';
      case 'applied': return 'text-green-600';
      case 'dismissed': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const handleViewInsight = async (insight: AIInsight) => {
    setSelectedInsight(insight);
    if (insight.status === 'new') {
      await aiService.updateInsightStatus(insight.id, 'viewed');
      onRefresh();
    }
  };

  const handleApplyRecommendation = async (insightId: string, recommendationId: string) => {
    try {
      setLoading(true);
      await aiService.applyRecommendation(insightId, recommendationId);
      onRefresh();
      setSelectedInsight(null);
    } catch (error) {
      console.error('Erro ao aplicar recomendação:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissInsight = async (insightId: string) => {
    try {
      setLoading(true);
      await aiService.dismissInsight(insightId);
      onRefresh();
      setSelectedInsight(null);
    } catch (error) {
      console.error('Erro ao descartar insight:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo</label>
          <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="optimization">Otimização</SelectItem>
              <SelectItem value="pricing">Preços</SelectItem>
              <SelectItem value="trend">Tendências</SelectItem>
              <SelectItem value="competition">Competição</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Impacto</label>
          <Select value={filters.impact} onValueChange={(value) => setFilters(prev => ({ ...prev, impact: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="high">Alto</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="low">Baixo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="new">Novos</SelectItem>
              <SelectItem value="viewed">Visualizados</SelectItem>
              <SelectItem value="applied">Aplicados</SelectItem>
              <SelectItem value="dismissed">Descartados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Insights List */}
      <div className="grid gap-4">
        {filteredInsights.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum insight encontrado</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ajuste os filtros ou gere novos insights
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredInsights.map((insight) => {
            const IconComponent = getInsightIcon(insight.type);
            const StatusIcon = getStatusIcon(insight.status);
            
            return (
              <Card key={insight.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Médio' : 'Baixo'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`h-4 w-4 ${getStatusColor(insight.status)}`} />
                          <span className="capitalize">{insight.status}</span>
                        </div>
                        <span>Confiança: {insight.confidence}%</span>
                        <span>{insight.category}</span>
                        {insight.productTitle && (
                          <span className="truncate max-w-48">{insight.productTitle}</span>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewInsight(insight)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{insight.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span>Atual: {insight.metrics.currentValue}{insight.metrics.unit}</span>
                      <span>Projetado: {insight.metrics.projectedValue}{insight.metrics.unit}</span>
                      <span className={insight.metrics.improvement > 0 ? 'text-green-600' : 'text-red-600'}>
                        {insight.metrics.improvement > 0 ? '+' : ''}{insight.metrics.improvement}%
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Progress value={insight.confidence} className="w-20 h-2" />
                      <span className="text-xs text-muted-foreground">{insight.confidence}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const IconComponent = getInsightIcon(selectedInsight.type);
                      return <IconComponent className="h-5 w-5 text-primary" />;
                    })()}
                    {selectedInsight.title}
                  </CardTitle>
                  <CardDescription>{selectedInsight.description}</CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedInsight(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Metrics */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{selectedInsight.metrics.currentValue}</div>
                  <div className="text-sm text-muted-foreground">Atual</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{selectedInsight.metrics.projectedValue}</div>
                  <div className="text-sm text-muted-foreground">Projetado</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className={`text-2xl font-bold ${
                    selectedInsight.metrics.improvement > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedInsight.metrics.improvement > 0 ? '+' : ''}{selectedInsight.metrics.improvement}%
                  </div>
                  <div className="text-sm text-muted-foreground">Melhoria</div>
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="space-y-4">
                <h4 className="font-semibold">Recomendações</h4>
                {selectedInsight.recommendations.map((rec) => (
                  <Card key={rec.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{rec.action}</CardTitle>
                          <CardDescription>{rec.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                            {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                          <Badge variant="outline">
                            {rec.effort === 'easy' ? 'Fácil' : rec.effort === 'moderate' ? 'Moderado' : 'Complexo'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-2">Passos:</h5>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                            {rec.steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Impacto estimado: {rec.estimatedImpact}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleApplyRecommendation(selectedInsight.id, rec.id)}
                            disabled={loading}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDismissInsight(selectedInsight.id)}
                  disabled={loading}
                >
                  Descartar
                </Button>
                <Button onClick={() => setSelectedInsight(null)}>
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}