# Configuração do Mercado Livre para Produção

## 📋 Visão Geral

Este documento explica como configurar a autenticação OAuth do Mercado Livre para funcionar com a URL de produção `https://melidash.vercel.app/`.

## 🔧 Configurações Necessárias

### 1. Painel do Mercado Livre Developers

Acesse o [Painel de Desenvolvedores do Mercado Livre](https://developers.mercadolibre.com.br/) e configure:

#### 1.1 Criar/Editar Aplicação
- **Nome da Aplicação**: MeliDash
- **Descrição**: Dashboard inteligente para gerenciamento de vendas no Mercado Livre
- **URL do Site**: `https://melidash.vercel.app`
- **URL de Callback**: `https://melidash.vercel.app/api/auth/mercado-livre/callback`

#### 1.2 Configurações de OAuth
- **Redirect URIs**: 
  - `https://melidash.vercel.app/api/auth/mercado-livre/callback`
  - `http://localhost:3000/api/auth/mercado-livre/callback` (para desenvolvimento)
- **Scopes necessários**:
  - `read` - Leitura de dados
  - `write` - Escrita de dados
  - `offline_access` - Acesso offline (refresh token)

#### 1.3 Configurações de Webhooks (Notificações)
- **URL de Notificação**: `https://melidash.vercel.app/api/webhooks/mercado-livre`
- **Tópicos de Notificação**:
  - `orders_v2` - Notificações de pedidos
  - `items` - Notificações de produtos
  - `questions` - Notificações de perguntas
  - `claims` - Notificações de reclamações
  - `messages` - Notificações de mensagens
  - `payments` - Notificações de pagamentos
  - `shipments` - Notificações de envios

### 2. Variáveis de Ambiente

Configure as seguintes variáveis no painel da Vercel:

```bash
# Mercado Livre API
NEXT_PUBLIC_ML_CLIENT_ID="seu-client-id-aqui"
ML_CLIENT_SECRET="seu-client-secret-aqui"
NEXT_PUBLIC_ML_REDIRECT_URI="https://melidash.vercel.app/api/auth/mercado-livre/callback"

# NextAuth
NEXTAUTH_URL="https://melidash.vercel.app"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# Vercel
VERCEL_URL="melidash.vercel.app"
```

### 3. Arquivo .env.local (Desenvolvimento)

Para desenvolvimento local, use o arquivo `.env.local` já configurado:

```bash
# Mercado Livre API - Configurado para produção
NEXT_PUBLIC_ML_CLIENT_ID="seu-client-id-aqui"
ML_CLIENT_SECRET="seu-client-secret-aqui"
NEXT_PUBLIC_ML_REDIRECT_URI="https://melidash.vercel.app/api/auth/mercado-livre/callback"

# NextAuth - Configurado para produção
NEXTAUTH_URL="https://melidash.vercel.app"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# Vercel - Configurado para produção
VERCEL_URL="melidash.vercel.app"
```

## 🔄 Fluxo de Autenticação

### 1. Processo de Login
1. Usuário clica em "Conectar com Mercado Livre" na página `/login`
2. Sistema redireciona para `https://auth.mercadolivre.com.br/authorization`
3. Usuário autoriza a aplicação no Mercado Livre
4. Mercado Livre redireciona para `https://melidash.vercel.app/api/auth/mercado-livre/callback`
5. API route processa o código de autorização e obtém tokens
6. Usuário é redirecionado para `/dashboard` com sucesso

## 📡 Sistema de Webhooks (Notificações)

### 1. Configuração de Webhooks
Os webhooks permitem que o Mercado Livre notifique a aplicação em tempo real sobre eventos importantes:

- **URL do Webhook**: `https://melidash.vercel.app/api/webhooks/mercado-livre`
- **Método**: POST
- **Content-Type**: application/json
- **User-Agent**: MercadoLibre (usado para validação)

### 2. Eventos Suportados

#### 📦 Orders (orders_v2)
- Novos pedidos
- Mudanças de status
- Cancelamentos
- Pagamentos confirmados

#### 🛍️ Items (items)
- Produtos pausados/ativados
- Mudanças de preço
- Alterações de estoque
- Atualizações de descrição

#### ❓ Questions (questions)
- Novas perguntas de compradores
- Respostas do vendedor

#### ⚠️ Claims (claims)
- Novas reclamações
- Mudanças de status
- Resoluções

#### 💬 Messages (messages)
- Novas mensagens do chat
- Mensagens do pós-venda

#### 💳 Payments (payments)
- Confirmações de pagamento
- Estornos
- Disputas

#### 🚚 Shipments (shipments)
- Atualizações de rastreamento
- Entregas confirmadas
- Problemas de envio

### 3. Estrutura da Notificação
```json
{
  "_id": "12345",
  "resource": "/orders/123456789",
  "user_id": 123456,
  "topic": "orders_v2",
  "application_id": 789012,
  "attempts": 1,
  "sent": "2025-01-01T10:00:00.000Z",
  "received": "2025-01-01T10:00:01.000Z"
}
```

### 4. Processamento de Notificações
A rota `/api/webhooks/mercado-livre` processa as notificações:

1. **Validação**: Verifica User-Agent e estrutura
2. **Logging**: Registra todas as notificações recebidas
3. **Processamento**: Chama handlers específicos por tópico
4. **Resposta**: Retorna status 200 para confirmar recebimento

> **⚠️ Importante**: O Mercado Livre reenvia notificações se não receber status 200 em até 22 segundos.

### 5. Rotas Implementadas

#### `/api/auth/mercado-livre/route.ts`
- **Método**: GET
- **Função**: Gera URL de autorização OAuth
- **Parâmetros**: `userId` (opcional)

#### `/api/auth/mercado-livre/callback/route.ts`
- **Método**: GET
- **Função**: Processa callback OAuth e troca código por tokens
- **Parâmetros**: `code`, `state`, `error`

#### `/api/webhooks/mercado-livre/route.ts`
- **Métodos**: POST, GET
- **Função**: Recebe e processa notificações do Mercado Livre
- **POST**: Processa webhooks em tempo real
- **GET**: Endpoint de verificação de status

#### `/auth/callback/page.tsx`
- **Função**: Página de callback alternativa (não utilizada no fluxo principal)
- **Uso**: Pode ser usada para debugging ou fluxos alternativos

## 🛠️ Implementação Técnica

### 1. Configuração da API

O arquivo `/src/lib/api/mercado-livre.ts` está configurado para:
- Usar variáveis de ambiente para Client ID e Secret
- Construir automaticamente a URL de callback baseada nas variáveis de ambiente
- Suportar tanto desenvolvimento quanto produção

### 2. Hook de Autenticação

O hook `/src/hooks/use-mercado-livre-auth.ts` fornece:
- Estado de autenticação reativo
- Funções de login/logout
- Renovação automática de tokens
- Verificação periódica de validade dos tokens

### 3. Armazenamento de Tokens

Atualmente os tokens são armazenados no `localStorage`:
- `ml_access_token` - Token de acesso
- `ml_refresh_token` - Token de renovação
- `ml_user_id` - ID do usuário no Mercado Livre

> **⚠️ Importante**: Em produção, considere usar cookies seguros ou armazenamento no servidor para maior segurança.

## 🔒 Segurança

### Recomendações:
1. **Nunca** commite credenciais no código
2. Use HTTPS em produção (já configurado)
3. Configure CSP (Content Security Policy) adequado
4. Implemente rate limiting nas rotas de API
5. Considere usar cookies httpOnly para tokens em produção

## 🧪 Testes

### Testar Localmente:
1. Configure as variáveis no `.env.local`
2. Execute `npm run dev`
3. Acesse `http://localhost:3000/login`
4. Teste o fluxo de autenticação

### Testar em Produção:
1. Configure as variáveis na Vercel
2. Faça deploy da aplicação
3. Acesse `https://melidash.vercel.app/login`
4. Teste o fluxo completo

## 📝 Próximos Passos

### Configuração Básica:
1. **Obter credenciais reais** do Mercado Livre
2. **Configurar no painel da Vercel** as variáveis de ambiente
3. **Configurar webhooks** no painel do Mercado Livre:
   - URL: `https://melidash.vercel.app/api/webhooks/mercado-livre`
   - Selecionar tópicos desejados
4. **Testar o fluxo completo** em produção

### Melhorias Técnicas:
5. **Implementar persistência** de tokens no banco de dados
6. **Adicionar tratamento de erros** mais robusto
7. **Implementar processamento** específico para cada tipo de webhook
8. **Adicionar sistema de filas** para processamento assíncrono
9. **Implementar retry logic** para falhas de processamento
10. **Adicionar monitoramento** e alertas para webhooks

## 🆘 Troubleshooting

### Problemas Comuns:

1. **Erro "redirect_uri_mismatch"**
   - Verifique se a URL de callback está correta no painel do ML
   - Confirme se `NEXT_PUBLIC_ML_REDIRECT_URI` está correto

2. **Erro "invalid_client"**
   - Verifique `NEXT_PUBLIC_ML_CLIENT_ID` e `ML_CLIENT_SECRET`
   - Confirme se as credenciais estão ativas no painel do ML

3. **Tokens expirados**
   - O sistema tenta renovar automaticamente
   - Se falhar, usuário precisa fazer login novamente

4. **CORS errors**
   - Verifique se o domínio está autorizado no painel do ML
   - Confirme configurações de CORS no Next.js

---

**Status**: ✅ Configuração básica implementada e pronta para produção
**Última atualização**: Janeiro 2025