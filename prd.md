# PRD (Product Requirements Document) — Plataforma SaaS "MeliDash"  

## Visão Geral
**Propósito:**  
Criar o SaaS de gestão, automação e inteligência para sellers Mercado Livre, superando Nubimetrics em automação, UX, poder analítico, integração nativa com APIs ML e IA generativa.

**Versão:** 2.0  
**Data:** Janeiro 2025  
**Status:** Em Desenvolvimento

## Resumo Executivo
MeliDash é uma plataforma SaaS completa que revoluciona a gestão de sellers no Mercado Livre através de automação inteligente, análise preditiva e execução de ações em tempo real. A plataforma combina dashboards personalizáveis, IA generativa e integração nativa com APIs do ML para oferecer uma experiência superior aos concorrentes existentes.

***

#### **1. Público-alvo**
- Sellers de pequeno a grande porte (incluindo gestores)
- Operadores de e-commerce e times de marketplace
- Gestores que atuam em múltiplas plataformas (opcional)

***

#### **2. Problema a resolver**
- Sellers têm dificuldade em acompanhar concorrência, tendências e saúde operacional em tempo real
- Nubimetrics dá visibilidade, mas não oferece automação direta de ações e insights realmente práticos para aumento de vendas, proteção de reputação e reatividade frente ao mercado

***

#### **3. Solução proposta**
Uma plataforma que **analisa, recomenda e executa ações** no Mercado Livre:
- Dashboard consolidado, customizável e “accionável”
- Automação (de ajustes de preço, anúncios, estoques) via API
- Alertas e insights prescritivos baseados em IA e tendências reais
- Gestão reputacional e de reclamações operacionalizada
- Painéis e relatórios executivos auto-gerados
- Modo multi-usuário (gestor/operador)

***

#### **4. Funcionalidades-clé**

##### **Dashboard Personalizável**
- Cards customizáveis (vendas, reputação, estoque, tendências, advertências)
- Modos para gestor (visão macro) vs operador (ação)

##### **Radar de Tendências e Concorrência**
- Monitoramento de keywords (trends API) e categorias promissoras
- Comparador de concorrentes/anúncios automaticamente sugeridos
- Alertas dinâmicos de movimentações de preço e ranqueamento

##### **Automação de Preço e Estoque**
- Motor de regras para atualização automática de preços (API ML)
- Sugestão de faixa ótima (com IA e simulações)
- Publicação, pausa e retirada automática seguindo critérios do usuário

##### **Gestão Profunda de Reputação e Reclamação**
- Simulador do termômetro e de impactos de reclamações (API)
- Alerts de incidentes críticos (prazo, atraso, volume de claims)
- IA para resposta automática e workflows de resolução

##### **Otimização de Anúncios (IA)**
- Diagnóstico de títulos, descrições, atributos e imagens
- Recomendações práticas (templates IA) para melhoria de SEO/engajamento
- Detecção automática de anúncios “mornos” (pouca performance)

##### **Painéis Executivos, Relatórios & Exportação**
- Gerador de relatórios semanais/mensais (PDF, Excel, PPT)
- Exportação de grupos/análises para ERP e reuniões
- Ações sugeridas na própria exportação

##### **Multi-marketplaces (opcional para roadmap)**
- Consolidação de vendas de outros canais (Shopee, Magalu, Amazon etc.)

##### **User Experience/IA Generativa**
- Perguntas/respostas para insights (“Por que está caindo?”, “O que priorizar?”)
- Notificações e onboarding inteligente
- API + integrações nativas

***

#### **5. Diferenciais**
- **Executa fluxos pela API ML, não só exibe**
- **Recomenda – e executa – ação** (one click para repricing, pausar anúncio, responder reclamação)
- **Customização do dashboard** e UX moderna (dark mode, widgets, drag&drop, vibe coding)
- **Assistente IA generativo** embutido para dúvidas do seller
- **Simulação de impacto (what if)** antes de executar ações em lote

***

#### **6. Métricas de Sucesso**
- Engajamento diário e recorrente dos sellers
- Taxa de automações configuradas e utilizadas (vs. recomendação)
- Diminuição de tempo de reação a mudanças de mercado/reputação
- Satisfação do usuário (NPS)

***

#### **7. Roadmap inicial**
- MVP com dashboard customizável, automação de preço, radar de tendências, alertas e simulação reputacional
- Segunda entrega: IA para conteúdo dos anúncios, multi-marketplace, modo gestão/operacional

***

#### **8. Arquitetura Técnica**

##### **Frontend**
- **Framework:** Next.js 14+ com App Router
- **Linguagem:** TypeScript
- **UI Library:** Shadcn/ui + Tailwind CSS
- **Estado:** Zustand + React Query (TanStack Query)
- **Gráficos:** Recharts + D3.js
- **Drag & Drop:** @dnd-kit
- **Formulários:** React Hook Form + Zod

##### **Backend**
- **Runtime:** Node.js 20+
- **Framework:** Next.js API Routes + tRPC
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Cache:** Redis (Upstash)
- **Queue:** BullMQ
- **Storage:** Supabase Storage

##### **Integrações**
- **Mercado Livre API:** Integração completa com OAuth 2.0
- **IA:** OpenAI GPT-4 + Anthropic Claude
- **Automação:** n8n workflows
- **Notificações:** Resend + WebSockets
- **Analytics:** Posthog

