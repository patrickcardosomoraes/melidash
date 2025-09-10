import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DashboardLayout, DashboardMetric } from '@/types';

interface DashboardState {
  layout: DashboardLayout[];
  metrics: DashboardMetric[];
  isLoading: boolean;
  error: string | null;
  refreshInterval: number;
  lastUpdated: Date | null;
}

interface DashboardActions {
  setLayout: (layout: DashboardLayout[]) => void;
  updateLayout: (id: string, updates: Partial<DashboardLayout>) => void;
  addCard: (card: DashboardLayout) => void;
  removeCard: (id: string) => void;
  setMetrics: (metrics: DashboardMetric[]) => void;
  updateMetric: (id: string, updates: Partial<DashboardMetric>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRefreshInterval: (interval: number) => void;
  refreshData: () => Promise<void>;
  resetLayout: () => void;
}

type DashboardStore = DashboardState & DashboardActions;

const defaultLayout: DashboardLayout[] = [
  {
    id: 'sales-overview',
    type: 'metric',
    title: 'Vendas Hoje',
    position: { x: 0, y: 0, w: 3, h: 2 },
    config: { metric: 'daily_sales' },
    isVisible: true,
  },
  {
    id: 'revenue-overview',
    type: 'metric',
    title: 'Receita Mensal',
    position: { x: 3, y: 0, w: 3, h: 2 },
    config: { metric: 'monthly_revenue' },
    isVisible: true,
  },
  {
    id: 'products-active',
    type: 'metric',
    title: 'Produtos Ativos',
    position: { x: 6, y: 0, w: 3, h: 2 },
    config: { metric: 'active_products' },
    isVisible: true,
  },
  {
    id: 'reputation-score',
    type: 'metric',
    title: 'Reputação',
    position: { x: 9, y: 0, w: 3, h: 2 },
    config: { metric: 'reputation_score' },
    isVisible: true,
  },
  {
    id: 'sales-chart',
    type: 'chart',
    title: 'Vendas dos Últimos 30 Dias',
    position: { x: 0, y: 2, w: 6, h: 4 },
    config: { chartType: 'line', dataKey: 'sales_trend' },
    isVisible: true,
  },
  {
    id: 'top-products',
    type: 'table',
    title: 'Produtos Mais Vendidos',
    position: { x: 6, y: 2, w: 6, h: 4 },
    config: { dataKey: 'top_products', limit: 10 },
    isVisible: true,
  },
];

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      layout: defaultLayout,
      metrics: [],
      isLoading: false,
      error: null,
      refreshInterval: 30000, // 30 seconds
      lastUpdated: null,

      // Actions
      setLayout: (layout: DashboardLayout[]) => {
        set({ layout });
      },

      updateLayout: (id: string, updates: Partial<DashboardLayout>) => {
        const { layout } = get();
        const updatedLayout = layout.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        );
        set({ layout: updatedLayout });
      },

      addCard: (card: DashboardLayout) => {
        const { layout } = get();
        set({ layout: [...layout, card] });
      },

      removeCard: (id: string) => {
        const { layout } = get();
        const filteredLayout = layout.filter((item) => item.id !== id);
        set({ layout: filteredLayout });
      },

      setMetrics: (metrics: DashboardMetric[]) => {
        set({ metrics, lastUpdated: new Date() });
      },

      updateMetric: (id: string, updates: Partial<DashboardMetric>) => {
        const { metrics } = get();
        const updatedMetrics = metrics.map((metric) =>
          metric.id === id ? { ...metric, ...updates } : metric
        );
        set({ metrics: updatedMetrics });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setRefreshInterval: (refreshInterval: number) => {
        set({ refreshInterval });
      },

      refreshData: async () => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement API calls to fetch dashboard data
          const response = await fetch('/api/dashboard/metrics');
          if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
          }
          const metrics = await response.json();
          set({ metrics, lastUpdated: new Date(), isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to refresh data',
            isLoading: false,
          });
        }
      },

      resetLayout: () => {
        set({ layout: defaultLayout });
      },
    }),
    {
      name: 'dashboard-storage',
      partialize: (state: DashboardStore) => ({
        layout: state.layout,
        refreshInterval: state.refreshInterval,
      }),
    }
  )
);

// Selectors
export const useDashboardLayout = () => useDashboardStore((state) => state.layout);
export const useDashboardMetrics = () => useDashboardStore((state) => state.metrics);
export const useDashboardLoading = () => useDashboardStore((state) => state.isLoading);
export const useDashboardError = () => useDashboardStore((state) => state.error);
export const useRefreshInterval = () => useDashboardStore((state) => state.refreshInterval);
export const useLastUpdated = () => useDashboardStore((state) => state.lastUpdated);