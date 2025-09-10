'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  MapPin,
  Search,
  Eye
} from 'lucide-react';
import { TrendData } from '@/types/trends';

interface TrendCardProps {
  trend: TrendData;
}

export function TrendCard({ trend }: TrendCardProps) {
  const isGrowing = trend.growth > 0;
  const growthColor = isGrowing ? 'text-green-600' : trend.growth < 0 ? 'text-red-600' : 'text-gray-600';
  const TrendIcon = isGrowing ? TrendingUp : TrendingDown;

  const formatSearchVolume = (volume: number): string => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const getSeasonalityColor = (pattern: string): string => {
    switch (pattern) {
      case 'growing': return 'bg-green-100 text-green-800';
      case 'declining': return 'bg-red-100 text-red-800';
      case 'seasonal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{trend.keyword}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline">{trend.category}</Badge>
              <span className="flex items-center gap-1 text-xs">
                <MapPin className="h-3 w-3" />
                {trend.region}
              </span>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 ${growthColor}`}>
              <TrendIcon className="h-4 w-4" />
              <span className="font-semibold">
                {trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {trend.period}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Volume de Busca */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              Volume de Busca
            </span>
            <span className="font-medium">
              {formatSearchVolume(trend.searchVolume)}
            </span>
          </div>
          <Progress 
            value={Math.min((trend.searchVolume / 200000) * 100, 100)} 
            className="h-2"
          />
        </div>

        {/* Sazonalidade */}
        {trend.seasonality && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Sazonalidade</span>
              <Badge 
                variant="secondary" 
                className={getSeasonalityColor(trend.seasonality.pattern)}
              >
                {trend.seasonality.pattern}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Pico:</span>
                <span>{trend.seasonality.peak}</span>
              </div>
              <div className="flex justify-between">
                <span>Baixa:</span>
                <span>{trend.seasonality.low}</span>
              </div>
              <div className="flex justify-between">
                <span>Confiança:</span>
                <span>{trend.seasonality.confidence}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Palavras-chave Relacionadas */}
        {trend.relatedKeywords && trend.relatedKeywords.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Relacionadas:</p>
            <div className="flex flex-wrap gap-1">
              {trend.relatedKeywords.slice(0, 3).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {trend.relatedKeywords.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{trend.relatedKeywords.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Última Atualização */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Atualizado em {trend.lastUpdated.toLocaleDateString('pt-BR')}
          </span>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <Eye className="h-3 w-3 mr-1" />
            Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}