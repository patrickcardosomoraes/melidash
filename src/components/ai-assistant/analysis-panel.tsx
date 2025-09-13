'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  Package,
  DollarSign,
  Users,
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Target,
  Zap
} from 'lucide-react';
import { getAIAssistantService } from '@/lib/services/ai-assistant-service';
import { AIAnalysis } from '@/types/ai-assistant';

interface AnalysisPanelProps {
  onRefresh: () => void;
}

export function AnalysisPanel({ onRefresh }: AnalysisPanelProps) {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState('all');

  const aiService = getAIAssistantService();

  const loadAnalyses = useCallback(async () => {
    try {
      setLoading(true);
      const analysesData = await aiService.getAnalyses();
      setAnalyses(analysesData);
    } catch (error) {
      console.error('Erro ao carregar análises:', error);
    } finally {
      setLoading(false);
    }
  }, [aiService]);

  useEffect(() => {
    loadAnalyses();
  }, [loadAnalyses]);

  const filteredAnalyses = analyses.filter(analysis => {
    if (filter === 'all') return true;
    return analysis.type === filter;
  });

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'product': return Package;
      case 'listing': return BarChart3;
      case 'pricing': return DollarSign;
      case 'competition': return Users;
      default: return BarChart3;
    }
  };

  const getAnalysisTypeName = (type: string) => {
    switch (type) {
      case 'product': return 'Produto';
      case 'listing': return 'Anúncio';
      case 'pricing': return 'Preços';
      case 'competition': return 'Competição';
      default: return type;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-600 text-white hover:bg-green-700';
    if (score >= 60) return 'bg-yellow-600 text-white hover:bg-yellow-700';
    return 'bg-red-600 text-white hover:bg-red-700';
  };

  const handleCreateAnalysis = async (type: AIAnalysis['type']) => {
    try {
      setCreating(true);
      const newAnalysis = await aiService.createAnalysis(type, `target-${Date.now()}`);
      setAnalyses(prev => [newAnalysis, ...prev]);
      setSelectedAnalysis(newAnalysis);
      onRefresh();
    } catch (error) {
      console.error('Erro ao criar análise:', error);
    } finally {
      setCreating(false);
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
          <h3 className="text-lg font-semibold">Análises IA</h3>
          <p className="text-sm text-muted-foreground">
            Análises detalhadas geradas por inteligência artificial
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="product">Produtos</SelectItem>
              <SelectItem value="listing">Anúncios</SelectItem>
              <SelectItem value="pricing">Preços</SelectItem>
              <SelectItem value="competition">Competição</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Nova Análise
          </CardTitle>
          <CardDescription>
            Gere análises automáticas para diferentes aspectos do seu negócio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleCreateAnalysis('product')}
              disabled={creating}
            >
              <Package className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Produto</div>
                <div className="text-xs text-muted-foreground">Análise completa</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleCreateAnalysis('listing')}
              disabled={creating}
            >
              <BarChart3 className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Anúncio</div>
                <div className="text-xs text-muted-foreground">SEO e otimização</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleCreateAnalysis('pricing')}
              disabled={creating}
            >
              <DollarSign className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Preços</div>
                <div className="text-xs text-muted-foreground">Competitividade</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleCreateAnalysis('competition')}
              disabled={creating}
            >
              <Users className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Competição</div>
                <div className="text-xs text-muted-foreground">Análise de mercado</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analyses List */}
      <div className="grid gap-4">
        {filteredAnalyses.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma análise encontrada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Crie sua primeira análise usando os botões acima
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAnalyses.map((analysis) => {
            const IconComponent = getAnalysisIcon(analysis.type);
            
            return (
              <Card key={analysis.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">
                          Análise de {getAnalysisTypeName(analysis.type)}
                        </CardTitle>
                        <Badge className={getScoreBadgeColor(analysis.analysis.score)}>
                          {analysis.analysis.score}/100
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>ID: {analysis.targetId}</span>
                        <span>{analysis.createdAt.toLocaleDateString('pt-BR')}</span>
                        <span>{analysis.suggestions.length} sugestões</span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Score Geral</span>
                          <span className={getScoreColor(analysis.analysis.score)}>
                            {analysis.analysis.score}/100
                          </span>
                        </div>
                        <Progress value={analysis.analysis.score} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{analysis.analysis.strengths.length} pontos fortes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>{analysis.analysis.weaknesses.length} pontos fracos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span>{analysis.analysis.opportunities.length} oportunidades</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <span>{analysis.analysis.threats.length} ameaças</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Analysis Detail Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const IconComponent = getAnalysisIcon(selectedAnalysis.type);
                      return <IconComponent className="h-5 w-5 text-primary" />;
                    })()}
                    Análise de {getAnalysisTypeName(selectedAnalysis.type)}
                  </CardTitle>
                  <CardDescription>
                    Gerada em {selectedAnalysis.createdAt.toLocaleDateString('pt-BR')} • ID: {selectedAnalysis.targetId}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedAnalysis(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Score */}
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className={`text-4xl font-bold ${getScoreColor(selectedAnalysis.analysis.score)}`}>
                  {selectedAnalysis.analysis.score}/100
                </div>
                <div className="text-sm text-muted-foreground mt-1">Score Geral</div>
                <Progress value={selectedAnalysis.analysis.score} className="w-32 h-2 mx-auto mt-2" />
              </div>
              
              {/* SWOT Analysis */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Pontos Fortes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedAnalysis.analysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      Pontos Fracos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedAnalysis.analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-blue-600">
                      <Target className="h-4 w-4" />
                      Oportunidades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedAnalysis.analysis.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-orange-600">
                      <Zap className="h-4 w-4" />
                      Ameaças
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedAnalysis.analysis.threats.map((threat, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {/* Suggestions */}
              <div className="space-y-4">
                <h4 className="font-semibold">Sugestões de Melhoria</h4>
                <div className="space-y-3">
                  {selectedAnalysis.suggestions.map((suggestion, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h5 className="font-medium">{suggestion.title}</h5>
                            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant={suggestion.priority === 'high' ? 'destructive' : suggestion.priority === 'medium' ? 'default' : 'secondary'}>
                                {suggestion.priority === 'high' ? 'Alta' : suggestion.priority === 'medium' ? 'Média' : 'Baixa'}
                              </Badge>
                              <Badge variant="outline">{suggestion.category}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setSelectedAnalysis(null)}>
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
