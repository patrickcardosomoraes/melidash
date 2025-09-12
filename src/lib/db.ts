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
        const user = users[0] as {
          id: string;
          email: string;
          name: string | null;
          password: string | null;
          ml_user_id: string | null;
          ml_access_token: string | null;
          ml_refresh_token: string | null;
          created_at: Date;
          updated_at: Date;
        };
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
    } catch (error: unknown) {
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
      const crypto = await import('crypto');
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
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUserTokens(userId: string, tokens: {
    mlAccessToken: string;
    mlRefreshToken: string;
    mlUserId: string;
  }) {
    try {
      await db.$executeRaw`
        UPDATE users 
        SET ml_access_token = ${tokens.mlAccessToken}, 
            ml_refresh_token = ${tokens.mlRefreshToken}, 
            ml_user_id = ${tokens.mlUserId}, 
            updated_at = ${new Date()}
        WHERE id = ${userId}
      `;
      return { success: true };
    } catch (error: unknown) {
      console.error('Error updating user tokens:', error);
      throw error;
    }
  },
};