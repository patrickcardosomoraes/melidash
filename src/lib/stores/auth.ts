import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import type { MLTokenData } from '@/types/api';

interface AuthState {
  user: User | null;
  token: MLTokenData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: MLTokenData) => void;
  login: (user: User) => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  loginWithML: (code: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(persist(
  (set, get) => ({
    // Estado inicial
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Ações
    setUser: (user: User) => {
      set({ user, isAuthenticated: true });
    },

    setToken: (token: MLTokenData) => {
      set({ token });
    },

    login: (user: User) => {
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    },

    loginWithCredentials: async (email: string, _password: string) => {
      set({ isLoading: true, error: null });
      try {
        // Em produção, esta função não deve ser usada
        // Manter apenas para compatibilidade com código existente
        throw new Error('Login com credenciais não disponível em produção. Use o Mercado Livre.');
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Erro no login',
          isLoading: false,
        });
      }
    },

    loginWithML: async (code: string) => {
      set({ isLoading: true, error: null });
      try {
        // TODO: Implementar OAuth com Mercado Livre
        const response = await fetch('/api/auth/ml/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Falha na autenticação com Mercado Livre');
        }

        const { user, token } = await response.json();
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Falha na autenticação', 
          isLoading: false 
        });
      }
    },

    logout: () => {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    },

    refreshToken: async () => {
      const { token } = get();
      if (!token?.refreshToken) return;

      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: token.refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Falha ao renovar token');
        }

        const newToken = await response.json();
        set({ token: newToken });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Falha ao renovar token',
          user: null,
          token: null,
          isAuthenticated: false,
        });
      }
    },

    clearError: () => {
      set({ error: null });
    },

    updateUser: (updates: Partial<User>) => {
      const { user } = get();
      if (user) {
        set({ user: { ...user, ...updates } });
      }
    },
  }),
  {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
    }),
  }
));

// Seletores
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);