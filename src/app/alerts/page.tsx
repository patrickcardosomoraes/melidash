import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { AlertsOverview } from '@/components/alerts/alerts-overview';

export const metadata: Metadata = {
  title: 'Alertas | MeliDash',
  description: 'Central de alertas e notificações do sistema',
};

export default function AlertsPage() {
  return (
    <MainLayout>
      <AlertsOverview />
    </MainLayout>
  );
}