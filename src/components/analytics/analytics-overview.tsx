'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import { getConfig } from '@/lib/config/production';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    current: number;
    previous: number;
    change: number;
  };
  visitors: {
    current: number;
    previous: number;
    change: number;
  };
  conversion: {
    current: number;
    previous: number;
    change: number;
  };
}

const mockAnalyticsData: AnalyticsData = {
  revenue: {
    current: 45280,
    previous: 38950,
    change: 16.3,
  },
  orders: {
    current: 1247,
    previous: 1089,
    change: 14.5,
  },
  visitors: {
    current: 8934,
    previous: 7821,
    change: 14.2,
  },
  conversion: {
    current: 13.9,
    previous: 13.1,
    change: 6.1,
  },
};

const salesData = [
  { month: 'Jan', revenue: 32000, orders: 890 },
  { month: 'Fev', revenue: 35000, orders: 950 },
  { month: 'Mar', revenue: 38000, orders: 1020 },
  { month: 'Abr', revenue: 42000, orders: 1150 },
  { month: 'Mai', revenue: 45280, orders: 1247 },
];

const topProducts = [
  { name: 'iPhone 15 Pro', sales: 234, revenue: 280800 },
  { name: 'Samsung Galaxy S24', sales: 189, revenue: 151200 },
  { name: 'MacBook Air M3', sales: 156, revenue: 187200 },
  { name: 'AirPods Pro', sales: 298, revenue: 89400 },
  { name: 'iPad Air', sales: 167, revenue: 100200 },
];

export function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    const config = getConfig();
    
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      if (config.USE_MOCK_DATA) {
        setData(mockAnalyticsData);
      } else {
        // Em produção, inicializar com dados vazios
        setData({
          revenue: { current: 0, previous: 0, change: 0 },
          orders: { current: 0, previous: 0, change: 0 },
          visitors: { current: 0, previous: 0, change: 0 },
          conversion: { current: 0, previous: 0, change: 0 }
        });
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Análise detalhada de performance e métricas de vendas
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Análise detalhada de performance e métricas de vendas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span className="text-sm font-medium">Período:</span>
        <div className="flex gap-1">
          {[
            { label: '7d', value: '7d' },
            { label: '30d', value: '30d' },
            { label: '90d', value: '90d' },
            { label: '1a', value: '1y' },
          ].map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period.value)}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.revenue.current || 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data && data.revenue.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={data && data.revenue.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {data?.revenue.change.toFixed(1)}%
              </span>
              <span className="ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data?.orders.current || 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data && data.orders.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={data && data.orders.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {data?.orders.change.toFixed(1)}%
              </span>
              <span className="ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data?.visitors.current || 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data && data.visitors.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={data && data.visitors.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {data?.visitors.change.toFixed(1)}%
              </span>
              <span className="ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.conversion.current.toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data && data.conversion.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={data && data.conversion.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {data?.conversion.change.toFixed(1)}%
              </span>
              <span className="ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="traffic">Tráfego</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Vendas</CardTitle>
                <CardDescription>
                  Receita e pedidos nos últimos 5 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 text-sm font-medium">{item.month}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {formatCurrency(item.revenue)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatNumber(item.orders)} pedidos
                          </div>
                        </div>
                      </div>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(item.revenue / Math.max(...salesData.map(d => d.revenue))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Produtos</CardTitle>
                <CardDescription>
                  Produtos mais vendidos no período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatNumber(product.sales)} vendas
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(product.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Produtos</CardTitle>
              <CardDescription>
                Performance detalhada por categoria de produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Análise detalhada de produtos em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Tráfego</CardTitle>
              <CardDescription>
                Origem e comportamento dos visitantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Análise de tráfego em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}