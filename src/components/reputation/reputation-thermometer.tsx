'use client';

import { useState, useEffect } from 'react';
import { ReputationMetrics } from '@/types/reputation';
import { getReputationService } from '@/lib/services/reputation-service';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ReputationThermometerProps {
  metrics: ReputationMetrics;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function ReputationThermometer({ 
  metrics, 
  size = 'md', 
  showDetails = true 
}: ReputationThermometerProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const reputationService = getReputationService();
  
  const temperature = reputationService.calculateTemperature(metrics);
  
  // Animação do termômetro
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(temperature.temperature);
    }, 300);
    return () => clearTimeout(timer);
  }, [temperature.temperature]);

  // Configurações de tamanho
  const sizeConfig = {
    sm: {
      container: 'w-16 h-32',
      bulb: 'w-8 h-8',
      tube: 'w-4',
      text: 'text-xs',
      title: 'text-sm'
    },
    md: {
      container: 'w-20 h-40',
      bulb: 'w-10 h-10',
      tube: 'w-5',
      text: 'text-sm',
      title: 'text-base'
    },
    lg: {
      container: 'w-24 h-48',
      bulb: 'w-12 h-12',
      tube: 'w-6',
      text: 'text-base',
      title: 'text-lg'
    }
  };

  const config = sizeConfig[size];
  
  // Cálculo da altura do líquido
  const liquidHeight = (animatedValue / 100) * 70; // 70% da altura do tubo
  
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      cold: 'Frio',
      cool: 'Fresco',
      warm: 'Morno',
      hot: 'Quente',
      burning: 'Fervendo'
    };
    return statusMap[status] || status;
  };

  const getStatusDescription = (status: string) => {
    const descriptions: Record<string, string> = {
      cold: 'Reputação crítica - Ação imediata necessária',
      cool: 'Reputação baixa - Melhorias urgentes',
      warm: 'Reputação moderada - Bom progresso',
      hot: 'Reputação alta - Continue assim!',
      burning: 'Reputação excelente - Parabéns!'
    };
    return descriptions[status] || '';
  };

  const getTrendIcon = () => {
    switch (metrics.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Termômetro Visual */}
      <div className="relative flex flex-col items-center">
        {/* Escala */}
        <div className="absolute -left-8 h-full flex flex-col justify-between text-xs text-muted-foreground py-2">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>
        
        {/* Container do Termômetro */}
        <div className={`relative ${config.container} flex flex-col items-center`}>
          {/* Topo do termômetro */}
          <div className="w-3 h-3 bg-gray-300 rounded-full mb-1" />
          
          {/* Tubo do termômetro */}
          <div className={`relative ${config.tube} flex-1 bg-gray-200 rounded-full overflow-hidden`}>
            {/* Líquido animado */}
            <div 
              className="absolute bottom-0 w-full rounded-full transition-all duration-1000 ease-out"
              style={{
                height: `${liquidHeight}%`,
                backgroundColor: temperature.color,
                boxShadow: `0 0 10px ${temperature.color}40`
              }}
            />
            
            {/* Marcações */}
            <div className="absolute inset-0 flex flex-col justify-between py-1">
              {[100, 75, 50, 25].map((mark) => (
                <div key={mark} className="w-full h-px bg-gray-400 opacity-50" />
              ))}
            </div>
          </div>
          
          {/* Bulbo do termômetro */}
          <div 
            className={`${config.bulb} rounded-full mt-1 transition-all duration-1000`}
            style={{
              backgroundColor: temperature.color,
              boxShadow: `0 0 15px ${temperature.color}60`
            }}
          />
        </div>
      </div>

      {/* Informações */}
      <div className="text-center space-y-2">
        {/* Temperatura */}
        <div className="flex items-center justify-center gap-2">
          <span className={`${config.title} font-bold`} style={{ color: temperature.color }}>
            {Math.round(animatedValue)}°
          </span>
          <Badge 
            variant="outline" 
            className="border-current"
            style={{ color: temperature.color, borderColor: temperature.color }}
          >
            {getStatusText(temperature.status)}
          </Badge>
        </div>
        
        {/* Tendência */}
        <div className="flex items-center justify-center gap-1">
          {getTrendIcon()}
          <span className={`${config.text} text-muted-foreground`}>
            Tendência: {metrics.trend === 'up' ? 'Subindo' : 
                      metrics.trend === 'down' ? 'Descendo' : 'Estável'}
          </span>
        </div>

        {showDetails && (
          <>
            {/* Descrição do Status */}
            <p className={`${config.text} text-muted-foreground max-w-xs`}>
              {getStatusDescription(temperature.status)}
            </p>
            
            {/* Última Atualização */}
            <p className="text-xs text-muted-foreground">
              Atualizado: {metrics.lastUpdated.toLocaleTimeString()}
            </p>
          </>
        )}
      </div>

      {/* Indicadores de Zona */}
      {showDetails && (
        <div className="w-full max-w-xs">
          <div className="text-xs text-muted-foreground mb-2 text-center">Zonas de Reputação</div>
          <div className="flex h-2 rounded-full overflow-hidden">
            <div className="flex-1 bg-indigo-500" title="Frio (0-49)" />
            <div className="flex-1 bg-blue-500" title="Fresco (50-69)" />
            <div className="flex-1 bg-yellow-500" title="Morno (70-84)" />
            <div className="flex-1 bg-orange-500" title="Quente (85-94)" />
            <div className="flex-1 bg-red-500" title="Fervendo (95-100)" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>50</span>
            <span>70</span>
            <span>85</span>
            <span>95</span>
            <span>100</span>
          </div>
        </div>
      )}
    </div>
  );
}
