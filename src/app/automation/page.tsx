import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { AutomationOverview } from '@/components/automation/automation-overview';

export const metadata: Metadata = {
  title: 'Automação | MeliDash',
  description: 'Sistema de automação de preços e regras de negócio',
};

export default function AutomationPage() {
  return (
    <MainLayout>
      <AutomationOverview />
    </MainLayout>
  );
}