import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { DashboardBuilder } from '@/components/dashboard/dashboard-builder';

export const metadata: Metadata = {
  title: 'Construtor de Dashboard | MeliDash',
  description: 'Personalize seu dashboard com widgets drag-and-drop',
};

export default function DashboardBuilderPage() {
  return (
    <MainLayout>
      <DashboardBuilder />
    </MainLayout>
  );
}