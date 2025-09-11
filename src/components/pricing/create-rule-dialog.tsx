'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  Target, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { PricingRule, PricingCondition, PricingAction } from '@/types/pricing';

interface CreateRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRuleCreated: (rule: PricingRule) => void;
}

export function CreateRuleDialog({ open, onOpenChange, onRuleCreated }: CreateRuleDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number>(2);
  const [conditions, setConditions] = useState<PricingCondition[]>([]);
  const [actions, setActions] = useState<PricingAction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPriority(2);
    setConditions([]);
    setActions([]);
    setIsSubmitting(false);
  };

  const addCondition = () => {
    const newCondition: PricingCondition = {
      id: Date.now().toString(),
      type: 'competitor_price',
      operator: 'less_than',
      value: 0,
      field: 'current_price'
    };
    setConditions([...conditions, newCondition]);
  };

  const updateCondition = (index: number, field: keyof PricingCondition, value: string | number) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = { ...updatedConditions[index], [field]: value };
    setConditions(updatedConditions);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const addAction = () => {
    const newAction: PricingAction = {
      id: Date.now().toString(),
      type: 'decrease_price',
      value: 0,
      unit: 'percentage'
    };
    setActions([...actions, newAction]);
  };

  const updateAction = (index: number, field: keyof PricingAction, value: string | number) => {
    const updatedActions = [...actions];
    updatedActions[index] = { ...updatedActions[index], [field]: value };
    setActions(updatedActions);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim() || conditions.length === 0 || actions.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newRule: PricingRule = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        priority,
        conditions,
        actions,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        executionCount: 0
      };

      onRuleCreated(newRule);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao criar regra:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConditionTypeLabel = (type: string) => {
    switch (type) {
      case 'competitor_price': return 'Preço do Concorrente';
      case 'stock_level': return 'Nível de Estoque';
      case 'sales_velocity': return 'Velocidade de Vendas';
      case 'time_based': return 'Baseado em Tempo';
      default: return type;
    }
  };

  const getOperatorLabel = (operator: string) => {
    switch (operator) {
      case 'greater_than': return 'Maior que';
      case 'less_than': return 'Menor que';
      case 'equals': return 'Igual a';
      case 'between': return 'Entre';
      default: return operator;
    }
  };

  const getActionTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage_change': return 'Alteração Percentual';
      case 'fixed_amount': return 'Valor Fixo';
      case 'set_price': return 'Definir Preço';
      case 'match_competitor': return 'Igualar Concorrente';
      default: return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Regra de Precificação</DialogTitle>
          <DialogDescription>
            Configure condições e ações para automatizar a precificação dos seus produtos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Regra</Label>
              <Input
                id="name"
                placeholder="Ex: Competir com concorrentes principais"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o objetivo desta regra..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority.toString()} onValueChange={(value) => setPriority(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Alta (1)</SelectItem>
                  <SelectItem value="2">Média (2)</SelectItem>
                  <SelectItem value="3">Baixa (3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Condições */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Condições
              </CardTitle>
              <CardDescription>
                Defina quando esta regra deve ser executada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2 p-4 border rounded-lg">
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <Select 
                      value={condition.type} 
                      onValueChange={(value) => updateCondition(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="competitor_price">Preço do Concorrente</SelectItem>
                        <SelectItem value="stock_level">Nível de Estoque</SelectItem>
                        <SelectItem value="sales_velocity">Velocidade de Vendas</SelectItem>
                        <SelectItem value="time_based">Baseado em Tempo</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={condition.operator} 
                      onValueChange={(value) => updateCondition(index, 'operator', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="greater_than">Maior que</SelectItem>
                        <SelectItem value="less_than">Menor que</SelectItem>
                        <SelectItem value="equals">Igual a</SelectItem>
                        <SelectItem value="between">Entre</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="number"
                      placeholder="Valor"
                      value={typeof condition.value === 'boolean' ? '' : condition.value}
                      onChange={(e) => updateCondition(index, 'value', Number(e.target.value))}
                    />
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" onClick={addCondition} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Condição
              </Button>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Ações
              </CardTitle>
              <CardDescription>
                Defina o que acontece quando as condições são atendidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {actions.map((action, index) => (
                <div key={index} className="flex items-center gap-2 p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <Select 
                      value={action.type} 
                      onValueChange={(value) => updateAction(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="increase_price">Aumentar Preço</SelectItem>
                        <SelectItem value="decrease_price">Diminuir Preço</SelectItem>
                        <SelectItem value="set_price">Definir Preço</SelectItem>
                        <SelectItem value="match_competitor">Igualar Concorrente</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {action.type !== 'match_competitor' && (
                      <Input
                        type="number"
                        placeholder={action.unit === 'percentage' ? '% (ex: 5)' : 'R$ (ex: 10.50)'}
                        value={action.value}
                        onChange={(e) => updateAction(index, 'value', Number(e.target.value))}
                      />
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAction(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" onClick={addAction} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Ação
              </Button>
            </CardContent>
          </Card>

          {/* Preview da Regra */}
          {(conditions.length > 0 || actions.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Preview da Regra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Quando:</strong></p>
                  {conditions.map((condition, index) => (
                    <p key={index} className="ml-4">
                      • {getConditionTypeLabel(condition.type)} {getOperatorLabel(condition.operator)} {condition.value}
                    </p>
                  ))}
                  
                  {actions.length > 0 && (
                    <>
                      <p><strong>Então:</strong></p>
                      {actions.map((action, index) => (
                        <p key={index} className="ml-4">
                          • {getActionTypeLabel(action.type)}
                          {action.type !== 'match_competitor' && `: ${action.value}`}
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!name.trim() || conditions.length === 0 || actions.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Criando...' : 'Criar Regra'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}