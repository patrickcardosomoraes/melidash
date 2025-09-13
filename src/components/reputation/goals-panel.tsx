'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { getReputationService } from '@/lib/services/reputation-service';
import { ReputationGoal, ReputationMetrics } from '@/types/reputation';

interface GoalsPanelProps {
  onRefresh?: () => void;
}

export function GoalsPanel({ onRefresh }: GoalsPanelProps) {
  const [goals, setGoals] = useState<ReputationGoal[]>([]);
  const [metrics, setMetrics] = useState<ReputationMetrics | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ReputationGoal | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    metric: 'overall' as keyof ReputationMetrics,
    target: 90,
    deadline: new Date()
  });

  const reputationService = getReputationService();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [goalsData, metricsData] = await Promise.all([
        reputationService.getReputationGoals(),
        reputationService.getReputationMetrics()
      ]);
      setGoals(goalsData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  }, [reputationService]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateGoal = async () => {
    if (!metrics) return;
    
    try {
      const currentValue = metrics[formData.metric] as number;
      await reputationService.createReputationGoal({
        metric: formData.metric,
        target: formData.target,
        current: currentValue,
        deadline: formData.deadline,
        isActive: true
      });
      
      setShowCreateForm(false);
      setFormData({ metric: 'overall', target: 90, deadline: new Date() });
      loadData();
      onRefresh?.();
    } catch (error) {
      console.error('Erro ao criar meta:', error);
    }
  };

  // Update goal is not used in UI yet; will be implemented with edit dialog

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await reputationService.deleteReputationGoal(goalId);
      loadData();
      onRefresh?.();
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
    }
  };

  const getMetricName = (metric: string) => {
    const names: Record<string, string> = {
      overall: 'Geral',
      delivery: 'Entrega',
      communication: 'Comunicação',
      productQuality: 'Qualidade do Produto',
      customerService: 'Atendimento ao Cliente'
    };
    return names[metric] || metric;
  };

  const getGoalStatus = (goal: ReputationGoal) => {
    const progress = (goal.current / goal.target) * 100;
    const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (progress >= 100) {
      return { status: 'completed', color: 'text-green-600', icon: CheckCircle };
    } else if (daysLeft < 0) {
      return { status: 'overdue', color: 'text-red-600', icon: AlertCircle };
    } else if (daysLeft <= 7) {
      return { status: 'urgent', color: 'text-orange-600', icon: Clock };
    } else {
      return { status: 'active', color: 'text-blue-600', icon: TrendingUp };
    }
  };

  const getStatusBadge = (goal: ReputationGoal) => {
    const { status } = getGoalStatus(goal);
    
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 text-white hover:bg-green-700">Concluída</Badge>;
      case 'overdue':
        return <Badge className="bg-red-600 text-white hover:bg-red-700">Atrasada</Badge>;
      case 'urgent':
        return <Badge className="bg-orange-600 text-white hover:bg-orange-700">Urgente</Badge>;
      default:
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700">Ativa</Badge>;
    }
  };

  const activeGoals = goals.filter(g => g.isActive);
  const completedGoals = goals.filter(g => !g.isActive || (g.current / g.target) * 100 >= 100);
  const overdueGoals = goals.filter(g => {
    const daysLeft = Math.ceil((g.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft < 0 && (g.current / g.target) * 100 < 100;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              Em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              Objetivos alcançados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              Precisam atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botão Criar Meta */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Suas Metas de Reputação</h3>
          <p className="text-sm text-muted-foreground">
            Defina objetivos para melhorar sua reputação
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Formulário de Criação */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Meta</CardTitle>
            <CardDescription>
              Defina um objetivo específico para melhorar sua reputação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Métrica</label>
                <Select
                  value={formData.metric}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    metric: value as keyof ReputationMetrics 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overall">Avaliação Geral</SelectItem>
                    <SelectItem value="delivery">Entrega</SelectItem>
                    <SelectItem value="communication">Comunicação</SelectItem>
                    <SelectItem value="productQuality">Qualidade do Produto</SelectItem>
                    <SelectItem value="customerService">Atendimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.target}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    target: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Prazo</label>
              <Input
                type="date"
                value={formData.deadline.toISOString().split('T')[0]}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  deadline: new Date(e.target.value) 
                }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ metric: 'overall', target: 90, deadline: new Date() });
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateGoal}>
                Criar Meta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Metas */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma meta definida</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Crie sua primeira meta para começar a melhorar sua reputação
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const { color, icon: StatusIcon } = getGoalStatus(goal);
            const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-5 w-5 ${color}`} />
                        <CardTitle className="text-base">
                          {getMetricName(goal.metric)}
                        </CardTitle>
                        {getStatusBadge(goal)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Meta: {goal.target}%</span>
                        <span>Atual: {goal.current}%</span>
                        <span>
                          Prazo: {goal.deadline.toLocaleDateString('pt-BR')}
                          {daysLeft >= 0 && ` (${daysLeft} dias)`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingGoal(goal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span className={color}>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
