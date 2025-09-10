'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { TrendData, TrendPeriod } from '@/types/trends';
import { useState } from 'react';

interface TrendsChartProps {
  trends: TrendData[];
  period: TrendPeriod;
}

export function TrendsChart({ trends, period }: TrendsChartProps) {
  const [chartType, setChartType] = useState<'volume' | 'growth'>('growth');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtrar tendências por categoria
  const filteredTrends = selectedCategory === 'all' 
    ? trends 
    : trends.filter(trend => trend.category === selectedCategory);

  // Obter categorias únicas
  const categories = Array.from(new Set(trends.map(trend => trend.category)));

  // Preparar dados para o gráfico
  const chartData = filteredTrends
    .sort((a, b) => chartType === 'growth' ? b.growth - a.growth : b.searchVolume - a.searchVolume)
    .slice(0, 10);

  const maxValue = chartType === 'growth' 
    ? Math.max(...chartData.map(trend => Math.abs(trend.growth)))
    : Math.max(...chartData.map(trend => trend.searchVolume));

  const formatValue = (value: number): string => {
    if (chartType === 'growth') {
      return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    } else {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toString();
    }
  };

  const getBarWidth = (value: number): number => {
    if (chartType === 'growth') {
      return (Math.abs(value) / maxValue) * 100;
    } else {
      return (value / maxValue) * 100;
    }
  };

  const getBarColor = (trend: TrendData): string => {
    if (chartType === 'growth') {
      if (trend.growth > 10) return 'bg-green-500';
      if (trend.growth > 0) return 'bg-green-400';
      if (trend.growth > -10) return 'bg-red-400';
      return 'bg-red-500';
    } else {
      if (trend.searchVolume > 100000) return 'bg-blue-500';
      if (trend.searchVolume > 50000) return 'bg-blue-400';
      if (trend.searchVolume > 10000) return 'bg-blue-300';
      return 'bg-blue-200';
    }
  };

  const getPeriodLabel = (period: TrendPeriod): string => {
    switch (period) {
      case '24h': return 'últimas 24 horas';
      case '7d': return 'últimos 7 dias';
      case '30d': return 'últimos 30 dias';
      case '90d': return 'últimos 90 dias';
      case '1y': return 'último ano';
      default: return period;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Análise de Tendências
            </CardTitle>
            <CardDescription>
              {chartType === 'growth' ? 'Crescimento' : 'Volume de busca'} - {getPeriodLabel(period)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={chartType} onValueChange={(value: 'volume' | 'growth') => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="growth">Crescimento</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma tendência encontrada para os filtros selecionados</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Legenda */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Palavra-chave</span>
              <span>{chartType === 'growth' ? 'Crescimento' : 'Volume de Busca'}</span>
            </div>
            
            {/* Gráfico de Barras */}
            <div className="space-y-3">
              {chartData.map((trend, index) => {
                const value = chartType === 'growth' ? trend.growth : trend.searchVolume;
                const barWidth = getBarWidth(value);
                const barColor = getBarColor(trend);
                
                return (
                  <div key={trend.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <span className="font-medium truncate">
                          {trend.keyword}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {trend.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {chartType === 'growth' && (
                          <div className={`flex items-center gap-1 ${
                            trend.growth > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {trend.growth > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                          </div>
                        )}
                        <span className="font-medium min-w-0">
                          {formatValue(value)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Barra de Progresso */}
                    <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} transition-all duration-500 ease-out`}
                        style={{ width: `${barWidth}%` }}
                      />
                      
                      {/* Informações adicionais na barra */}
                      <div className="absolute inset-0 flex items-center justify-between px-3 text-xs">
                        <span className="text-gray-700 font-medium truncate">
                          {trend.keyword}
                        </span>
                        {chartType === 'volume' && (
                          <span className="text-gray-600">
                            {trend.region}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Informações extras */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {chartType === 'growth' 
                          ? `${trend.searchVolume.toLocaleString()} buscas`
                          : `${trend.growth > 0 ? '+' : ''}${trend.growth.toFixed(1)}% crescimento`
                        }
                      </span>
                      <span>{trend.region}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Resumo Estatístico */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Resumo Estatístico</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total de Tendências</p>
                  <p className="font-medium">{filteredTrends.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Crescimento Médio</p>
                  <p className="font-medium">
                    {(filteredTrends.reduce((acc, trend) => acc + trend.growth, 0) / filteredTrends.length).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Volume Total</p>
                  <p className="font-medium">
                    {(filteredTrends.reduce((acc, trend) => acc + trend.searchVolume, 0) / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Em Crescimento</p>
                  <p className="font-medium text-green-600">
                    {filteredTrends.filter(trend => trend.growth > 0).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}