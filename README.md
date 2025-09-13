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
# Use NEXT_PUBLIC_* no frontend; ML_* é aceito como fallback no servidor
NEXT_PUBLIC_ML_CLIENT_ID="your-mercado-livre-client-id"
ML_CLIENT_ID="your-mercado-livre-client-id"
ML_CLIENT_SECRET="your-mercado-livre-client-secret"
NEXT_PUBLIC_ML_REDIRECT_URI="https://melidash.vercel.app/api/auth/mercado-livre/callback"
ML_REDIRECT_URI="https://melidash.vercel.app/api/auth/mercado-livre/callback"

# NextAuth
NEXTAUTH_URL="https://melidash.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# OpenAI (para o assistente IA)
OPENAI_API_KEY="your-openai-api-key"

# Vercel (para deploy)
VERCEL_URL="melidash.vercel.app"
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
3. Configure a URL de callback: `https://melidash.vercel.app/api/auth/mercado-livre/callback`
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
- `NEXT_PUBLIC_ML_CLIENT_ID` (e/ou `ML_CLIENT_ID`)
- `ML_CLIENT_SECRET`
- `NEXT_PUBLIC_ML_REDIRECT_URI` (e/ou `ML_REDIRECT_URI`)
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
| `/register` | Registro com sistema de convites | ✅ |
| `/admin/invites` | Gestão de convites (admin) | ✅ |
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

## 🔐 Sistema de Convites

O MeliDash implementa um sistema de registro baseado em convites para controle de acesso:

### Funcionalidades
- **Registro Controlado**: Apenas usuários com convites válidos podem se registrar
- **Gestão de Convites**: Admins podem criar, visualizar e gerenciar convites
- **Expiração Automática**: Convites têm prazo de validade configurável
- **Roles de Usuário**: Sistema de permissões com roles ADMIN e USER

### Como Funciona

#### 1. Criação de Convites (Admin)
- Acesse `/admin/invites` (apenas admins)
- Preencha o email do convidado
- O sistema gera um token único e link de convite
- Convite expira em 7 dias por padrão

#### 2. Aceitação de Convites
- Usuário acessa o link: `/register?token=TOKEN_DO_CONVITE`
- Sistema valida o token e email
- Usuário preenche dados (nome, senha)
- Conta é criada automaticamente

#### 3. Estrutura do Banco
```sql
-- Tabela de convites
CREATE TABLE invitations (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    invited_by UUID REFERENCES users(id),
    status invite_status DEFAULT 'PENDING',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum de status
CREATE TYPE invite_status AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- Enum de roles
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER');
```

### Endpoints da API

#### Gerenciamento de Convites
```typescript
// GET /api/admin/invites - Listar convites
// POST /api/admin/invites - Criar convite
// PUT /api/admin/invites - Atualizar status

// Exemplo de criação
POST /api/admin/invites
{
  "email": "usuario@exemplo.com"
}
```

#### Registro com Convite
```typescript
// GET /api/auth/register?token=TOKEN - Verificar convite
// POST /api/auth/register - Registrar usuário

// Exemplo de registro
POST /api/auth/register
{
  "email": "usuario@exemplo.com",
  "name": "Nome do Usuário",
  "password": "senha123",
  "token": "TOKEN_DO_CONVITE"
}
```

### Configuração Inicial

#### 1. Execute as Migrações
```bash
# Execute a migração do sistema de convites
psql -d melidash -f supabase/migrations/002_invite_system.sql
```

#### 2. Usuário Admin Inicial
O sistema cria automaticamente um usuário admin:
- **Email**: admin@melidash.com
- **Senha**: admin123 (altere imediatamente)
- **Role**: ADMIN

#### 3. Primeiro Acesso
1. Faça login com as credenciais admin
2. Acesse `/admin/invites`
3. Crie convites para outros usuários
4. Altere a senha do admin

### Segurança

- **Tokens Únicos**: Cada convite tem token criptograficamente seguro
- **Expiração**: Convites expiram automaticamente
- **Validação**: Email deve corresponder ao convite
- **Limpeza**: Sistema remove convites expirados automaticamente
- **Permissões**: Apenas admins podem gerenciar convites

### Páginas do Sistema

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/register` | Registro público (requer token) | Público |
| `/register?token=X` | Registro com convite | Token válido |
| `/admin/invites` | Gestão de convites | Admin apenas |
| `/login` | Login do sistema | Público |

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

# Migrações Supabase
psql -d melidash -f supabase/migrations/001_initial_schema.sql
psql -d melidash -f supabase/migrations/002_invite_system.sql
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
