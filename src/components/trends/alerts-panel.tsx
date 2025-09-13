'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Clock,
  TrendingDown,
  TrendingUp,
  Package,
  DollarSign,
  Star,
  Eye,
  Mail
} from 'lucide-react';
import { CompetitorAlert, AlertSeverity, CompetitorAlertType } from '@/types/trends';

interface AlertsPanelProps {
  alerts: CompetitorAlert[];
  onMarkAsRead: (alertId: string) => void;
}

export function AlertsPanel({ alerts, onMarkAsRead }: AlertsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || alert.type === selectedType;
    const matchesReadStatus = !showUnreadOnly || !alert.isRead;
    
    return matchesSearch && matchesSeverity && matchesType && matchesReadStatus;
  });

  // Agrupar alertas por severidade
  const alertsBySeverity = {
    critical: filteredAlerts.filter(alert => alert.severity === 'critical'),
    high: filteredAlerts.filter(alert => alert.severity === 'high'),
    medium: filteredAlerts.filter(alert => alert.severity === 'medium'),
    low: filteredAlerts.filter(alert => alert.severity === 'low')
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical').length;

  const getSeverityColor = (severity: AlertSeverity): string => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
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

  const getTypeIcon = (type: CompetitorAlertType) => {
    switch (type) {
      case 'price_drop':
      case 'price_increase':
        return <DollarSign className="h-4 w-4" />;
      case 'new_product':
      case 'out_of_stock':
      case 'back_in_stock':
        return <Package className="h-4 w-4" />;
      case 'promotion_started':
      case 'promotion_ended':
        return <TrendingUp className="h-4 w-4" />;
      case 'rating_change':
        return <Star className="h-4 w-4" />;
      case 'market_share_change':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: CompetitorAlertType): string => {
    const labels: Record<CompetitorAlertType, string> = {
      price_drop: 'Queda de Preço',
      price_increase: 'Aumento de Preço',
      new_product: 'Novo Produto',
      out_of_stock: 'Fora de Estoque',
      back_in_stock: 'Voltou ao Estoque',
      promotion_started: 'Promoção Iniciada',
      promotion_ended: 'Promoção Encerrada',
      rating_change: 'Mudança de Avaliação',
      market_share_change: 'Mudança de Market Share'
    };
    return labels[type] || type;
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Não Lidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(alert => {
                const today = new Date();
                const alertDate = new Date(alert.createdAt);
                return alertDate.toDateString() === today.toDateString();
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Filtro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alertas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="price_drop">Queda de Preço</SelectItem>
                  <SelectItem value="price_increase">Aumento de Preço</SelectItem>
                  <SelectItem value="new_product">Novo Produto</SelectItem>
                  <SelectItem value="out_of_stock">Fora de Estoque</SelectItem>
                  <SelectItem value="promotion_started">Promoção</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant={showUnreadOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Não Lidos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alertas */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos ({filteredAlerts.length})</TabsTrigger>
          <TabsTrigger value="critical">Críticos ({alertsBySeverity.critical.length})</TabsTrigger>
          <TabsTrigger value="high">Alta ({alertsBySeverity.high.length})</TabsTrigger>
          <TabsTrigger value="medium">Média ({alertsBySeverity.medium.length})</TabsTrigger>
          <TabsTrigger value="low">Baixa ({alertsBySeverity.low.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum alerta encontrado</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`${!alert.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getSeverityColor(alert.severity) as "default" | "secondary" | "destructive" | "outline"}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getTypeIcon(alert.type)}
                            <span className="ml-1">{getTypeLabel(alert.type)}</span>
                          </Badge>
                          {!alert.isRead && (
                            <Badge variant="default" className="text-xs">
                              Novo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium mb-1">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(alert.createdAt)}
                          </span>
                          {alert.productId && (
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              Produto: {alert.productId}
                            </span>
                          )}
                        </div>
                        
                        {/* Dados Adicionais */}
                        {Object.keys(alert.data).length > 0 && (
                          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                            <p className="font-medium mb-1">Detalhes:</p>
                            <div className="space-y-1">
                              {Object.entries(alert.data).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-muted-foreground">{key}:</span>
                                  <span>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!alert.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkAsRead(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como Lido
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tabs por Severidade */}
        {Object.entries(alertsBySeverity).map(([severity, severityAlerts]) => (
          <TabsContent key={severity} value={severity} className="space-y-3">
            {severityAlerts.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum alerta de severidade {severity}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              severityAlerts.map((alert) => (
                <Card key={alert.id} className={`${!alert.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getTypeIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getSeverityColor(alert.severity) as "default" | "secondary" | "destructive" | "outline"}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(alert.type)}
                            </Badge>
                            {!alert.isRead && (
                              <Badge variant="default" className="text-xs">
                                Novo
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium mb-1">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(alert.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {!alert.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkAsRead(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como Lido
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
