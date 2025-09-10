'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Search, Send, Clock, CheckCheck, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  customerName: string;
  customerAvatar?: string;
  subject: string;
  preview: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  platform: 'mercadolivre' | 'whatsapp' | 'email';
}

export function MessagesOverview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          customerName: 'João Silva',
          subject: 'Dúvida sobre produto',
          preview: 'Olá, gostaria de saber mais detalhes sobre o produto XYZ...',
          timestamp: '2 min atrás',
          status: 'unread',
          priority: 'high',
          platform: 'mercadolivre'
        },
        {
          id: '2',
          customerName: 'Maria Santos',
          subject: 'Problema com entrega',
          preview: 'Meu pedido ainda não chegou, podem verificar o status?',
          timestamp: '15 min atrás',
          status: 'read',
          priority: 'medium',
          platform: 'whatsapp'
        },
        {
          id: '3',
          customerName: 'Pedro Costa',
          subject: 'Solicitação de troca',
          preview: 'Recebi o produto com defeito, gostaria de trocar...',
          timestamp: '1 hora atrás',
          status: 'replied',
          priority: 'high',
          platform: 'email'
        },
        {
          id: '4',
          customerName: 'Ana Oliveira',
          subject: 'Elogio ao atendimento',
          preview: 'Quero parabenizar pelo excelente atendimento...',
          timestamp: '2 horas atrás',
          status: 'read',
          priority: 'low',
          platform: 'mercadolivre'
        },
        {
          id: '5',
          customerName: 'Carlos Lima',
          subject: 'Pergunta sobre garantia',
          preview: 'Qual é o prazo de garantia deste produto?',
          timestamp: '3 horas atrás',
          status: 'unread',
          priority: 'medium',
          platform: 'whatsapp'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'read': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'replied': return <CheckCheck className="h-4 w-4 text-green-500" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'mercadolivre': return <Badge variant="outline">ML</Badge>;
      case 'whatsapp': return <Badge variant="outline" className="bg-green-100">WhatsApp</Badge>;
      case 'email': return <Badge variant="outline" className="bg-blue-100">Email</Badge>;
      default: return <Badge variant="outline">Outro</Badge>;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'unread') return matchesSearch && message.status === 'unread';
    if (selectedTab === 'high') return matchesSearch && message.priority === 'high';
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const highPriorityCount = messages.filter(m => m.priority === 'high').length;
  const avgResponseTime = '2.5h';
  const todayMessages = 12;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Nova Mensagem
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? 'Requer atenção' : 'Tudo em dia'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityCount}</div>
            <p className="text-xs text-muted-foreground">
              Urgentes para resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              de resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMessages}</div>
            <p className="text-xs text-muted-foreground">
              mensagens recebidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mensagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas ({messages.length})</TabsTrigger>
          <TabsTrigger value="unread">Não Lidas ({unreadCount})</TabsTrigger>
          <TabsTrigger value="high">Alta Prioridade ({highPriorityCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card key={message.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={message.customerAvatar} />
                      <AvatarFallback>
                        {message.customerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{message.customerName}</h3>
                          {getPlatformBadge(message.platform)}
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`} />
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          {getStatusIcon(message.status)}
                          <span>{message.timestamp}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium text-sm">{message.subject}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.preview}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredMessages.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Nenhuma mensagem encontrada' : 'Nenhuma mensagem nesta categoria'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}