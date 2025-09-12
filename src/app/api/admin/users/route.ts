import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement proper authentication check for admin role
    // For now, we'll simulate admin check
    const adminUserId = 'admin-user-id'; // This should come from auth
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Build query - get users first
    let supabaseQuery = supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        role,
        created_at,
        updated_at,
        invited_by,
        invite_accepted_at
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (role) {
      supabaseQuery = supabaseQuery.eq('role', role);
    }
    
    const { data: result, error, count } = await supabaseQuery;
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Erro ao buscar usuários');
    }
    
    // Get inviter names for users that have invited_by
    const users = result || [];
    const inviterIds = users.filter(u => u.invited_by).map(u => u.invited_by);
    
    let inviters: any[] = [];
    if (inviterIds.length > 0) {
      const { data: inviterData } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', inviterIds);
      inviters = inviterData || [];
    }
    
    // Transform data to match expected format
    const usersWithInviters = users.map(user => {
      const inviter = inviters.find(inv => inv.id === user.invited_by);
      return {
        ...user,
        invited_by_name: inviter?.name || null,
        invited_by_email: inviter?.email || null
      };
    });
    
    const total = count || 0;

    return NextResponse.json({
      success: true,
      users: usersWithInviters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}