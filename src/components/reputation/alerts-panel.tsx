'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertTriangle,
  Bell,
  X,
  Eye,
  Filter,
  TrendingDown,
  MessageSquare,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { ReputationAlert } from '@/types/reputation';

interface AlertsPanelProps {
  alerts: ReputationAlert[];
  onMarkAsRead: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

export function AlertsPanel({ alerts, onMarkAsRead, onDismiss }: AlertsPanelProps) {
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    status: 'all'
  });

  const filteredAlerts = alerts.filter(alert => {
    if (filters.severity !== 'all' && alert.severity !== filters.severity) return false;
    if (filters.type !== 'all' && alert.type !== filters.type) return false;
    if (filters.status === 'unread' && alert.isRead) return false;
    if (filters.status === 'read' && !alert.isRead) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Bell className="h-4 w-4" />;
      case 'low':
        return <Eye className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'negative_review':
        return <MessageSquare className="h-4 w-4" />;
      case 'rating_drop':
        return <TrendingDown className="h-4 w-4" />;
      case 'response_needed':
        return <MessageSquare className="h-4 w-4" />;
      case 'trend_warning':
        return <Target className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    const names: Record<string, string> = {
      negative_review: 'Avaliação Negativa',
      rating_drop: 'Queda na Avaliação',
      response_needed: 'Resposta Necessária',
      trend_warning: 'Alerta de Tendência'
    };
    return names[type] || type;
  };

  const getSeverityName = (severity: string) => {
    const names: Record<string, string> = {
      critical: 'Crítico',
      high: 'Alto',
      medium: 'Médio',
      low: 'Baixo'
    };
    return names[severity] || severity;
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const actionRequiredCount = alerts.filter(a => a.actionRequired && !a.isRead).length;

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Lidos</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              {unreadCount === 1 ? 'alerta pendente' : 'alertas pendentes'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção imediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ação Necessária</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{actionRequiredCount}</div>
            <p className="text-xs text-muted-foreground">
              Precisam de resposta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Severidade</label>
              <Select
                value={filters.severity}
                onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="negative_review">Avaliação Negativa</SelectItem>
                  <SelectItem value="rating_drop">Queda na Avaliação</SelectItem>
                  <SelectItem value="response_needed">Resposta Necessária</SelectItem>
                  <SelectItem value="trend_warning">Alerta de Tendência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="unread">Não Lidos</SelectItem>
                  <SelectItem value="read">Lidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum alerta encontrado</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Sua reputação está em boa forma!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`transition-all hover:shadow-md ${
                !alert.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(alert.type)}
                      <CardTitle className="text-base">{alert.title}</CardTitle>
                      {!alert.isRead && (
                        <Badge variant="default" className="text-xs">
                          Novo
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {getSeverityIcon(alert.severity)}
                        <span className="ml-1">{getSeverityName(alert.severity)}</span>
                      </Badge>
                      <Badge variant="outline">
                        {getTypeName(alert.type)}
                      </Badge>
                      {alert.actionRequired && (
                        <Badge variant="destructive" className="text-xs">
                          Ação Necessária
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {alert.date.toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!alert.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onMarkAsRead(alert.id)}
                          title="Marcar como lido"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDismiss(alert.id)}
                        title="Dispensar alerta"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {alert.description}
                </p>
                
                {alert.actionRequired && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="default">
                      Tomar Ação
                    </Button>
                    {alert.reviewId && (
                      <Button size="sm" variant="outline">
                        Ver Avaliação
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Ações em Lote */}
      {filteredAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ações em Lote</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  filteredAlerts
                    .filter(a => !a.isRead)
                    .forEach(a => onMarkAsRead(a.id));
                }}
                disabled={filteredAlerts.filter(a => !a.isRead).length === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar Todos como Lidos
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  filteredAlerts
                    .filter(a => a.isRead && !a.actionRequired)
                    .forEach(a => onDismiss(a.id));
                }}
                disabled={filteredAlerts.filter(a => a.isRead && !a.actionRequired).length === 0}
              >
                <X className="h-4 w-4 mr-2" />
                Dispensar Lidos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}