# 🚀 Guia de Deploy - MeliDash

## 📋 Pré-requisitos

- [ ] Conta no [Supabase](https://supabase.com)
- [ ] Conta no [Mercado Livre Developers](https://developers.mercadolivre.com.br/)
- [ ] Conta na [Vercel](https://vercel.com)
- [ ] Repositório no GitHub

## 🗄️ 1. Configuração do Supabase

### 1.1 Criar Projeto
1. Acesse [Supabase](https://supabase.com) e faça login
2. Clique em "New Project"
3. Escolha sua organização
4. Defina:
   - **Name**: `melidash`
   - **Database Password**: (anote esta senha)
   - **Region**: South America (São Paulo)
5. Clique em "Create new project"

### 1.2 Executar Migração
1. Aguarde o projeto ser criado (2-3 minutos)
2. Vá para "SQL Editor" no painel lateral
3. Clique em "New query"
4. Copie e cole o conteúdo do arquivo `supabase/migrations/001_initial_schema.sql`
5. Clique em "Run" para executar

### 1.3 Obter Credenciais
1. Vá para "Settings" > "API"
2. Anote:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: `eyJ...` (chave pública)
   - **service_role**: `eyJ...` (chave privada - mantenha segura)

## 🛒 2. Configuração do Mercado Livre

### 2.1 Criar Aplicação
1. Acesse [Mercado Livre Developers](https://developers.mercadolivre.com.br/)
2. Faça login com sua conta do Mercado Livre
3. Vá para "Minhas aplicações" > "Criar nova aplicação"
4. Preencha:
   - **Nome**: `MeliDash`
   - **Descrição**: `Dashboard inteligente para vendedores`
   - **URL da aplicação**: `https://your-app.vercel.app`
   - **Domínios autorizados**: `your-app.vercel.app`
   - **URL de callback**: `https://your-app.vercel.app/api/auth/mercado-livre/callback`
5. Selecione os scopes:
   - `read` - Leitura de informações
   - `write` - Escrita de informações
   - `offline_access` - Acesso offline

### 2.2 Obter Credenciais
1. Após criar a aplicação, anote:
   - **Client ID**: `123456789`
   - **Client Secret**: `abc123def456` (mantenha seguro)

## ☁️ 3. Deploy na Vercel

### 3.1 Conectar Repositório
1. Acesse [Vercel](https://vercel.com) e faça login
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Configure:
   - **Project Name**: `melidash`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`

### 3.2 Configurar Variáveis de Ambiente
Na seção "Environment Variables", adicione:

```env
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUPABASE-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[SUPABASE-SERVICE-ROLE-KEY]

# Mercado Livre API
ML_CLIENT_ID=[ML-CLIENT-ID]
ML_CLIENT_SECRET=[ML-CLIENT-SECRET]
ML_REDIRECT_URI=https://[YOUR-VERCEL-DOMAIN].vercel.app/api/auth/mercado-livre/callback

# NextAuth
NEXTAUTH_URL=https://[YOUR-VERCEL-DOMAIN].vercel.app
NEXTAUTH_SECRET=[GENERATE-RANDOM-STRING]

# OpenAI (opcional)
OPENAI_API_KEY=[YOUR-OPENAI-KEY]

# Vercel
VERCEL_URL=[YOUR-VERCEL-DOMAIN].vercel.app
```

### 3.3 Deploy
1. Clique em "Deploy"
2. Aguarde o build completar (3-5 minutos)
3. Anote sua URL da Vercel: `https://your-app-name.vercel.app`

## 🔧 4. Configurações Pós-Deploy

### 4.1 Atualizar URLs no Mercado Livre
1. Volte ao [Mercado Livre Developers](https://developers.mercadolivre.com.br/)
2. Edite sua aplicação
3. Atualize:
   - **URL da aplicação**: `https://your-app-name.vercel.app`
   - **Domínios autorizados**: `your-app-name.vercel.app`
   - **URL de callback**: `https://your-app-name.vercel.app/api/auth/mercado-livre/callback`

### 4.2 Atualizar Variáveis na Vercel
1. No painel da Vercel, vá para "Settings" > "Environment Variables"
2. Atualize:
   - `ML_REDIRECT_URI`: `https://your-app-name.vercel.app/api/auth/mercado-livre/callback`
   - `NEXTAUTH_URL`: `https://your-app-name.vercel.app`
   - `VERCEL_URL`: `your-app-name.vercel.app`
3. Clique em "Redeploy" para aplicar as mudanças

## ✅ 5. Verificação

### 5.1 Testar Aplicação
1. Acesse `https://your-app-name.vercel.app`
2. Verifique se a página inicial carrega
3. Teste o login (se implementado)
4. Acesse `/dashboard` para ver o painel

### 5.2 Testar Integração ML
1. Vá para a página de configurações
2. Clique em "Conectar Mercado Livre"
3. Deve redirecionar para autorização do ML
4. Após autorizar, deve retornar para o dashboard

## 🐛 Troubleshooting

### Erro de Build
```bash
# Teste localmente primeiro
npm run build
```

### Erro de Banco de Dados
- Verifique se o schema foi executado no Supabase
- Confirme as URLs de conexão
- Teste a conexão no Supabase SQL Editor

### Erro do Mercado Livre
- Verifique se as URLs de callback estão corretas
- Confirme se os domínios estão autorizados
- Teste em modo de desenvolvimento primeiro

### Erro de Variáveis de Ambiente
- Confirme se todas as variáveis estão definidas na Vercel
- Verifique se não há espaços extras
- Redeploy após mudanças

## 📊 Monitoramento

### Logs da Vercel
1. Vá para "Functions" no painel da Vercel
2. Clique em qualquer função para ver logs
3. Use para debugar erros de API

### Analytics do Supabase
1. Vá para "Analytics" no painel do Supabase
2. Monitore uso do banco de dados
3. Verifique logs de autenticação

## 🔒 Segurança

### Variáveis Sensíveis
- ✅ Nunca commite `.env.local`
- ✅ Use variáveis de ambiente na Vercel
- ✅ Mantenha `CLIENT_SECRET` e `SERVICE_ROLE_KEY` seguros

### HTTPS
- ✅ Vercel fornece HTTPS automaticamente
- ✅ Mercado Livre requer HTTPS para callbacks
- ✅ Configure CSP headers se necessário

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs da Vercel
2. Teste localmente primeiro
3. Confirme todas as configurações
4. Consulte a documentação oficial:
   - [Next.js](https://nextjs.org/docs)
   - [Supabase](https://supabase.com/docs)
   - [Mercado Livre API](https://developers.mercadolivre.com.br/pt_br/api-docs-pt-br)
   - [Vercel](https://vercel.com/docs)

**MeliDash** está pronto para produção! 🚀