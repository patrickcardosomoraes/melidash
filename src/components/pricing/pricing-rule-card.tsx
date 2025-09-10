'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Clock, 
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { PricingRule } from '@/types/pricing';

interface PricingRuleCardProps {
  rule: PricingRule;
  onToggle: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export function PricingRuleCard({ rule, onToggle, onDelete, onEdit }: PricingRuleCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getConditionIcon = (type: string) => {
    switch (type) {
      case 'competitor_price':
        return <Target className="h-4 w-4" />;
      case 'stock_level':
        return <TrendingDown className="h-4 w-4" />;
      case 'sales_velocity':
        return <TrendingUp className="h-4 w-4" />;
      case 'time_based':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getConditionDescription = (condition: { type: string; operator?: string; value?: string | number | boolean; startTime?: string; endTime?: string }) => {
    switch (condition.type) {
      case 'competitor_price':
        return `Preço concorrente ${condition.operator} R$ ${condition.value}`;
      case 'stock_level':
        return `Estoque ${condition.operator} ${condition.value} unidades`;
      case 'sales_velocity':
        return `Vendas ${condition.operator} ${condition.value} por dia`;
      case 'time_based':
        return `Entre ${condition.startTime} e ${condition.endTime}`;
      default:
        return 'Condição personalizada';
    }
  };

  const getActionDescription = (action: { type: string; value: string | number }) => {
    switch (action.type) {
      case 'percentage_change':
        const percentValue = typeof action.value === 'string' ? Number(action.value) : action.value;
        return `${percentValue > 0 ? 'Aumentar' : 'Reduzir'} ${Math.abs(percentValue)}%`;
      case 'fixed_amount':
        const amountValue = Number(action.value);
        return `${amountValue > 0 ? 'Adicionar' : 'Subtrair'} R$ ${Math.abs(amountValue)}`;
      case 'set_price':
        return `Definir preço para R$ ${Number(action.value)}`;
      case 'match_competitor':
        return 'Igualar preço do concorrente';
      default:
        return 'Ação personalizada';
    }
  };

  return (
    <Card className={`transition-all duration-200 ${rule.isActive ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {rule.name}
              <Badge variant={getPriorityColor(rule.priority.toString())} className="text-xs">
                Prioridade {rule.priority}
              </Badge>
            </CardTitle>
            <CardDescription>{rule.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={rule.isActive}
              onCheckedChange={onToggle}
            />
            {rule.isActive ? (
              <Pause className="h-4 w-4 text-green-600" />
            ) : (
              <Play className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Condições */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Condições
          </h4>
          <div className="space-y-2">
            {rule.conditions.map((condition, index) => (
              <div key={index} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-md">
                {getConditionIcon(condition.type)}
                <span>{getConditionDescription(condition)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Ações
          </h4>
          <div className="space-y-2">
            {rule.actions.map((action, index) => (
              <div key={index} className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded-md">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>{getActionDescription(action)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {rule.lastExecuted && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Última execução: {new Date(rule.lastExecuted).toLocaleString()}
              </span>
            )}
            <span>Execuções: {rule.executionCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}