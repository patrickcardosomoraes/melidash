'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getMercadoLivreAPI } from '@/lib/api/mercado-livre';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

type AuthState = 'loading' | 'success' | 'error';

interface UserInfo {
  id: string;
  nickname: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [error, setError] = useState<string>('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const authError = searchParams.get('error');
        if (authError) {
          setError(`Erro na autorização: ${authError}`);
          setAuthState('error');
          return;
        }

        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()!.split(';').shift() || '';
          return '';
        };

        const accessToken = localStorage.getItem('ml_access_token') || getCookie('ml_access_token');
        const refreshToken = localStorage.getItem('ml_refresh_token') || getCookie('ml_refresh_token');

        if (!accessToken || !refreshToken) {
          setError('Tokens de autenticação não encontrados. Tente novamente.');
          setAuthState('error');
          return;
        }

        // Persistir em localStorage e limpar cookies transitórios
        localStorage.setItem('ml_access_token', accessToken);
        localStorage.setItem('ml_refresh_token', refreshToken);
        document.cookie = 'ml_access_token=; Max-Age=0; path=/;';
        document.cookie = 'ml_refresh_token=; Max-Age=0; path=/;';

        // Obter informações do usuário
        const mlApi = getMercadoLivreAPI(accessToken, refreshToken);
        const mlUser = await mlApi.getUserInfo();
        const info: UserInfo = {
          id: mlUser.id.toString(),
          nickname: mlUser.nickname,
          email: mlUser.email,
          first_name: mlUser.firstName,
          last_name: mlUser.lastName
        };
        setUserInfo(info);
        setAuthState('success');

        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
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
                  <p>Bem-vindo, {userInfo.first_name} {userInfo.last_name}!</p>
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Autenticação Mercado Livre</CardTitle>
            <CardDescription>
              Carregando...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
