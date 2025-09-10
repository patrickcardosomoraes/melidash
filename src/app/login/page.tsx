'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';
import { useMercadoLivreAuth } from '@/hooks/use-mercado-livre-auth';

export default function LoginPage() {
  const { login: mlLogin, isLoading: mlLoading } = useMercadoLivreAuth();



  const handleMercadoLivreLogin = () => {
    mlLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo e Título */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">MeliDash</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Faça login em sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Gerencie suas vendas no Mercado Livre com inteligência
          </p>
        </div>

        {/* Login com Mercado Livre */}
        <Card>
          <CardHeader>
            <CardTitle>Entrar no MeliDash</CardTitle>
            <CardDescription>
              Conecte sua conta do Mercado Livre para acessar o dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button 
                onClick={handleMercadoLivreLogin}
                disabled={mlLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                size="lg"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {mlLoading ? 'Conectando...' : 'Conectar com Mercado Livre'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Faça login com sua conta do Mercado Livre para gerenciar seus produtos e vendas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}