'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, AlertTriangle, Info, CheckCircle, X, Settings } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  category: 'system' | 'sales' | 'inventory' | 'automation';
  priority: 'low' | 'medium' | 'high';
}

export function AlertsOverview() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setAlerts([
        {
          id: '1',
          title: 'Estoque Baixo',
          message: 'Produto "Smartphone XYZ" com apenas 3 unidades em estoque',
          type: 'warning',
          timestamp: '5 min atrás',
          read: false,
          category: 'inventory',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Venda Realizada',
          message: 'Nova venda de R$ 299,90 realizada com sucesso',
          type: 'success',
          timestamp: '12 min atrás',
          read: false,
          category: 'sales',
          priority: 'medium'
        },
        {
          id: '3',
          title: 'Automação Pausada',
          message: 'Regra "Ajuste Competitivo" foi pausada devido a erro',
          type: 'error',
          timestamp: '1 hora atrás',
          read: true,
          category: 'automation',
          priority: 'high'
        },
        {
          id: '4',
          title: 'Sistema Atualizado',
          message: 'Sistema atualizado para versão 2.1.0 com sucesso',
          type: 'info',
          timestamp: '2 horas atrás',
          read: true,
          category: 'system',
          priority: 'low'
        },
        {
          id: '5',
          title: 'Meta Atingida',
          message: 'Meta de vendas do mês foi atingida! Parabéns!',
          type: 'success',
          timestamp: '3 horas atrás',
          read: false,
          category: 'sales',
          priority: 'medium'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'info': return 'border-l-blue-500 bg-blue-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      system: 'bg-gray-100 text-gray-800',
      sales: 'bg-green-100 text-green-800',
      inventory: 'bg-blue-100 text-blue-800',
      automation: 'bg-purple-100 text-purple-800'
    };
    
    const labels = {
      system: 'Sistema',
      sales: 'Vendas',
      inventory: 'Estoque',
      automation: 'Automação'
    };

    return (
      <Badge className={colors[category as keyof typeof colors]}>
        {labels[category as keyof typeof labels]}
      </Badge>
    );
  };

  const filteredAlerts = alerts.filter(alert => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'unread') return !alert.read;
    if (selectedTab === 'high') return alert.priority === 'high';
    return alert.category === selectedTab;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Alertas</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const unreadCount = alerts.filter(a => !a.read).length;
  const highPriorityCount = alerts.filter(a => a.priority === 'high').length;
  const todayCount = alerts.length; // Simplificado
  const errorCount = alerts.filter(a => a.type === 'error').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Alertas</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Marcar Todas como Lidas
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? 'Requer atenção' : 'Tudo em dia'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityCount}</div>
            <p className="text-xs text-muted-foreground">
              Urgentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCount}</div>
            <p className="text-xs text-muted-foreground">
              alertas recebidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorCount}</div>
            <p className="text-xs text-muted-foreground">
              {errorCount > 0 ? 'Precisam correção' : 'Nenhum erro'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos ({alerts.length})</TabsTrigger>
          <TabsTrigger value="unread">Não Lidas ({unreadCount})</TabsTrigger>
          <TabsTrigger value="high">Alta Prioridade ({highPriorityCount})</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={`border-l-4 ${getAlertColor(alert.type)} ${!alert.read ? 'shadow-md' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${!alert.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {alert.title}
                          </h3>
                          {getCategoryBadge(alert.category)}
                          {!alert.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className={`text-sm ${!alert.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!alert.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                        >
                          Marcar como Lida
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum alerta nesta categoria
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Configurações de Notificação */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Notificação</CardTitle>
          <CardDescription>
            Configure quais tipos de alertas você deseja receber
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de Sistema</p>
              <p className="text-sm text-muted-foreground">
                Atualizações e manutenções do sistema
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de Vendas</p>
              <p className="text-sm text-muted-foreground">
                Notificações sobre vendas e metas
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de Estoque</p>
              <p className="text-sm text-muted-foreground">
                Avisos sobre estoque baixo ou zerado
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de Automação</p>
              <p className="text-sm text-muted-foreground">
                Status das regras de automação
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}