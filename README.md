# MeliDash - Dashboard Inteligente para Mercado Livre

## 📋 Sobre o Projeto

MeliDash é uma plataforma completa de gestão e automação para vendedores do Mercado Livre, oferecendo insights avançados, automação de preços, monitoramento de tendências e muito mais.

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no Mercado Livre Developers
- Conta na Vercel (para deploy)

### 1. Clone o repositório:
```bash
git clone <repository-url>
cd melidash
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Configure as variáveis de ambiente:

Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Preencha as variáveis no `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/melidash"
DIRECT_URL="postgresql://username:password@localhost:5432/melidash"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Mercado Livre API
ML_CLIENT_ID="your-mercado-livre-client-id"
ML_CLIENT_SECRET="your-mercado-livre-client-secret"
ML_REDIRECT_URI="https://your-vercel-domain.vercel.app/api/auth/mercado-livre/callback"

# NextAuth
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# OpenAI (para o assistente IA)
OPENAI_API_KEY="your-openai-api-key"

# Vercel (para deploy)
VERCEL_URL="your-vercel-domain.vercel.app"
```

### 4. Configure o banco de dados:

#### Opção A: Supabase (Recomendado)
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL em `supabase/migrations/001_initial_schema.sql` no SQL Editor
3. Configure as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Opção B: PostgreSQL Local
1. Instale PostgreSQL
2. Crie um banco de dados `melidash`
3. Execute: `npx prisma migrate dev`
4. Execute: `npx prisma generate`

### 5. Configure o Mercado Livre:

1. Acesse [Mercado Livre Developers](https://developers.mercadolivre.com.br/)
2. Crie uma aplicação
3. Configure a URL de callback: `https://your-vercel-domain.vercel.app/api/auth/mercado-livre/callback`
4. Anote o `Client ID` e `Client Secret`

### 6. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

