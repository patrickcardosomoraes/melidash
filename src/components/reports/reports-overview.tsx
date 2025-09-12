'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  BarChart3,
  PieChart,
  Filter,
  RefreshCw,
  Mail,
  Share
} from 'lucide-react';

interface ReportData {
  id: string;
  name: string;
  type: 'sales' | 'financial' | 'inventory' | 'performance' | 'custom';
  period: string;
  status: 'ready' | 'generating' | 'scheduled';
  lastGenerated: string;
  size: string;
  format: 'pdf' | 'excel' | 'csv';
}

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function ReportsOverview() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setReports([
        {
          id: '1',
          name: 'Relatório de Vendas Mensal',
          type: 'sales',
          period: 'Mensal',
          status: 'ready',
          lastGenerated: '2 horas atrás',
          size: '2.4 MB',
          format: 'pdf'
        },
        {
          id: '2',
          name: 'Análise Financeira Trimestral',
          type: 'financial',
          period: 'Trimestral',
          status: 'ready',
          lastGenerated: '1 dia atrás',
          size: '5.1 MB',
          format: 'excel'
        },
        {
          id: '3',
          name: 'Controle de Estoque',
          type: 'inventory',
          period: 'Semanal',
          status: 'generating',
          lastGenerated: '3 dias atrás',
          size: '1.8 MB',
          format: 'csv'
        },
        {
          id: '4',
          name: 'Performance de Produtos',
          type: 'performance',
          period: 'Mensal',
          status: 'scheduled',
          lastGenerated: '1 semana atrás',
          size: '3.2 MB',
          format: 'pdf'
        },
        {
          id: '5',
          name: 'Relatório Personalizado - ROI',
          type: 'custom',
          period: 'Personalizado',
          status: 'ready',
          lastGenerated: '4 horas atrás',
          size: '1.5 MB',
          format: 'excel'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const metrics: MetricCard[] = [
    {
      title: 'Receita Total',
      value: 'R$ 127.450',
      change: 12.5,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Vendas Realizadas',
      value: '1.847',
      change: 8.2,
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Novos Clientes',
      value: '342',
      change: 15.3,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Taxa de Conversão',
      value: '14.2%',
      change: 2.1,
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-600 text-white hover:bg-green-700">Pronto</Badge>;
      case 'generating':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Gerando</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700">Agendado</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-500 text-white hover:bg-gray-600">Desconhecido</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales': return <ShoppingCart className="h-4 w-4" />;
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'inventory': return <BarChart3 className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'custom': return <PieChart className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getFormatBadge = (format: string) => {
    const colors = {
      pdf: 'bg-red-600 text-white hover:bg-red-700',
      excel: 'bg-green-600 text-white hover:bg-green-700',
      csv: 'bg-blue-600 text-white hover:bg-blue-700'
    };
    return (
      <Badge className={colors[format as keyof typeof colors]}>
        {format.toUpperCase()}
      </Badge>
    );
  };

  const filteredReports = reports.filter(report => {
    if (selectedType === 'all') return true;
    return report.type === selectedType;
  });

  const generateReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'generating' as const }
        : report
    ));
    
    // Simular geração
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: 'ready' as const, lastGenerated: 'Agora' }
          : report
      ));
    }, 3000);
  };

  const downloadReport = (reportId: string) => {
    // Simular download
    console.log(`Downloading report ${reportId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios Executivos</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Novo Relatório
          </Button>
        </div>
      </div>

      {/* Métricas Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={metric.change > 0 ? 'text-green-600' : 'text-red-600'}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  {' '}desde o período anterior
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="1y">Último ano</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="sales">Vendas</SelectItem>
            <SelectItem value="financial">Financeiro</SelectItem>
            <SelectItem value="inventory">Estoque</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="scheduled">Agendados</TabsTrigger>
          <TabsTrigger value="templates">Modelos</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{report.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {report.period} • {report.size}
                          </span>
                          {getFormatBadge(report.format)}
                          {getStatusBadge(report.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <p className="text-sm font-medium">Última geração</p>
                        <p className="text-sm text-muted-foreground">{report.lastGenerated}</p>
                      </div>
                      
                      {report.status === 'ready' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadReport(report.id)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            <Share className="h-4 w-4 mr-2" />
                            Compartilhar
                          </Button>
                        </>
                      )}
                      
                      {report.status !== 'generating' && (
                        <Button 
                          size="sm"
                          onClick={() => generateReport(report.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Gerar
                        </Button>
                      )}
                      
                      {report.status === 'generating' && (
                        <Button size="sm" disabled>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Gerando...
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Agendados</CardTitle>
              <CardDescription>
                Configure a geração automática de relatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.filter(r => r.status === 'scheduled').map((report) => (
                  <div key={report.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(report.type)}
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Próxima geração: Amanhã às 08:00
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar por Email
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Modelos de Relatório</CardTitle>
              <CardDescription>
                Crie e gerencie modelos personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'Vendas Mensais', description: 'Relatório completo de vendas do mês' },
                  { name: 'Análise de ROI', description: 'Retorno sobre investimento em marketing' },
                  { name: 'Performance de Produtos', description: 'Análise detalhada por produto' },
                  { name: 'Relatório Financeiro', description: 'Balanço e demonstrativo de resultados' },
                  { name: 'Controle de Estoque', description: 'Status e movimentação de estoque' },
                  { name: 'Satisfação do Cliente', description: 'Métricas de atendimento e feedback' }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full">
                        Usar Modelo
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}