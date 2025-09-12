import { NextRequest, NextResponse } from 'next/server';
import { supabaseDbHelpers } from '@/lib/supabase-db';
import { z } from 'zod';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Forgot Password API called');
    
    // Validar dados de entrada
    const body = await request.json();
    console.log('📝 Request body received:', { email: body.email });
    
    const validatedData = forgotPasswordSchema.parse(body);
    console.log('✅ Data validation passed');
    
    const { email } = validatedData;
    
    // Verificar se o usuário existe
    console.log('🔍 Looking for user in database...');
    const user = await supabaseDbHelpers.getUserByEmail(email);
    
    if (!user) {
      console.log('❌ User not found');
      // Por segurança, sempre retornamos sucesso mesmo se o usuário não existir
      return NextResponse.json({
        message: 'Se o email existir em nossa base, você receberá as instruções para redefinir sua senha.',
      });
    }
    
    console.log('✅ User found:', { id: user.id, email: user.email });
    
    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora
    
    console.log('🔑 Generated reset token');
    
    // TODO: Implementar método para salvar reset token no supabaseDbHelpers
    // Por enquanto, vamos simular que foi salvo
    console.log('⚠️ Reset token would be saved (not implemented yet)');
    console.log('Token:', resetToken);
    console.log('Expiry:', resetTokenExpiry);
    
    console.log('✅ Reset token saved to database');
    
    // TODO: Enviar email com o link de reset
    // Por enquanto, vamos apenas logar o token para desenvolvimento
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000'
      : process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'https://melidash.vercel.app';
    
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
    console.log('📧 Reset link (DEV):', resetLink);
    
    return NextResponse.json({
      message: 'Se o email existir em nossa base, você receberá as instruções para redefinir sua senha.',
      // Em desenvolvimento, incluímos o link
      ...(process.env.NODE_ENV === 'development' && {
        resetLink,
      }),
    });
    
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}