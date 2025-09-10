'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { PricingExecution } from '@/types/pricing';

interface PricingHistoryProps {
  executions: PricingExecution[];
}

export function PricingHistory({ executions }: PricingHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'ignored'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price_change'>('date');

  // Filtrar e ordenar execuções
  const filteredExecutions = executions
    .filter(execution => {
      const matchesSearch = execution.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           execution.reason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || execution.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.executedAt.getTime() - a.executedAt.getTime();
      } else {
        const changeA = Math.abs(a.newPrice - a.oldPrice);
        const changeB = Math.abs(b.newPrice - b.oldPrice);
        return changeB - changeA;
      }
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'ignored':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Sucesso</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falha</Badge>;
      case 'ignored':
        return <Badge variant="secondary">Ignorado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getPriceChangeIcon = (oldPrice: number, newPrice: number) => {
    if (newPrice > oldPrice) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (newPrice < oldPrice) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const formatPriceChange = (oldPrice: number, newPrice: number) => {
    if (oldPrice === newPrice) return 'Sem alteração';
    
    const change = newPrice - oldPrice;
    const percentage = (change / oldPrice) * 100;
    const sign = change > 0 ? '+' : '';
    
    return `${sign}R$ ${change.toFixed(2)} (${sign}${percentage.toFixed(1)}%)`;
  };

  const exportHistory = () => {
    const csvContent = [
      ['Data', 'Produto', 'Status', 'Preço Anterior', 'Novo Preço', 'Variação', 'Motivo'],
      ...filteredExecutions.map(execution => [
        execution.executedAt.toLocaleString(),
        execution.productId,
        execution.status === 'success' ? 'Sucesso' : execution.status === 'failed' ? 'Falha' : 'Ignorado',
        `R$ ${execution.oldPrice.toFixed(2)}`,
        `R$ ${execution.newPrice.toFixed(2)}`,
        formatPriceChange(execution.oldPrice, execution.newPrice),
        execution.reason
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricing-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filtros e Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Execuções
          </CardTitle>
          <CardDescription>
            Visualize todas as execuções de regras de precificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por produto ou motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filtro de Status */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'success' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('success')}
              >
                Sucessos
              </Button>
              <Button
                variant={statusFilter === 'failed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('failed')}
              >
                Falhas
              </Button>
            </div>
            
            {/* Ordenação */}
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'date' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('date')}
              >
                Por Data
              </Button>
              <Button
                variant={sortBy === 'price_change' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('price_change')}
              >
                Por Variação
              </Button>
            </div>
            
            {/* Exportar */}
            <Button variant="outline" size="sm" onClick={exportHistory}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Execuções */}
      <div className="space-y-4">
        {filteredExecutions.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma execução encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca'
                    : 'As execuções de regras aparecerão aqui quando ocorrerem'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredExecutions.map(execution => (
            <Card key={execution.id} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(execution.status)}
                      <div>
                        <h4 className="font-medium">{execution.productId}</h4>
                        <p className="text-sm text-muted-foreground">
                          {execution.executedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Preço:</span>
                        <span className="text-sm">R$ {execution.oldPrice.toFixed(2)}</span>
                        {execution.oldPrice !== execution.newPrice && (
                          <>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-sm font-medium">R$ {execution.newPrice.toFixed(2)}</span>
                            {getPriceChangeIcon(execution.oldPrice, execution.newPrice)}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{execution.reason}</p>
                    
                    {execution.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-800">
                          <strong>Erro:</strong> {execution.error}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(execution.status)}
                    {execution.oldPrice !== execution.newPrice && (
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatPriceChange(execution.oldPrice, execution.newPrice)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Paginação simples */}
      {filteredExecutions.length > 0 && (
        <div className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredExecutions.length} de {executions.length} execuções
          </p>
        </div>
      )}
    </div>
  );
}