import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { SettingsOverview } from '@/components/settings/settings-overview';

export const metadata: Metadata = {
  title: 'Configurações | MeliDash',
  description: 'Configurações da conta e integrações',
};

export default function SettingsPage() {
  return (
    <MainLayout>
      <SettingsOverview />
    </MainLayout>
  );
}