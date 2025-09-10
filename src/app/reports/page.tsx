import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { ReportsOverview } from '@/components/reports/reports-overview';

export const metadata: Metadata = {
  title: 'Relatórios | MeliDash',
  description: 'Sistema de relatórios executivos e exportação de dados',
};

export default function ReportsPage() {
  return (
    <MainLayout>
      <ReportsOverview />
    </MainLayout>
  );
}