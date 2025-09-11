'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  Star,
  Eye,
  BarChart3,
} from 'lucide-react';
// import { useDashboardStore } from '@/lib/stores/dashboard';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  className?: string;
}

function MetricCard({ title, value, description, trend, icon, className }: MetricCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-green-500' : 'text-red-500'
              )}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AlertCardProps {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  count?: number;
}

function AlertCard({ title, description, severity, count }: AlertCardProps) {
  const severityColors = {
    low: 'bg-blue-50 border-blue-200 text-blue-800',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    high: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <Card className={cn('border-l-4', severityColors[severity])}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {title}
          </CardTitle>
          {count && (
            <Badge variant={severity === 'high' ? 'destructive' : 'secondary'}>
              {count}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button variant="outline" size="sm" className="mt-2">
          Ver detalhes
        </Button>
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {

  // Mock data - em produção viria da API
  const metrics = {
    revenue: {
      value: 'R$ 45.231',
      trend: { value: 12.5, isPositive: true },
      description: 'Receita total este mês',
    },
    orders: {
      value: 1.234,
      trend: { value: 8.2, isPositive: true },
      description: 'Pedidos processados',
    },
    products: {
      value: 89,
      trend: { value: -2.1, isPositive: false },
      description: 'Produtos ativos',
    },
    conversion: {
      value: '3.2%',
      trend: { value: 0.8, isPositive: true },
      description: 'Taxa de conversão',
    },
    avgRating: {
      value: 4.8,
      description: 'Avaliação média',
    },
    views: {
      value: '12.5K',
      trend: { value: 15.3, isPositive: true },
      description: 'Visualizações hoje',
    },
  };

  const alerts = [
    {
      title: 'Estoque Baixo',
      description: '5 produtos com estoque crítico',
      severity: 'high' as const,
      count: 5,
    },
    {
      title: 'Preços Desatualizados',
      description: 'Concorrentes alteraram preços',
      severity: 'medium' as const,
      count: 12,
    },
    {
      title: 'Novas Reclamações',
      description: 'Requer atenção imediata',
      severity: 'high' as const,
      count: 3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Receita"
          value={metrics.revenue.value}
          description={metrics.revenue.description}
          trend={metrics.revenue.trend}
          icon={<DollarSign />}
        />
        <MetricCard
          title="Pedidos"
          value={metrics.orders.value}
          description={metrics.orders.description}
          trend={metrics.orders.trend}
          icon={<ShoppingCart />}
        />
        <MetricCard
          title="Produtos"
          value={metrics.products.value}
          description={metrics.products.description}
          trend={metrics.products.trend}
          icon={<Package />}
        />
        <MetricCard
          title="Conversão"
          value={metrics.conversion.value}
          description={metrics.conversion.description}
          trend={metrics.conversion.trend}
          icon={<BarChart3 />}
        />
      </div>

      {/* Métricas Secundárias */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Avaliação Média"
          value={metrics.avgRating.value}
          description={metrics.avgRating.description}
          icon={<Star />}
        />
        <MetricCard
          title="Visualizações"
          value={metrics.views.value}
          description={metrics.views.description}
          trend={metrics.views.trend}
          icon={<Eye />}
        />
        <MetricCard
          title="Clientes Ativos"
          value="2.1K"
          description="Compradores únicos"
          trend={{ value: 5.4, isPositive: true }}
          icon={<Users />}
        />
      </div>

      {/* Alertas e Notificações */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Alertas Importantes</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {alerts.map((alert, index) => (
            <AlertCard key={index} {...alert} />
          ))}
        </div>
      </div>

      {/* Gráficos e Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Período</CardTitle>
            <CardDescription>
              Comparativo dos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Gráfico de vendas será implementado aqui
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Produtos</CardTitle>
            <CardDescription>
              Produtos mais vendidos este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'iPhone 15 Pro', sales: 45, revenue: 'R$ 67.500' },
                { name: 'Samsung Galaxy S24', sales: 32, revenue: 'R$ 38.400' },
                { name: 'MacBook Air M3', sales: 18, revenue: 'R$ 25.200' },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.sales} vendas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}