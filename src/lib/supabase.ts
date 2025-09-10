import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          ml_user_id: string | null;
          ml_access_token: string | null;
          ml_refresh_token: string | null;
          subscription: 'free' | 'pro' | 'enterprise';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          ml_user_id?: string | null;
          ml_access_token?: string | null;
          ml_refresh_token?: string | null;
          subscription?: 'free' | 'pro' | 'enterprise';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          ml_user_id?: string | null;
          ml_access_token?: string | null;
          ml_refresh_token?: string | null;
          subscription?: 'free' | 'pro' | 'enterprise';
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          ml_id: string;
          title: string;
          price: number;
          stock: number;
          status: 'active' | 'paused' | 'closed';
          category_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ml_id: string;
          title: string;
          price: number;
          stock: number;
          status?: 'active' | 'paused' | 'closed';
          category_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ml_id?: string;
          title?: string;
          price?: number;
          stock?: number;
          status?: 'active' | 'paused' | 'closed';
          category_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      automation_rules: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          is_active: boolean;
          conditions: any;
          actions: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          is_active?: boolean;
          conditions: any;
          actions: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          is_active?: boolean;
          conditions?: any;
          actions?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper functions
export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  
  return data;
};

export const createUser = async (userData: Database['public']['Tables']['users']['Insert']) => {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const updateUserTokens = async (userId: string, tokens: {
  ml_access_token: string;
  ml_refresh_token: string;
  ml_user_id: string;
}) => {
  const { data, error } = await supabase
    .from('users')
    .update({
      ml_access_token: tokens.ml_access_token,
      ml_refresh_token: tokens.ml_refresh_token,
      ml_user_id: tokens.ml_user_id,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
};