##### **Infraestrutura**
- **Deploy:** Vercel (Frontend + API)
- **Database:** Supabase (PostgreSQL + Auth)
- **Monitoring:** Sentry + Vercel Analytics
- **CDN:** Vercel Edge Network

***

#### **9. Casos de Uso Detalhados**

##### **UC001: Automação de Preços Inteligente**
**Ator:** Seller/Operador  
**Descrição:** Sistema monitora concorrência e ajusta preços automaticamente  
**Fluxo:**
1. Usuário configura regras de precificação
2. Sistema monitora preços da concorrência via API ML
3. IA analisa tendências e sazonalidade
4. Sistema sugere ajustes de preço
5. Execução automática ou manual via API ML

##### **UC002: Gestão Proativa de Reputação**
**Ator:** Seller/Gestor  
**Descrição:** Monitoramento e resposta automática a reclamações  
**Fluxo:**
1. Sistema detecta nova reclamação via webhook ML
2. IA classifica severidade e tipo
3. Gera resposta automática personalizada
4. Envia alerta para equipe se crítico
5. Acompanha resolução e impacto no termômetro

##### **UC003: Otimização de Anúncios com IA**
**Ator:** Seller/Operador  
**Descrição:** Análise e melhoria automática de anúncios  
**Fluxo:**
1. Sistema analisa performance dos anúncios
2. IA identifica oportunidades de melhoria
3. Gera sugestões de título, descrição e atributos
4. Usuário aprova mudanças
5. Sistema atualiza anúncios via API ML

***

#### **10. Especificações Técnicas**

##### **Requisitos de Performance**
- Tempo de carregamento inicial: < 2s
- Atualização de dados em tempo real: < 500ms
- Suporte a 10.000+ produtos por seller
- Disponibilidade: 99.9%

##### **Segurança**
- Autenticação OAuth 2.0 com Mercado Livre
- Criptografia end-to-end para dados sensíveis
- Rate limiting e proteção DDoS
- Auditoria completa de ações
- Compliance LGPD

##### **Escalabilidade**
- Arquitetura serverless auto-escalável
- Cache distribuído com Redis
- CDN global para assets estáticos
- Database sharding por seller

***

#### **11. Modelo de Dados**

##### **Entidades Principais**
```typescript
// User (Seller)
interface User {
  id: string
  email: string
  mlUserId: string
  role: 'admin' | 'operator'
  subscription: 'free' | 'pro' | 'enterprise'
  settings: UserSettings
}

// Product
interface Product {
  id: string
  mlId: string
  title: string
  price: number
  stock: number
  status: 'active' | 'paused' | 'closed'
  automationRules: AutomationRule[]
}

// Automation Rule
interface AutomationRule {
  id: string
  type: 'price' | 'stock' | 'status'
  conditions: Condition[]
  actions: Action[]
  isActive: boolean
}
```

***

#### **12. APIs e Integrações**

##### **Mercado Livre APIs Utilizadas**
- **Items API:** Gestão de produtos e anúncios
- **Orders API:** Monitoramento de vendas
- **Questions API:** Gestão de perguntas
- **Feedback API:** Monitoramento de reputação
- **Categories API:** Análise de tendências
- **Users API:** Dados do seller
- **Notifications API:** Webhooks em tempo real

##### **Endpoints Internos**
```typescript
// tRPC Routes
router {
  dashboard: {
    getMetrics: procedure,
    getCharts: procedure,
    updateLayout: procedure
  },
  products: {
    list: procedure,
    update: procedure,
    bulkUpdate: procedure,
    getAnalytics: procedure
  },
  automation: {
    createRule: procedure,
    executeRule: procedure,
    getHistory: procedure
  },
  ai: {
    generateContent: procedure,
    analyzeProduct: procedure,
    getInsights: procedure
  }
}
```

***

#### **13. Plano de Implementação**

##### **Fase 1: MVP (8 semanas)**
- Setup do projeto e arquitetura base
- Autenticação com Mercado Livre
- Dashboard básico com métricas essenciais
- Integração básica com APIs ML
- Automação simples de preços

##### **Fase 2: Core Features (12 semanas)**
- Dashboard personalizável com drag & drop
- Sistema completo de automação
- Gestão de reputação
- Radar de tendências
- Alertas e notificações

##### **Fase 3: IA e Analytics (8 semanas)**
- Assistente IA generativo
- Otimização automática de anúncios
- Relatórios executivos
- Analytics avançados
- Simulações "what-if"

##### **Fase 4: Scale & Polish (6 semanas)**
- Otimizações de performance
- Multi-marketplace (roadmap)
- Testes de carga
- Documentação completa
- Launch preparation

***

#### **14. Métricas e KPIs**

##### **Métricas de Produto**
- Daily Active Users (DAU)
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn Rate
- Net Promoter Score (NPS)

##### **Métricas de Performance**
- Tempo médio de resposta da API
- Uptime da plataforma
- Taxa de sucesso das automações
- Precisão das previsões de IA
- Tempo de resolução de reclamações

***

#### **15. Recursos e Links**

##### **Documentação Técnica**
- [Mercado Livre API Docs](https://developers.mercadolivre.com.br/pt_br/api-docs-pt-br)
- [Mercado Livre OAuth Guide](https://developers.mercadolivre.com.br/pt_br/authentication-and-authorization)
- [ML Notifications API](https://developers.mercadolivre.com.br/pt_br/notifications)

##### **Ferramentas de Desenvolvimento**
- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [tRPC Documentation](https://trpc.io/docs)

***

*Documento atualizado em Janeiro 2025 - Versão 2.0*
