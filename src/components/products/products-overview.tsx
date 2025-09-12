'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMercadoLivreAuth } from '@/hooks/use-mercado-livre-auth';
import { getConfig } from '@/lib/config/production';
import { ProductImage } from './product-image';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Edit,
  Pause,
  Play
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data para demonstração
const mockProducts = [
  {
    id: '1',
    mlId: 'MLB123456789',
    title: 'iPhone 15 Pro Max 256GB Titânio Natural',
    price: 8999.99,
    stock: 15,
    sales: 45,
    status: 'active' as const,
    views: 1250,
    conversion: 3.6,
    trend: 'up' as const,
    image: '/api/placeholder/80/80',
    category: 'Celulares e Smartphones',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    mlId: 'MLB987654321',
    title: 'MacBook Air M3 13" 8GB 256GB SSD',
    price: 12499.99,
    stock: 8,
    sales: 23,
    status: 'active' as const,
    views: 890,
    conversion: 2.6,
    trend: 'up' as const,
    image: '/api/placeholder/80/80',
    category: 'Notebooks',
    lastUpdated: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    mlId: 'MLB456789123',
    title: 'AirPods Pro 2ª Geração com Case MagSafe',
    price: 1899.99,
    stock: 3,
    sales: 67,
    status: 'active' as const,
    views: 2100,
    conversion: 3.2,
    trend: 'down' as const,
    image: '/api/placeholder/80/80',
    category: 'Fones de Ouvido',
    lastUpdated: '2024-01-15T08:45:00Z'
  },
  {
    id: '4',
    mlId: 'MLB789123456',
    title: 'Apple Watch Series 9 GPS 45mm',
    price: 3299.99,
    stock: 0,
    sales: 12,
    status: 'paused' as const,
    views: 450,
    conversion: 2.7,
    trend: 'down' as const,
    image: '/api/placeholder/80/80',
    category: 'Smartwatches',
    lastUpdated: '2024-01-14T16:20:00Z'
  },
  {
    id: '5',
    mlId: 'MLB321654987',
    title: 'iPad Air 5ª Geração 64GB Wi-Fi',
    price: 4199.99,
    stock: 12,
    sales: 34,
    status: 'active' as const,
    views: 1680,
    conversion: 2.0,
    trend: 'up' as const,
    image: '/api/placeholder/80/80',
    category: 'Tablets',
    lastUpdated: '2024-01-15T11:10:00Z'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="default" className="bg-green-600 text-white hover:bg-green-700">Ativo</Badge>;
    case 'paused':
      return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600">Pausado</Badge>;
    case 'closed':
      return <Badge variant="destructive" className="bg-red-600 text-white hover:bg-red-700">Fechado</Badge>;
    default:
      return <Badge variant="outline" className="border-gray-400 text-gray-600">Desconhecido</Badge>;
  }
};

const getTrendIcon = (trend: string) => {
  return trend === 'up' ? (
    <TrendingUp className="h-4 w-4 text-green-600" />
  ) : (
    <TrendingDown className="h-4 w-4 text-red-600" />
  );
};

export function ProductsOverview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter] = useState<'all' | 'active' | 'paused' | 'ended'>('all');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { mlApi } = useMercadoLivreAuth();
  const config = getConfig();

  useEffect(() => {
    const loadProducts = async () => {
      if (config.USE_MOCK_DATA) {
        // Usar dados mock em desenvolvimento
        setProducts(mockProducts);
        setLoading(false);
      } else {
        // Usar API real em produção
        try {
          if (mlApi) {
            const response = await mlApi.getMyProducts();
            setProducts(response.results || []);
          }
        } catch (error) {
          console.error('Erro ao carregar produtos:', error);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProducts();
  }, [mlApi, config.USE_MOCK_DATA]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => (p.stock || 0) < 5).length;
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {activeProducts} ativos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Produtos com estoque baixo
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversão Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Produtos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os seus produtos do Mercado Livre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>

          {/* Lista de Produtos */}
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <ProductImage
                    thumbnailId={product.thumbnailId || product.thumbnail_id}
                    thumbnail={product.thumbnail}
                    secureThumbnail={product.secureThumbnail || product.secure_thumbnail}
                    title={product.title}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-muted-foreground">ID: {product.mlId}</span>
                      {getStatusBadge(product.status)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className="font-medium">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} vendas</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <span className={`text-sm font-medium ${
                        (product.stock || 0) < 5 ? 'text-orange-600' : 
                        (product.stock || 0) === 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {product.stock || 0} un.
                      </span>
                      {(product.stock || 0) < 5 && (product.stock || 0) > 0 && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{product.views} views</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium">{product.conversion}%</span>
                      {getTrendIcon(product.trend)}
                    </div>
                    <p className="text-sm text-muted-foreground">conversão</p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      {product.status === 'active' ? (
                        <DropdownMenuItem>
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>
                          <Play className="h-4 w-4 mr-2" />
                          Ativar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Tente ajustar os filtros de busca' : 'Você ainda não possui produtos cadastrados'}
              </p>
              {!searchTerm && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Produto
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}