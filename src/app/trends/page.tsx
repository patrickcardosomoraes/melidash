import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { TrendsOverview } from '@/components/trends/trends-overview';

export const metadata: Metadata = {
  title: 'Tendências | MeliDash',
  description: 'Radar de tendências e monitoramento de concorrência',
};

export default function TrendsPage() {
  return (
    <MainLayout>
      <TrendsOverview />
    </MainLayout>
  );
}