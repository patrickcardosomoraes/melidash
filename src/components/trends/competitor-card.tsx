'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ExternalLink,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Star,
  DollarSign,
  Package,
  Users,
  Activity
} from 'lucide-react';
import { CompetitorMonitoring } from '@/types/trends';

interface CompetitorCardProps {
  competitor: CompetitorMonitoring;
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  const getThreatColor = (threat: string): string => {
    switch (threat) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStrategyColor = (strategy: string): string => {
    switch (strategy) {
      case 'aggressive': return 'destructive';
      case 'competitive': return 'default';
      case 'premium': return 'secondary';
      case 'dynamic': return 'outline';
      default: return 'outline';
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const unreadAlerts = competitor.alerts.filter(alert => !alert.isRead);
  const criticalAlerts = competitor.alerts.filter(alert => 
    alert.severity === 'critical' || alert.severity === 'high'
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {competitor.competitorName}
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge 
                variant={getStrategyColor(competitor.priceStrategy) as "default" | "secondary" | "destructive" | "outline"}
                className="text-xs"
              >
                {competitor.priceStrategy}
              </Badge>
              <span className="text-xs">
                {competitor.products.length} produto(s)
              </span>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">
              {competitor.marketShare.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Market Share
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Nível de Ameaça */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Nível de Ameaça
            </span>
            <Badge 
              className={getThreatColor(competitor.performance.threats)}
            >
              {competitor.performance.threats}
            </Badge>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Competitividade de Preço</span>
              <span>{competitor.performance.priceCompetitiveness}%</span>
            </div>
            <Progress value={competitor.performance.priceCompetitiveness} className="h-1" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Qualidade do Produto</span>
              <span>{competitor.performance.productQuality}%</span>
            </div>
            <Progress value={competitor.performance.productQuality} className="h-1" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Satisfação do Cliente</span>
              <span>{competitor.performance.customerSatisfaction}%</span>
            </div>
            <Progress value={competitor.performance.customerSatisfaction} className="h-1" />
          </div>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span className="text-xs">Vendas Est.</span>
            </div>
            <p className="font-medium">
              {formatCurrency(competitor.performance.salesEstimate)}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs">Crescimento</span>
            </div>
            <p className="font-medium text-green-600">
              +{competitor.performance.growthRate.toFixed(1)}%
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span className="text-xs">Posição</span>
            </div>
            <p className="font-medium">
              #{competitor.performance.marketPosition}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Activity className="h-3 w-3" />
              <span className="text-xs">Alertas</span>
            </div>
            <p className="font-medium">
              {unreadAlerts.length}
              {criticalAlerts.length > 0 && (
                <span className="text-red-600 ml-1">
                  ({criticalAlerts.length} críticos)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Produtos em Destaque */}
        {competitor.products.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Produtos Monitorados:</p>
            <div className="space-y-2">
              {competitor.products.slice(0, 2).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {product.rating.toFixed(1)}
                      </span>
                      <span>({product.reviewCount})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(product.price)}
                    </p>
                    {product.priceChange && (
                      <p className={`text-xs ${
                        product.priceChange > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {product.priceChange > 0 ? '+' : ''}{product.priceChange.toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {competitor.products.length > 2 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{competitor.products.length - 2} produtos
                </p>
              )}
            </div>
          </div>
        )}

        {/* Alertas Recentes */}
        {unreadAlerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Alertas Recentes:</p>
            <div className="space-y-1">
              {unreadAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {alert.severity}
                    </Badge>
                    <span className="text-muted-foreground">
                      {alert.createdAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="mt-1">{alert.message}</p>
                </div>
              ))}
              {unreadAlerts.length > 2 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{unreadAlerts.length - 2} alertas
                </p>
              )}
            </div>
          </div>
        )}

        {/* Última Análise */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>
            Analisado em {competitor.lastAnalyzed.toLocaleDateString('pt-BR')}
          </span>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}