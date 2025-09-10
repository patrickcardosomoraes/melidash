import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { ReputationOverview } from '@/components/reputation/reputation-overview';

export const metadata: Metadata = {
  title: 'Reputação | MeliDash',
  description: 'Gestão de reputação com simulador de termômetro',
};

export default function ReputationPage() {
  return (
    <MainLayout>
      <ReputationOverview />
    </MainLayout>
  );
}