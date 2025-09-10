# 🚀 Configuração do Supabase - Guia Completo

## ⚠️ Problema Identificado

A conexão automática via Prisma está falhando. Vamos resolver isso passo a passo.

## 📋 **PASSO 1: Executar Migração SQL Manualmente**

### 1.1 Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard/project/epyuqcfjedivkjgpsqql
- Clique em **SQL Editor** no menu lateral

### 1.2 Execute a Migração
- Clique em **New Query**
- Copie e cole o conteúdo completo do arquivo `supabase/migrations/001_initial_schema.sql`
- Clique em **Run** para executar

### 1.3 Verifique as Tabelas Criadas
Após executar, você deve ver estas tabelas:
- ✅ `users`
- ✅ `products` 
- ✅ `automation_rules`
- ✅ `dashboard_layouts`
- ✅ `reports`

## 🔧 **PASSO 2: Corrigir String de Conexão**

### 2.1 Obter a String Correta
- No Supabase Dashboard, vá em **Settings** → **Database**
- Na seção **Connection string**, copie a URL no formato:
  ```
  postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
  ```

### 2.2 Atualizar .env
Substitua no arquivo `.env`:
```env
# Database (SUBSTITUA PELA SUA STRING REAL)
DATABASE_URL="sua-string-de-conexao-aqui"
DIRECT_URL="sua-string-de-conexao-aqui"
```

## 🧪 **PASSO 3: Testar Conexão**

Após corrigir a string de conexão:
```bash
npx prisma db push
```

## 📝 **Informações do Seu Projeto**
- **Project ID**: `epyuqcfjedivkjgpsqql`
- **Project URL**: `https://epyuqcfjedivkjgpsqql.supabase.co`
- **Região**: Verificar no dashboard

## 🆘 **Troubleshooting**

### Erro "Can't reach database server"
1. Verifique se o projeto está ativo no Supabase
2. Confirme a string de conexão no dashboard
3. Teste a conexão direta via SQL Editor

### Erro "Tenant or user not found"
1. Verifique o formato da string de conexão
2. Confirme a senha no dashboard
3. Use a string exata fornecida pelo Supabase

## ✅ **Checklist de Verificação**

- [ ] Migração SQL executada no Supabase Dashboard
- [ ] Tabelas criadas com sucesso
- [ ] String de conexão atualizada no .env
- [ ] Comando `npx prisma db push` executado com sucesso
- [ ] Aplicação conectando ao banco

---

**💡 Dica**: Sempre use a string de conexão exata fornecida pelo Supabase Dashboard para evitar problemas de conectividade.