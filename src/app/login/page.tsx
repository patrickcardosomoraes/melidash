'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/stores/auth';
import { Eye, EyeOff, ShoppingBag } from 'lucide-react';
import { useMercadoLivreAuth } from '@/hooks/use-mercado-livre-auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithCredentials } = useAuthStore();
  const { login: mlLogin, isLoading: mlLoading } = useMercadoLivreAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulação de autenticação - em produção seria uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Credenciais de demonstração
      const validCredentials = [
        { email: 'admin@melidash.com', password: 'admin123', role: 'admin' as const },
        { email: 'operador@melidash.com', password: 'operador123', role: 'user' as const },
        { email: 'demo@melidash.com', password: 'demo123', role: 'user' as const },
      ];

      const user = validCredentials.find(
        cred => cred.email === email && cred.password === password
      );

      if (user) {
        await loginWithCredentials(user.email, password);
        router.push('/dashboard');
      } else {
        setError('Email ou senha inválidos');
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Formulário de Login */}
        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login com Mercado Livre */}
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
                Conecte sua conta do Mercado Livre para acessar seus produtos e vendas reais
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            {/* Login Demo */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? 'Entrando...' : 'Entrar com Demo'}
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Credenciais de demonstração:
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Email: demo@melidash.com | Senha: demo123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Credenciais de Demonstração */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800">Credenciais de Demonstração</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-700">
            <div>
              <strong>Administrador:</strong>
              <br />Email: admin@melidash.com
              <br />Senha: admin123
            </div>
            <div>
              <strong>Operador:</strong>
              <br />Email: operador@melidash.com
              <br />Senha: operador123
            </div>
            <div>
              <strong>Demo:</strong>
              <br />Email: demo@melidash.com
              <br />Senha: demo123
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}