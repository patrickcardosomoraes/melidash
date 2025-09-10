import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { AIAssistantOverview } from '@/components/ai-assistant/ai-assistant-overview';

export const metadata: Metadata = {
  title: 'Assistente IA | MeliDash',
  description: 'Assistente inteligente para insights e otimização de anúncios',
};

export default function AIAssistantPage() {
  return (
    <MainLayout>
      <AIAssistantOverview />
    </MainLayout>
  );
}