### 7. Acesse a aplicação:
Abra [http://localhost:3001](http://localhost:3001) no seu navegador.

## 🌐 Deploy na Vercel

### 1. Conecte seu repositório:
1. Acesse [Vercel](https://vercel.com)
2. Importe seu repositório do GitHub
3. Configure as variáveis de ambiente no painel da Vercel

### 2. Variáveis de ambiente na Vercel:
Adicione todas as variáveis do `.env.local` no painel da Vercel:
- `DATABASE_URL`
- `DIRECT_URL` 
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ML_CLIENT_ID`
- `ML_CLIENT_SECRET`
- `ML_REDIRECT_URI`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `OPENAI_API_KEY`

### 3. Atualize as URLs:
Após o deploy, atualize:
- `ML_REDIRECT_URI` com sua URL da Vercel
- `NEXTAUTH_URL` com sua URL da Vercel
- URL de callback no Mercado Livre Developers

## 📱 Páginas Disponíveis

| Rota | Descrição | Status |
|------|-----------|--------|
| `/` | Landing page | ✅ |
| `/login` | Página de login | ✅ |
| `/dashboard` | Dashboard principal | ✅ |
| `/dashboard-builder` | Constructor de dashboard personalizado | ✅ |
| `/products` | Gestão de produtos | ✅ |
| `/pricing` | Automação de preços | ✅ |
| `/trends` | Radar de tendências | ✅ |
| `/reputation` | Gestão de reputação | ✅ |
| `/reports` | Relatórios executivos | ✅ |
| `/analytics` | Analytics e insights | ✅ |
| `/automation` | Automação de preços | ✅ |
| `/ai-assistant` | Assistente IA | ✅ |
| `/messages` | Central de mensagens | ✅ |
| `/alerts` | Sistema de alertas | ✅ |

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Database**: PostgreSQL, Supabase, Prisma ORM
- **Authentication**: Supabase Auth, NextAuth.js
- **APIs**: Mercado Livre API, OpenAI API
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Animações**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Deploy**: Vercel

## 📊 Funcionalidades Implementadas

### ✅ Fase 1 - Estrutura Base
- **Framework**: Next.js 15 com TypeScript
- **Estilização**: Tailwind CSS + Shadcn/ui
- **Autenticação**: Sistema com Supabase
- **Dashboard**: Métricas e página de produtos

### ✅ Fase 2 - Integração Mercado Livre
- **OAuth**: Integração completa com APIs do Mercado Livre
- **Produtos**: Listagem de produtos reais
- **Automação**: Sistema de automação de preços com regras

### ✅ Fase 3 - Inteligência de Mercado
- **Tendências**: Radar de tendências e monitoramento de concorrência
- **Reputação**: Gestão de reputação com simulador de termômetro

### ✅ Fase 4 - IA e Relatórios
- **Assistente IA**: Insights e otimização de anúncios
- **Relatórios**: Sistema de relatórios executivos com exportação

### ✅ Fase 5 - Personalização
- **Dashboard Builder**: Sistema drag-and-drop para personalização
- **Widgets**: Biblioteca completa de widgets personalizáveis
- **Banco de Dados**: PostgreSQL/Supabase configurado
- **Deploy**: Configuração para Vercel

### 🔄 Próximos Passos
- [ ] Implementar webhooks do Mercado Livre
- [ ] Sistema de notificações em tempo real
- [ ] Análise avançada com IA
- [ ] Mobile app (React Native)
- [ ] Integração com outros marketplaces

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linting

# Banco de dados
npx prisma migrate dev    # Executa migrações em desenvolvimento
npx prisma generate       # Gera cliente Prisma
npx prisma studio         # Interface visual do banco
npx prisma db push        # Sincroniza schema com banco
```

## 🐛 Troubleshooting

### Erro de conexão com banco:
- Verifique se as variáveis `DATABASE_URL` e `DIRECT_URL` estão corretas
- Execute `npx prisma generate` após mudanças no schema

### Erro na integração com Mercado Livre:
- Verifique se a URL de callback está correta no painel do ML
- Confirme se `ML_CLIENT_ID` e `ML_CLIENT_SECRET` estão corretos
- O Mercado Livre não aceita `localhost`, use ngrok ou deploy na Vercel

### Erro no deploy da Vercel:
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme se o build está passando localmente com `npm run build`

## 📝 Notas Importantes

- **Mercado Livre**: Não aceita URLs localhost. Use Vercel ou ngrok para testes
- **Supabase**: Configure Row Level Security (RLS) para segurança
- **Tokens**: Nunca commite tokens ou chaves no repositório
- **HTTPS**: Mercado Livre requer HTTPS para callbacks em produção

## 🎯 Funcionalidades Detalhadas

### Dashboard Principal
- Métricas em tempo real (receita, vendas, clientes, conversão)
- Gráficos interativos de performance
- Resumo de produtos e alertas
- Navegação intuitiva

### Construtor de Dashboard
- Interface drag-and-drop para personalização
- Biblioteca de widgets pré-configurados
- Layouts salvos e compartilháveis
- Modo de visualização e edição

### Gestão de Produtos
- Sincronização automática com Mercado Livre
- Edição em lote de preços e estoque
- Análise de performance por produto
- Alertas de estoque baixo

### Automação de Preços
- Regras baseadas em concorrência
- Ajustes automáticos por margem
- Histórico de mudanças de preço
- Simulador de impacto

### Radar de Tendências
- Monitoramento de palavras-chave
- Análise de sazonalidade
- Oportunidades de mercado
- Alertas de tendências

### Gestão de Reputação
- Termômetro de reputação
- Análise de reviews
- Sugestões de melhoria
- Comparativo com concorrentes

### Assistente IA
- Insights personalizados
- Sugestões de otimização
- Análise preditiva
- Relatórios automatizados

---

**MeliDash** - Transformando dados em resultados para vendedores do Mercado Livre 🚀
