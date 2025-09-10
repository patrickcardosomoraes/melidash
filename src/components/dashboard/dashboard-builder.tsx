'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Layout, 
  Plus, 
  Settings, 
  Save, 
  Eye, 
  Trash2,
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Star,
  AlertTriangle,
  Calendar
} from 'lucide-react';

interface WidgetConfig {
  value?: string;
  change?: number;
  color?: string;
  chartType?: string;
  period?: string;
  limit?: number;
  columns?: string[];
  current?: number;
  target?: number;
  maxAlerts?: number;
  priority?: string;
  view?: string;
  showTasks?: boolean;
  icon?: any;
}

interface Widget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'progress' | 'alert' | 'calendar';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config: WidgetConfig;
  enabled: boolean;
}

interface DashboardLayout {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  isDefault: boolean;
  lastModified: string;
}

const WIDGET_TEMPLATES = [
  {
    id: 'revenue-metric',
    type: 'metric' as const,
    title: 'Receita Total',
    icon: DollarSign,
    description: 'Receita total do período selecionado',
    size: 'small' as const,
    config: {
      value: 'R$ 127.450',
      change: 12.5,
      color: 'green'
    }
  },
  {
    id: 'sales-metric',
    type: 'metric' as const,
    title: 'Vendas Realizadas',
    icon: ShoppingCart,
    description: 'Número total de vendas',
    size: 'small' as const,
    config: {
      value: '1.847',
      change: 8.2,
      color: 'blue'
    }
  },
  {
    id: 'customers-metric',
    type: 'metric' as const,
    title: 'Novos Clientes',
    icon: Users,
    description: 'Clientes adquiridos no período',
    size: 'small' as const,
    config: {
      value: '342',
      change: 15.3,
      color: 'purple'
    }
  },
  {
    id: 'conversion-metric',
    type: 'metric' as const,
    title: 'Taxa de Conversão',
    icon: TrendingUp,
    description: 'Percentual de conversão de visitantes',
    size: 'small' as const,
    config: {
      value: '14.2%',
      change: 2.1,
      color: 'orange'
    }
  },
  {
    id: 'sales-chart',
    type: 'chart' as const,
    title: 'Vendas por Período',
    icon: BarChart3,
    description: 'Gráfico de vendas ao longo do tempo',
    size: 'large' as const,
    config: {
      chartType: 'line',
      period: '30d'
    }
  },
  {
    id: 'products-chart',
    type: 'chart' as const,
    title: 'Produtos Mais Vendidos',
    icon: PieChart,
    description: 'Distribuição de vendas por produto',
    size: 'medium' as const,
    config: {
      chartType: 'pie',
      limit: 10
    }
  },
  {
    id: 'inventory-table',
    type: 'table' as const,
    title: 'Status do Estoque',
    icon: Package,
    description: 'Tabela com status atual do estoque',
    size: 'large' as const,
    config: {
      columns: ['produto', 'quantidade', 'status'],
      limit: 20
    }
  },
  {
    id: 'reputation-progress',
    type: 'progress' as const,
    title: 'Reputação ML',
    icon: Star,
    description: 'Progresso da reputação no Mercado Livre',
    size: 'medium' as const,
    config: {
      current: 85,
      target: 95,
      color: 'yellow'
    }
  },
  {
    id: 'alerts-widget',
    type: 'alert' as const,
    title: 'Alertas Importantes',
    icon: AlertTriangle,
    description: 'Notificações e alertas do sistema',
    size: 'medium' as const,
    config: {
      maxAlerts: 5,
      priority: 'high'
    }
  },
  {
    id: 'calendar-widget',
    type: 'calendar' as const,
    title: 'Agenda de Tarefas',
    icon: Calendar,
    description: 'Calendário com tarefas e eventos',
    size: 'large' as const,
    config: {
      view: 'month',
      showTasks: true
    }
  }
];

