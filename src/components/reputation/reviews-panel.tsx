'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Star,
  MessageSquare,
  Reply,
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Calendar,
  User,
  Package
} from 'lucide-react';
import { Review, ReviewCategory } from '@/types/reputation';

interface ReviewsPanelProps {
  reviews: Review[];
  onRefresh: () => void;
  onRespond: (reviewId: string, response: string) => void;
}

export function ReviewsPanel({ reviews, onRefresh, onRespond }: ReviewsPanelProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [filters, setFilters] = useState({
    sentiment: 'all',
    category: 'all',
    needsResponse: false,
    search: ''
  });
  const [isResponding, setIsResponding] = useState(false);

  const filteredReviews = reviews.filter(review => {
    if (filters.sentiment !== 'all' && review.sentiment !== filters.sentiment) return false;
    if (filters.category !== 'all' && review.category !== filters.category) return false;
    if (filters.needsResponse && (review.response || review.isResolved)) return false;
    if (filters.search && !review.comment.toLowerCase().includes(filters.search.toLowerCase()) &&
        !review.productName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !review.customerName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleRespond = async () => {
    if (!selectedReview || !responseText.trim()) return;
    
    setIsResponding(true);
    try {
      await onRespond(selectedReview.id, responseText);
      setResponseText('');
      setSelectedReview(null);
      onRefresh();
    } catch (error) {
      console.error('Erro ao responder avaliação:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-600 text-white border-green-600 hover:bg-green-700';
      case 'negative':
        return 'bg-red-600 text-white border-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600';
    }
  };

  const getCategoryName = (category: ReviewCategory) => {
    const names: Record<ReviewCategory, string> = {
      delivery: 'Entrega',
      product_quality: 'Qualidade',
      communication: 'Comunicação',
      packaging: 'Embalagem',
      price: 'Preço',
      other: 'Outros'
    };
    return names[category];
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Produto, cliente ou comentário..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sentimento</label>
              <Select
                value={filters.sentiment}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sentiment: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="positive">Positivo</SelectItem>
                  <SelectItem value="neutral">Neutro</SelectItem>
                  <SelectItem value="negative">Negativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="delivery">Entrega</SelectItem>
                  <SelectItem value="product_quality">Qualidade</SelectItem>
                  <SelectItem value="communication">Comunicação</SelectItem>
                  <SelectItem value="packaging">Embalagem</SelectItem>
                  <SelectItem value="price">Preço</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Button
                variant={filters.needsResponse ? 'default' : 'outline'}
                onClick={() => setFilters(prev => ({ ...prev, needsResponse: !prev.needsResponse }))}
                className="w-full justify-start"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Precisam Resposta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Avaliações */}
      <div className="grid gap-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma avaliação encontrada</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className={`transition-all hover:shadow-md ${
              selectedReview?.id === review.id ? 'ring-2 ring-primary' : ''
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <Badge className={getSentimentColor(review.sentiment)}>
                        {getSentimentIcon(review.sentiment)}
                        <span className="ml-1 capitalize">{review.sentiment}</span>
                      </Badge>
                      <Badge variant="outline">
                        {getCategoryName(review.category)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {review.customerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {review.productName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {review.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!review.response && !review.isResolved && (
                      <Badge variant="destructive">Precisa Resposta</Badge>
                    )}
                    {review.isResolved && (
                      <Badge variant="secondary">Resolvido</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Comentário do Cliente */}
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{review.comment}</p>
                </div>
                
                {/* Resposta do Vendedor */}
                {review.response && (
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Reply className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Sua Resposta</span>
                      <span className="text-xs text-muted-foreground">
                        {review.response.date.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{review.response.message}</p>
                  </div>
                )}
                
                {/* Botão de Responder */}
                {!review.response && !review.isResolved && (
                  <Button
                    onClick={() => setSelectedReview(review)}
                    variant="outline"
                    size="sm"
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Responder
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Resposta */}
      {selectedReview && (
        <Card className="fixed inset-0 z-50 m-4 md:m-8 overflow-auto">
          <CardHeader>
            <CardTitle>Responder Avaliação</CardTitle>
            <CardDescription>
              Respondendo para {selectedReview.customerName} sobre {selectedReview.productName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avaliação Original */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{renderStars(selectedReview.rating)}</div>
                <span className="text-sm text-muted-foreground">
                  {selectedReview.date.toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm">{selectedReview.comment}</p>
            </div>
            
            {/* Campo de Resposta */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sua Resposta</label>
              <Textarea
                placeholder="Digite sua resposta profissional e empática..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
              />
            </div>
            
            {/* Botões */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedReview(null);
                  setResponseText('');
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRespond}
                disabled={!responseText.trim() || isResponding}
              >
                {isResponding ? 'Enviando...' : 'Enviar Resposta'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}