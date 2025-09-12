import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente Supabase com privilégios administrativos para operações de backend
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const supabaseDbHelpers = {
  // Usuários
  async getUserByEmail(email: string) {
    console.log('🔍 Supabase: Looking for user by email...');
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Não encontrado - retorna null
          console.log('📊 Supabase: User not found');
          return null;
        }
        throw error;
      }

      console.log('✅ Supabase: User found');
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        password: data.password,
        mlUserId: data.ml_user_id,
        mlAccessToken: data.ml_access_token,
        mlRefreshToken: data.ml_refresh_token,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('❌ Supabase getUserByEmail error:', error);
      throw error;
    }
  },

  async createUser(userData: {
    email: string;
    name?: string;
    password?: string;
    mlUserId?: string;
    mlAccessToken?: string;
    mlRefreshToken?: string;
  }) {
    console.log('👤 Supabase: Creating user...');
    
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name || null,
          password: userData.password || null,
          ml_user_id: userData.mlUserId || null,
          ml_access_token: userData.mlAccessToken || null,
          ml_refresh_token: userData.mlRefreshToken || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ Supabase: User created successfully');
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        password: data.password,
        mlUserId: data.ml_user_id,
        mlAccessToken: data.ml_access_token,
        mlRefreshToken: data.ml_refresh_token,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('❌ Supabase createUser error:', error);
      throw error;
    }
  },

  async updateUserTokens(userId: string, tokens: {
    mlAccessToken: string;
    mlRefreshToken: string;
    mlUserId: string;
  }) {
    console.log('🔄 Supabase: Updating user tokens...');
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ml_access_token: tokens.mlAccessToken,
          ml_refresh_token: tokens.mlRefreshToken,
          ml_user_id: tokens.mlUserId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      console.log('✅ Supabase: User tokens updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Supabase updateUserTokens error:', error);
      throw error;
    }
  },
};