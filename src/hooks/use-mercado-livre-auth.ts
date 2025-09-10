'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMercadoLivreAPI } from '@/lib/api/mercado-livre';
import { MLUser, MLTokenData } from '@/types/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: MLUser | null;
  error: string | null;
}

export function useMercadoLivreAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null
  });

  const [mlApi, setMlApi] = useState<ReturnType<typeof getMercadoLivreAPI> | null>(null);

  // Verificar se há tokens salvos e validar
  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const accessToken = localStorage.getItem('ml_access_token');
      const refreshToken = localStorage.getItem('ml_refresh_token');

      if (!accessToken || !refreshToken) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null
        });
        return;
      }

      // Criar instância da API com os tokens
      const api = getMercadoLivreAPI(accessToken, refreshToken);
      setMlApi(api);

      // Tentar obter informações do usuário para validar o token
      const user = await api.getUserInfo();
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user,
        error: null
      });

    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      
      // Limpar tokens inválidos
      localStorage.removeItem('ml_access_token');
      localStorage.removeItem('ml_refresh_token');
      localStorage.removeItem('ml_user_id');
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error instanceof Error ? error.message : 'Erro na autenticação'
      });
      setMlApi(null);
    }
  }, []);

  // Iniciar processo de autenticação
  const login = useCallback(() => {
    const api = getMercadoLivreAPI();
    const authUrl = api.getAuthUrl();
    window.location.href = authUrl;
  }, []);

  // Fazer logout
  const logout = useCallback(() => {
    localStorage.removeItem('ml_access_token');
    localStorage.removeItem('ml_refresh_token');
    localStorage.removeItem('ml_user_id');
    
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null
    });
    setMlApi(null);
  }, []);

  // Renovar token manualmente
  const refreshAuth = useCallback(async () => {
    if (!mlApi) return false;

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const tokenData = await mlApi.refreshAccessToken();
      
      // Atualizar tokens no localStorage
      localStorage.setItem('ml_access_token', tokenData.accessToken);
      localStorage.setItem('ml_refresh_token', tokenData.refreshToken);
      
      // Verificar autenticação novamente
      await checkAuthStatus();
      
      return true;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      logout();
      return false;
    }
  }, [mlApi, checkAuthStatus, logout]);

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Verificar periodicamente se o token ainda é válido (a cada 30 minutos)
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const interval = setInterval(() => {
      checkAuthStatus();
    }, 30 * 60 * 1000); // 30 minutos

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, checkAuthStatus]);

  return {
    ...authState,
    mlApi,
    login,
    logout,
    refreshAuth,
    checkAuthStatus
  };
}

// Hook para obter a API do Mercado Livre autenticada
export function useMercadoLivreAPI() {
  const { mlApi, isAuthenticated, isLoading } = useMercadoLivreAuth();
  
  return {
    api: mlApi,
    isReady: isAuthenticated && !isLoading && mlApi !== null
  };
}