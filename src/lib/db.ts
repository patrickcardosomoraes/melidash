import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Helper functions para operações comuns
export const dbHelpers = {
  // Usuários
  async getUserByEmail(email: string) {
    return await db.user.findUnique({
      where: { email },
      include: {
        products: true,
        automationRules: true,
      },
    });
  },

  async createUser(data: {
    email: string;
    mlUserId?: string;
    mlAccessToken?: string;
    mlRefreshToken?: string;
  }) {
    return await db.user.create({
      data,
    });
  },

  async updateUserTokens(userId: string, tokens: {
    mlAccessToken: string;
    mlRefreshToken: string;
    mlUserId: string;
  }) {
    return await db.user.update({
      where: { id: userId },
      data: {
        mlAccessToken: tokens.mlAccessToken,
        mlRefreshToken: tokens.mlRefreshToken,
        mlUserId: tokens.mlUserId,
      },
    });
  },

  // Produtos
  async getUserProducts(userId: string) {
    return await db.product.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async createProduct(data: {
    userId: string;
    mlId: string;
    title: string;
    price: number;
    stock: number;
    categoryId: string;
  }) {
    return await db.product.create({
      data,
    });
  },

  async updateProduct(id: string, data: Partial<{
    title: string;
    price: number;
    stock: number;
    status: 'ACTIVE' | 'PAUSED' | 'CLOSED';
  }>) {
    return await db.product.update({
      where: { id },
      data,
    });
  },

  // Regras de automação
  async getUserAutomationRules(userId: string) {
    return await db.automationRule.findMany({
      where: { userId },
      orderBy: { priority: 'desc' },
    });
  },

  async createAutomationRule(data: {
    userId: string;
    name: string;
    description: string;
    conditions: any;
    actions: any;
    priority?: number;
  }) {
    return await db.automationRule.create({
      data,
    });
  },

  async updateAutomationRule(id: string, data: Partial<{
    name: string;
    description: string;
    isActive: boolean;
    conditions: any;
    actions: any;
    priority: number;
  }>) {
    return await db.automationRule.update({
      where: { id },
      data,
    });
  },

  // Dashboard layouts
  async getUserDashboardLayouts(userId: string) {
    return await db.dashboardLayout.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  },

  async saveDashboardLayout(data: {
    userId: string;
    widgetId: string;
    type: string;
    title: string;
    position: any;
    config: any;
  }) {
    return await db.dashboardLayout.upsert({
      where: {
        userId_widgetId: {
          userId: data.userId,
          widgetId: data.widgetId,
        },
      },
      update: {
        position: data.position,
        config: data.config,
        title: data.title,
      },
      create: data,
    });
  },

  // Relatórios
  async createReport(data: {
    userId: string;
    name: string;
    type: 'SALES' | 'PRODUCTS' | 'PERFORMANCE' | 'TRENDS' | 'AUTOMATION';
    filters: any;
    data: any;
  }) {
    return await db.report.create({
      data,
    });
  },

  async getUserReports(userId: string, type?: string) {
    return await db.report.findMany({
      where: {
        userId,
        ...(type && { type: type as any }),
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};