'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  Settings,
  Bot,
  Bell,
  Shield,
  MessageSquare,
  Save,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { getAIAssistantService } from '@/lib/services/ai-assistant-service';
import { AISettings } from '@/types/ai-assistant';

interface SettingsPanelProps {
  onRefresh: () => void;
}

export function SettingsPanel({ onRefresh }: SettingsPanelProps) {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const aiService = useMemo(() => getAIAssistantService(), []);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const settingsData = await aiService.getSettings();
      setSettings(settingsData);
      setHasChanges(false);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  }, [aiService]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSettingChange = (key: keyof AISettings, value: boolean | string | number | AISettings['focusAreas'] | AISettings['notificationPreferences']) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      await aiService.updateSettings(settings);
      setHasChanges(false);
      onRefresh();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    loadSettings();
  };

  if (loading || !settings) {
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
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Assistente IA
          </h3>
          <p className="text-sm text-muted-foreground">
            Personalize o comportamento e as preferências do assistente
          </p>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset} disabled={saving}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Desfazer
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        )}
      </div>

      {hasChanges && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            Você tem alterações não salvas
          </span>
        </div>
      )}

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Configurações básicas do assistente IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Insights Automáticos</Label>
                <p className="text-xs text-muted-foreground">
                  Gerar insights automáticos sobre produtos e vendas
                </p>
              </div>
              <Switch
                checked={settings.enableAutoInsights}
                onCheckedChange={(checked) => handleSettingChange('enableAutoInsights', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Frequência de Insights</Label>
              <Select
                value={settings.insightFrequency}
                onValueChange={(value) => handleSettingChange('insightFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Tempo Real</SelectItem>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Áreas de Foco
          </CardTitle>
          <CardDescription>
            Configure quais áreas o assistente deve priorizar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Precificação</Label>
              <p className="text-xs text-muted-foreground">
                Análise e otimização de preços
              </p>
            </div>
            <Switch
              checked={settings.focusAreas.pricing}
              onCheckedChange={(checked) => 
                handleSettingChange('focusAreas', {
                  ...settings.focusAreas,
                  pricing: checked
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Anúncios</Label>
              <p className="text-xs text-muted-foreground">
                Otimização de títulos e descrições
              </p>
            </div>
            <Switch
              checked={settings.focusAreas.listings}
              onCheckedChange={(checked) => 
                handleSettingChange('focusAreas', {
                  ...settings.focusAreas,
                  listings: checked
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Competição</Label>
              <p className="text-xs text-muted-foreground">
                Monitoramento da concorrência
              </p>
            </div>
            <Switch
              checked={settings.focusAreas.competition}
              onCheckedChange={(checked) => 
                handleSettingChange('focusAreas', {
                  ...settings.focusAreas,
                  competition: checked
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tendências</Label>
              <p className="text-xs text-muted-foreground">
                Identificação de tendências de mercado
              </p>
            </div>
            <Switch
              checked={settings.focusAreas.trends}
              onCheckedChange={(checked) => 
                handleSettingChange('focusAreas', {
                  ...settings.focusAreas,
                  trends: checked
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Performance</Label>
              <p className="text-xs text-muted-foreground">
                Análise de desempenho de vendas
              </p>
            </div>
            <Switch
              checked={settings.focusAreas.performance}
              onCheckedChange={(checked) => 
                handleSettingChange('focusAreas', {
                  ...settings.focusAreas,
                  performance: checked
                })
              }
            />
          </div>
        </CardContent>
      </Card>





      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Preferências de Notificação
          </CardTitle>
          <CardDescription>
            Configure quais tipos de insights você deseja receber
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Insights de Alto Impacto</Label>
              <p className="text-xs text-muted-foreground">
                Receber notificações para insights de alto impacto
              </p>
            </div>
            <Switch
              checked={settings.notificationPreferences.highImpact}
              onCheckedChange={(checked) => 
                handleSettingChange('notificationPreferences', {
                  ...settings.notificationPreferences,
                  highImpact: checked
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Insights de Médio Impacto</Label>
              <p className="text-xs text-muted-foreground">
                Receber notificações para insights de médio impacto
              </p>
            </div>
            <Switch
              checked={settings.notificationPreferences.mediumImpact}
              onCheckedChange={(checked) => 
                handleSettingChange('notificationPreferences', {
                  ...settings.notificationPreferences,
                  mediumImpact: checked
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Insights de Baixo Impacto</Label>
              <p className="text-xs text-muted-foreground">
                Receber notificações para insights de baixo impacto
              </p>
            </div>
            <Switch
              checked={settings.notificationPreferences.lowImpact}
              onCheckedChange={(checked) => 
                handleSettingChange('notificationPreferences', {
                  ...settings.notificationPreferences,
                  lowImpact: checked
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Configurações de Dados
          </CardTitle>
          <CardDescription>
            Controle como seus dados são armazenados e utilizados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Histórico de Chat</Label>
              <p className="text-xs text-muted-foreground">
                Salvar histórico de conversas para melhorar as respostas
              </p>
            </div>
            <Switch
              checked={settings.chatHistory}
              onCheckedChange={(checked) => handleSettingChange('chatHistory', checked)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Retenção de Dados (dias)</Label>
            <Input
              type="number"
              value={settings.dataRetention}
              onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
              min={1}
              max={365}
            />
            <p className="text-xs text-muted-foreground">
              Período para manter dados de conversas e análises
            </p>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
