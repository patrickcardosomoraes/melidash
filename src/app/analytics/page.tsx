import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { AnalyticsOverview } from '@/components/analytics/analytics-overview';

export const metadata: Metadata = {
  title: 'Analytics | MeliDash',
  description: 'Análise detalhada de performance e métricas de vendas',
};

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <AnalyticsOverview />
    </MainLayout>
  );
}