export function DashboardBuilder() {
  const [layouts, setLayouts] = useState<DashboardLayout[]>([]);
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout | null>(null);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de layouts salvos
    setTimeout(() => {
      const defaultLayout: DashboardLayout = {
        id: 'default',
        name: 'Dashboard Principal',
        description: 'Layout padrão do dashboard',
        isDefault: true,
        lastModified: new Date().toISOString(),
        widgets: [
          {
            id: 'widget-1',
            type: 'metric',
            title: 'Receita Total',
            size: 'small',
            position: { x: 0, y: 0 },
            enabled: true,
            config: {
              value: 'R$ 127.450',
              change: 12.5,
              color: 'green',
              icon: 'DollarSign'
            }
          },
          {
            id: 'widget-2',
            type: 'metric',
            title: 'Vendas Realizadas',
            size: 'small',
            position: { x: 1, y: 0 },
            enabled: true,
            config: {
              value: '1.847',
              change: 8.2,
              color: 'blue',
              icon: 'ShoppingCart'
            }
          },
          {
            id: 'widget-3',
            type: 'chart',
            title: 'Vendas por Período',
            size: 'large',
            position: { x: 0, y: 1 },
            enabled: true,
            config: {
              chartType: 'line',
              period: '30d'
            }
          }
        ]
      };
      
      setLayouts([defaultLayout]);
      setCurrentLayout(defaultLayout);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPosition: { x: number; y: number }) => {
    e.preventDefault();
    
    if (!draggedWidget || !currentLayout) return;
    
    const updatedWidgets = currentLayout.widgets.map(widget => {
      if (widget.id === draggedWidget) {
        return { ...widget, position: targetPosition };
      }
      return widget;
    });
    
    const updatedLayout = {
      ...currentLayout,
      widgets: updatedWidgets,
      lastModified: new Date().toISOString()
    };
    
    setCurrentLayout(updatedLayout);
    setLayouts(prev => prev.map(layout => 
      layout.id === currentLayout.id ? updatedLayout : layout
    ));
    
    setDraggedWidget(null);
  };

  const addWidget = (template: typeof WIDGET_TEMPLATES[0]) => {
    if (!currentLayout) return;
    
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: template.type,
      title: template.title,
      size: template.size,
      position: { x: 0, y: currentLayout.widgets.length },
      enabled: true,
      config: template.config
    };
    
    const updatedLayout = {
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget],
      lastModified: new Date().toISOString()
    };
    
    setCurrentLayout(updatedLayout);
    setLayouts(prev => prev.map(layout => 
      layout.id === currentLayout.id ? updatedLayout : layout
    ));
  };

  const removeWidget = (widgetId: string) => {
    if (!currentLayout) return;
    
    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.filter(w => w.id !== widgetId),
      lastModified: new Date().toISOString()
    };
    
    setCurrentLayout(updatedLayout);
    setLayouts(prev => prev.map(layout => 
      layout.id === currentLayout.id ? updatedLayout : layout
    ));
  };

  const toggleWidget = (widgetId: string) => {
    if (!currentLayout) return;
    
    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.map(w => 
        w.id === widgetId ? { ...w, enabled: !w.enabled } : w
      ),
      lastModified: new Date().toISOString()
    };
    
    setCurrentLayout(updatedLayout);
    setLayouts(prev => prev.map(layout => 
      layout.id === currentLayout.id ? updatedLayout : layout
    ));
  };

  const saveLayout = () => {
    if (!currentLayout) return;
    console.log('Layout salvo:', currentLayout);
    // Aqui seria feita a persistência no backend
  };

  const createNewLayout = () => {
    const newLayout: DashboardLayout = {
      id: `layout-${Date.now()}`,
      name: `Novo Dashboard ${layouts.length + 1}`,
      description: 'Dashboard personalizado',
      isDefault: false,
      lastModified: new Date().toISOString(),
      widgets: []
    };
    
    setLayouts(prev => [...prev, newLayout]);
    setCurrentLayout(newLayout);
  };

  const renderWidget = (widget: Widget) => {
    const sizeClasses = {
      small: 'col-span-1 row-span-1',
      medium: 'col-span-2 row-span-1',
      large: 'col-span-3 row-span-2'
    };

    const getIcon = (iconName: string) => {
      const icons: Record<string, React.ComponentType<{ className?: string }>> = {
        DollarSign,
        ShoppingCart,
        Users,
        TrendingUp,
        BarChart3,
        PieChart,
        Package,
        Star,
        AlertTriangle,
        Calendar
      };
      const Icon = icons[iconName] || BarChart3;
      return <Icon className="h-4 w-4" />;
    };

    return (
      <Card 
        key={widget.id}
        className={`${sizeClasses[widget.size]} ${!widget.enabled ? 'opacity-50' : ''} ${!isPreviewMode ? 'cursor-move' : ''} transition-all hover:shadow-md`}
        draggable={!isPreviewMode}
        onDragStart={(e) => handleDragStart(e, widget.id)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          <div className="flex items-center space-x-1">
            {widget.config.icon && getIcon(widget.config.icon)}
            {!isPreviewMode && (
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedWidget(widget)}
                >
                  <Settings className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeWidget(widget.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {widget.type === 'metric' && (
            <div>
              <div className="text-2xl font-bold">{widget.config.value}</div>
              {widget.config.change !== undefined && (
                <p className="text-xs text-muted-foreground">
                  <span className={widget.config.change > 0 ? 'text-green-600' : 'text-red-600'}>
                    {widget.config.change > 0 ? '+' : ''}{widget.config.change}%
                  </span>
                  {' '}desde o período anterior
                </p>
              )}
            </div>
          )}
          
          {widget.type === 'chart' && (
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Gráfico: {widget.config.chartType}</p>
              </div>
            </div>
          )}
          
          {widget.type === 'table' && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Últimas {widget.config.limit} entradas</div>
              <div className="h-20 bg-gray-50 rounded flex items-center justify-center">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          )}
          
          {widget.type === 'progress' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Atual: {widget.config.current}%</span>
                <span>Meta: {widget.config.target}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${widget.config.current}%` }}
                />
              </div>
            </div>
          )}
          
          {widget.type === 'alert' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">3 alertas ativos</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Prioridade: {widget.config.priority}
              </div>
            </div>
          )}
          
          {widget.type === 'calendar' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm">5 eventos hoje</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Visualização: {widget.config.view}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Construtor de Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Construtor de Dashboard</h1>
          <p className="text-muted-foreground">
            Personalize seu dashboard arrastando e soltando widgets
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="preview-mode">Modo Visualização</Label>
            <Switch 
              id="preview-mode"
              checked={isPreviewMode}
              onCheckedChange={setIsPreviewMode}
            />
          </div>
          <Button variant="outline" onClick={createNewLayout}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Layout
          </Button>
          <Button onClick={saveLayout}>
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList>
          <TabsTrigger value="builder">Construtor</TabsTrigger>
          <TabsTrigger value="layouts">Layouts Salvos</TabsTrigger>
          <TabsTrigger value="widgets">Biblioteca de Widgets</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          {currentLayout && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{currentLayout.name}</h2>
                  <p className="text-sm text-muted-foreground">{currentLayout.description}</p>
                </div>
                <Badge variant={currentLayout.isDefault ? 'default' : 'secondary'}>
                  {currentLayout.isDefault ? 'Padrão' : 'Personalizado'}
                </Badge>
              </div>
              
              <div 
                className="grid grid-cols-4 gap-4 min-h-96 p-4 border-2 border-dashed border-gray-300 rounded-lg"
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.floor((e.clientX - rect.left) / (rect.width / 4));
                  const y = Math.floor((e.clientY - rect.top) / 100);
                  handleDrop(e, { x, y });
                }}
              >
                {currentLayout.widgets.map(renderWidget)}
                
                {currentLayout.widgets.length === 0 && (
                  <div className="col-span-4 flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Layout className="h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Dashboard Vazio</h3>
                    <p className="text-center mb-4">
                      Adicione widgets da biblioteca ou arraste elementos existentes
                    </p>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Widget
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="layouts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {layouts.map((layout) => (
              <Card key={layout.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{layout.name}</CardTitle>
                    <Badge variant={layout.isDefault ? 'default' : 'secondary'}>
                      {layout.isDefault ? 'Padrão' : 'Personalizado'}
                    </Badge>
                  </div>
                  <CardDescription>{layout.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Widgets: {layout.widgets.length}</span>
                      <span>Modificado: {new Date(layout.lastModified).toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setCurrentLayout(layout)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setCurrentLayout(layout)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="widgets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {WIDGET_TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Tamanho: {template.size}
                      </span>
                      <Button 
                        size="sm"
                        onClick={() => addWidget(template)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para configuração de widget */}
      {selectedWidget && (
        <Dialog open={!!selectedWidget} onOpenChange={() => setSelectedWidget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar Widget</DialogTitle>
              <DialogDescription>
                Personalize as configurações do widget {selectedWidget.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="widget-title">Título</Label>
                <Input 
                  id="widget-title" 
                  value={selectedWidget.title}
                  onChange={(e) => setSelectedWidget({
                    ...selectedWidget,
                    title: e.target.value
                  })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="widget-enabled"
                  checked={selectedWidget.enabled}
                  onCheckedChange={(checked) => {
                    setSelectedWidget({
                      ...selectedWidget,
                      enabled: checked
                    });
                    toggleWidget(selectedWidget.id);
                  }}
                />
                <Label htmlFor="widget-enabled">Widget Ativo</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedWidget(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => setSelectedWidget(null)}>
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}