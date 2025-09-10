import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Tipos de notificações do Mercado Livre
interface MLNotification {
  _id: string;
  resource: string;
  user_id: number;
  topic: string;
  application_id: number;
  attempts: number;
  sent: string;
  received: string;
}

// Tópicos de notificação suportados
type MLTopic = 
  | 'orders_v2'
  | 'items'
  | 'questions'
  | 'claims'
  | 'messages'
  | 'payments'
  | 'shipments';

export async function POST(request: NextRequest) {
  try {
    const headersList = headers();
    const userAgent = headersList.get('user-agent');
    const contentType = headersList.get('content-type');

    // Verificar se a requisição vem do Mercado Livre
    if (!userAgent?.includes('MercadoLibre')) {
      console.warn('Webhook rejeitado: User-Agent inválido');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verificar Content-Type
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type deve ser application/json' },
        { status: 400 }
      );
    }

    const notification: MLNotification = await request.json();

    // Validar estrutura da notificação
    if (!notification.resource || !notification.topic || !notification.user_id) {
      return NextResponse.json(
        { error: 'Estrutura de notificação inválida' },
        { status: 400 }
      );
    }

    console.log('Notificação recebida:', {
      id: notification._id,
      topic: notification.topic,
      resource: notification.resource,
      userId: notification.user_id,
      received: new Date().toISOString()
    });

    // Processar notificação baseada no tópico
    await processNotification(notification);

    // Responder com status 200 para confirmar recebimento
    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error) {
    console.error('Erro ao processar webhook do Mercado Livre:', error);
    
    // Retornar erro 500 fará o ML tentar reenviar
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Processar notificação baseada no tópico
async function processNotification(notification: MLNotification) {
  const { topic, resource, user_id } = notification;

  try {
    switch (topic as MLTopic) {
      case 'orders_v2':
        await handleOrderNotification(resource, user_id);
        break;
        
      case 'items':
        await handleItemNotification(resource, user_id);
        break;
        
      case 'questions':
        await handleQuestionNotification(resource, user_id);
        break;
        
      case 'claims':
        await handleClaimNotification(resource, user_id);
        break;
        
      case 'messages':
        await handleMessageNotification(resource, user_id);
        break;
        
      case 'payments':
        await handlePaymentNotification(resource, user_id);
        break;
        
      case 'shipments':
        await handleShipmentNotification(resource, user_id);
        break;
        
      default:
        console.log(`Tópico não tratado: ${topic}`);
    }
  } catch (error) {
    console.error(`Erro ao processar notificação ${topic}:`, error);
    throw error; // Re-throw para que o ML tente reenviar
  }
}

// Handlers específicos para cada tipo de notificação
async function handleOrderNotification(resource: string, userId: number) {
  console.log(`Processando notificação de pedido: ${resource} para usuário ${userId}`);
  
  // TODO: Implementar lógica específica
  // - Buscar dados do pedido via API do ML
  // - Atualizar banco de dados local
  // - Enviar notificações para o usuário
  // - Atualizar métricas em tempo real
}

async function handleItemNotification(resource: string, userId: number) {
  console.log(`Processando notificação de item: ${resource} para usuário ${userId}`);
  
  // TODO: Implementar lógica específica
  // - Buscar dados do item via API do ML
  // - Atualizar cache de produtos
  // - Notificar sobre mudanças de preço/estoque
}

async function handleQuestionNotification(resource: string, userId: number) {
  console.log(`Processando notificação de pergunta: ${resource} para usuário ${userId}`);
  
  // TODO: Implementar lógica específica
  // - Buscar dados da pergunta via API do ML
  // - Notificar vendedor sobre nova pergunta
  // - Integrar com sistema de IA para sugestões de resposta
}

async function handleClaimNotification(resource: string, userId: number) {
  console.log(`Processando notificação de reclamação: ${resource} para usuário ${userId}`);
  
  // TODO: Implementar lógica específica
  // - Buscar dados da reclamação via API do ML
  // - Alertar vendedor sobre reclamação
  // - Integrar com sistema de reputação
}

async function handleMessageNotification(resource: string, userId: number) {
  console.log(`Processando notificação de mensagem: ${resource} para usuário ${userId}`);
  
  // TODO: Implementar lógica específica
  // - Buscar dados da mensagem via API do ML
  // - Notificar sobre nova mensagem
  // - Integrar com chat interno
}

async function handlePaymentNotification(resource: string, userId: number) {
  console.log(`Processando notificação de pagamento: ${resource} para usuário ${userId}`);
  
  // TODO: Implementar lógica específica
  // - Buscar dados do pagamento via API do ML
  // - Atualizar status financeiro
  // - Gerar relatórios de vendas
}

async function handleShipmentNotification(resource: string, userId: number) {
  console.log(`Processando notificação de envio: ${resource} para usuário ${userId}`);
  
  // TODO: Implementar lógica específica
  // - Buscar dados do envio via API do ML
  // - Atualizar status de entrega
  // - Notificar sobre mudanças no frete
}

// Endpoint GET para verificar se o webhook está funcionando
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhooks/mercado-livre',
    supported_topics: [
      'orders_v2',
      'items', 
      'questions',
      'claims',
      'messages',
      'payments',
      'shipments'
    ],
    timestamp: new Date().toISOString()
  });
}