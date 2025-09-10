import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { MessagesOverview } from '@/components/messages/messages-overview';

export const metadata: Metadata = {
  title: 'Mensagens | MeliDash',
  description: 'Central de mensagens e comunicação com clientes',
};

export default function MessagesPage() {
  return (
    <MainLayout>
      <MessagesOverview />
    </MainLayout>
  );
}