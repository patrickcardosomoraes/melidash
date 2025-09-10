'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getMercadoLivreAPI } from '@/lib/api/mercado-livre';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

type AuthState = 'loading' | 'success' | 'error';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [error, setError] = useState<string>('');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setError(`Erro na autorização: ${error}`);
          setAuthState('error');
          return;
        }

        if (!code) {
          setError('Código de autorização não encontrado');
          setAuthState('error');
          return;
        }

        // Trocar código por token
        const mlApi = getMercadoLivreAPI();
        const tokenData = await mlApi.exchangeCodeForToken(code);

        // Salvar tokens no localStorage (em produção, usar cookies seguros)
        localStorage.setItem('ml_access_token', tokenData.accessToken);
        localStorage.setItem('ml_refresh_token', tokenData.refreshToken);
        localStorage.setItem('ml_user_id', tokenData.userId.toString());

        // Obter informações do usuário
        const user = await mlApi.getUserInfo();
        setUserInfo(user);

        setAuthState('success');

        // Redirecionar para o dashboard após 3 segundos
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);

      } catch (err) {
        console.error('Erro no callback de autenticação:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setAuthState('error');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  const renderContent = () => {
    switch (authState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-muted-foreground">
              Processando autenticação com o Mercado Livre...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="text-center">
              <p className="font-medium text-green-600 mb-2">
                Autenticação realizada com sucesso!
              </p>
              {userInfo && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Bem-vindo, {userInfo.firstName} {userInfo.lastName}!</p>
                  <p>Nickname: @{userInfo.nickname}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                Redirecionando para o dashboard em alguns segundos...
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="text-center">
              <p className="font-medium text-red-600 mb-2">
                Erro na autenticação
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {error}
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">
                    Tentar novamente
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/dashboard">
                    Ir para Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Autenticação Mercado Livre</CardTitle>
          <CardDescription>
            Finalizando a integração com sua conta do Mercado Livre
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}