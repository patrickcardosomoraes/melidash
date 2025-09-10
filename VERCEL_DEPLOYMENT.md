# 🚀 Guia de Deploy na Vercel - MeliDash

## 📋 Variáveis de Ambiente Obrigatórias

### 🔐 Autenticação Mercado Livre
```bash
# Credenciais da aplicação no Mercado Livre
ML_CLIENT_ID=seu_client_id_aqui
ML_CLIENT_SECRET=seu_client_secret_aqui
ML_REDIRECT_URI=https://seu-app.vercel.app/api/auth/mercado-livre/callback
```

### 🗄️ Banco de Dados (Supabase)
```bash
# URLs do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# URLs de conexão direta com o banco
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

### 🔑 NextAuth.js
```bash
# Configurações de autenticação
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=sua_secret_key_super_segura_aqui
```

### 🤖 OpenAI (Opcional)
```bash
# Para funcionalidades de IA
OPENAI_API_KEY=sk-sua_openai_key_aqui
```

### 🌍 Configurações de Ambiente
```bash
# Definir ambiente como produção
NODE_ENV=production
```

## 🛡️ Configurações de Segurança

### 1. Headers de Segurança
O arquivo `next.config.ts` já inclui headers de segurança:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### 2. Validações Implementadas
- ✅ Validação de User-Agent nos webhooks
- ✅ Verificação de tokens de acesso
- ✅ Sanitização de dados de entrada
- ✅ Rate limiting implícito via Vercel

### 3. Dados Sensíveis
- ✅ Tokens armazenados de forma segura
- ✅ Secrets não expostos no frontend
- ✅ Logs de produção sem informações sensíveis

## 📝 Passos para Deploy

### 1. Preparar o Repositório
```bash
# Fazer commit das alterações
git add .
git commit -m "feat: Preparar aplicação para produção"
git push origin main
```

### 2. Configurar na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Importe seu repositório do GitHub
3. Configure as variáveis de ambiente listadas acima
4. Deploy automático será iniciado

### 3. Configurar no Mercado Livre
1. Acesse [Mercado Livre Developers](https://developers.mercadolivre.com.br)
2. Vá em **Suas aplicações** → **Sua aplicação**
3. Atualize as URLs:
   - **URL de Callback**: `https://seu-app.vercel.app/api/auth/mercado-livre/callback`
   - **URL de Notificação**: `https://seu-app.vercel.app/api/webhooks/mercado-livre`
4. Configure os tópicos de notificação desejados

### 4. Testar em Produção
- ✅ Login com Mercado Livre
- ✅ Carregamento de produtos reais
- ✅ Recebimento de webhooks
- ✅ Funcionalidades do dashboard

## 🔍 Monitoramento

### Logs da Vercel
- Acesse o painel da Vercel para ver logs em tempo real
- Configure alertas para erros críticos

### Métricas Importantes
- Tempo de resposta das APIs
- Taxa de erro nas requisições
- Uso de recursos (memória, CPU)

## 🚨 Troubleshooting

### Erro de Autenticação
- Verificar se `ML_CLIENT_ID` e `ML_CLIENT_SECRET` estão corretos
- Confirmar se `ML_REDIRECT_URI` está configurado corretamente

### Erro de Banco de Dados
- Verificar conexão com Supabase
- Confirmar se as migrações foram executadas

### Webhooks não Funcionam
- Verificar se a URL está acessível publicamente
- Confirmar configuração no painel do Mercado Livre

## 📞 Suporte

Em caso de problemas:
1. Verificar logs na Vercel
2. Consultar documentação do Mercado Livre
3. Verificar status do Supabase

---

**⚠️ IMPORTANTE**: Nunca commite secrets ou chaves de API no repositório. Use sempre as variáveis de ambiente da Vercel.