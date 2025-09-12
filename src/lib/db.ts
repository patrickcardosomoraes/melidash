import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Função para criar nova instância quando necessário
export function createFreshPrismaClient() {
  return new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

// Helper functions para operações comuns
export const dbHelpers = {
  // Usuários
  async getUserByEmail(email: string) {
    try {
      // Usando raw query para evitar prepared statement conflicts
      const users = await db.$queryRaw`
        SELECT id, email, name, password, ml_user_id, ml_access_token, ml_refresh_token, created_at, updated_at
        FROM users 
        WHERE email = ${email}
        LIMIT 1
      `;
      
      if (Array.isArray(users) && users.length > 0) {
        const user = users[0] as any;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          password: user.password,
          mlUserId: user.ml_user_id,
          mlAccessToken: user.ml_access_token,
          mlRefreshToken: user.ml_refresh_token,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        };
      }
      return null;
    } catch (error: any) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  async createUser(data: {
    email: string;
    name?: string;
    password?: string;
    mlUserId?: string;
    mlAccessToken?: string;
    mlRefreshToken?: string;
  }) {
    try {
      // Gerar ID usando crypto nativo
      const crypto = require('crypto');
      const id = crypto.randomUUID();
      const now = new Date();
      
      // Usando raw query para evitar prepared statement conflicts
      await db.$executeRaw`
        INSERT INTO users (id, email, name, password, ml_user_id, ml_access_token, ml_refresh_token, created_at, updated_at)
        VALUES (${id}, ${data.email}, ${data.name || null}, ${data.password || null}, ${data.mlUserId || null}, ${data.mlAccessToken || null}, ${data.mlRefreshToken || null}, ${now}, ${now})
      `;
      
      // Retornar o usuário criado
      return {
        id,
        email: data.email,
        name: data.name || null,
        password: data.password || null,
        mlUserId: data.mlUserId || null,
        mlAccessToken: data.mlAccessToken || null,
        mlRefreshToken: data.mlRefreshToken || null,
        createdAt: now,
        updatedAt: now,
      };
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw error;
    }
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
    conditions: Record<string, unknown>;
    actions: Record<string, unknown>;
    priority?: number;
  }) {
    return await db.automationRule.create({
      data: {
        ...data,
        conditions: JSON.stringify(data.conditions),
        actions: JSON.stringify(data.actions),
      },
    });
  },

  async updateAutomationRule(id: string, data: Partial<{
    name: string;
    description: string;
    isActive: boolean;
    conditions: Record<string, unknown>;
    actions: Record<string, unknown>;
    priority: number;
  }>) {
    const { conditions, actions, ...otherData } = data;
    const updateData = {
      ...otherData,
      ...(conditions && { conditions: JSON.stringify(conditions) }),
      ...(actions && { actions: JSON.stringify(actions) }),
    };
    return await db.automationRule.update({
      where: { id },
      data: updateData,
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
    position: Record<string, unknown>;
    config: Record<string, unknown>;
  }) {
    // First try to find existing layout
    const existing = await db.dashboardLayout.findFirst({
      where: {
        userId: data.userId,
        widgetId: data.widgetId,
      },
    });

    if (existing) {
      return await db.dashboardLayout.update({
        where: { id: existing.id },
        data: {
          type: data.type,
          title: data.title,
          position: JSON.stringify(data.position),
          config: JSON.stringify(data.config),
        },
      });
    } else {
      return await db.dashboardLayout.create({
        data: {
          ...data,
          position: JSON.stringify(data.position),
          config: JSON.stringify(data.config),
        },
      });
    }
  },

  // Relatórios
  async createReport(data: {
    userId: string;
    name: string;
    type: 'SALES' | 'PRODUCTS' | 'PERFORMANCE' | 'TRENDS' | 'AUTOMATION';
    filters: Record<string, unknown>;
    data: Record<string, unknown>;
  }) {
    return await db.report.create({
      data: {
        userId: data.userId,
        name: data.name,
        type: data.type,
        filters: JSON.stringify(data.filters),
        data: JSON.stringify(data.data),
      },
    });
  },

  async getUserReports(userId: string, type?: 'SALES' | 'PRODUCTS' | 'PERFORMANCE' | 'TRENDS' | 'AUTOMATION') {
    return await db.report.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};