import { NextRequest, NextResponse } from 'next/server';
import { supabaseDbHelpers } from '@/lib/supabase-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Debug: Checking user with email: ${email}`);
    
    // Buscar usuário no banco de dados
    const user = await supabaseDbHelpers.getUserByEmail(email);
    
    if (user) {
      console.log('✅ Debug: User found');
      return NextResponse.json({
        found: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          hasPassword: !!user.password,
          hasMlTokens: !!(user.mlAccessToken && user.mlRefreshToken),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } else {
      console.log('❌ Debug: User not found');
      return NextResponse.json({
        found: false,
        message: 'User not found in database'
      });
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}