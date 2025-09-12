'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Mail,
  Key,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Unlink,
} from 'lucide-react';
import { useMercadoLivreAuth } from '@/hooks/use-mercado-livre-auth';
import { useAuthStore } from '@/lib/stores/auth';

export function SettingsOverview() {
  const { isAuthenticated, user, login, logout, isLoading } = useMercadoLivreAuth();
  const authStore = useAuthStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true,
  });

  const handleMLConnect = () => {
    login();
  };

  const handleMLDisconnect = () => {
    logout();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e integrações
          </p>
        </div>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integrações de Marketplace
              </CardTitle>
              <CardDescription>
                Conecte suas contas de marketplace para sincronizar dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mercado Livre Integration */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-lg">ML</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Mercado Livre</h3>
                    <p className="text-sm text-muted-foreground">
                      Sincronize produtos, vendas e métricas
                    </p>
                    {isAuthenticated && user && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          Conectado como {user.nickname}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ID: {user.id}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isAuthenticated ? (
                    <>
                      <Badge variant="default" className="bg-green-600 text-white hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Conectado
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMLDisconnect}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Unlink className="h-4 w-4 mr-1" />
                        Desconectar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Desconectado
                      </Badge>
                      <Button
                        onClick={handleMLConnect}
                        disabled={isLoading}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {isLoading ? 'Conectando...' : 'Conectar'}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Future integrations placeholder */}
              <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">SL</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Shopee</h3>
                    <p className="text-sm text-muted-foreground">
                      Em breve - Integração com Shopee
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Em breve</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-lg">AM</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Amazon</h3>
                    <p className="text-sm text-muted-foreground">
                      Em breve - Integração com Amazon
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Em breve</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    placeholder="Seu nome"
                    value={user?.firstName || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    placeholder="Seu sobrenome"
                    value={user?.lastName || ''}
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  placeholder="Seu nickname"
                  value={user?.nickname || ''}
                  disabled
                />
              </div>
              <p className="text-sm text-muted-foreground">
                As informações do perfil são sincronizadas automaticamente com sua conta do Mercado Livre.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas importantes por email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas críticos por SMS
                  </p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, sms: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba dicas e novidades do MeliDash
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança da Conta
              </CardTitle>
              <CardDescription>
                Gerencie a segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Autenticação OAuth</h3>
                      <p className="text-sm text-muted-foreground">
                        Conectado via Mercado Livre OAuth 2.0
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600 text-white hover:bg-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Seguro
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Criptografia de Dados</h3>
                      <p className="text-sm text-muted-foreground">
                        Todos os dados são criptografados em trânsito e em repouso
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600 text-white hover:bg-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Conexão HTTPS</h3>
                      <p className="text-sm text-muted-foreground">
                        Todas as comunicações são protegidas por SSL/TLS
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600 text-white hover:bg-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium text-red-600">Zona de Perigo</h3>
                <p className="text-sm text-muted-foreground">
                  Ações irreversíveis que afetam sua conta
                </p>
                <Button variant="destructive" className="mt-2">
                  Desconectar Todas as Integrações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}