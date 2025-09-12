import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseDbHelpers } from '@/lib/supabase-db';
import { loginSchema } from '@/lib/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  console.log('🚀 Login API called');
  
  try {
    // Verificar variáveis de ambiente essenciais
    if (!JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured');
      return NextResponse.json(
        { error: 'Server configuration error: JWT_SECRET missing' },
        { status: 500 }
      );
    }
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not configured');
      return NextResponse.json(
        { error: 'Server configuration error: DATABASE_URL missing' },
        { status: 500 }
      );
    }
    
    console.log('✅ Environment variables check passed');
    
    const body = await request.json();
    console.log('📝 Request body received:', { email: body.email, hasPassword: !!body.password });
    
    // Validar dados de entrada
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;
    console.log('✅ Data validation passed');

    // Buscar usuário no banco de dados
    console.log('🔍 Looking for user in database...');
    const user = await supabaseDbHelpers.getUserByEmail(email);
    console.log('📊 User lookup result:', { found: !!user });
    
    if (!user) {
      console.log('⚠️ User not found');
      return NextResponse.json(
        { message: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }

    // Verificar se o usuário tem senha (pode ter sido criado via OAuth)
    if (!user.password) {
      return NextResponse.json(
        { message: 'Esta conta foi criada via Mercado Livre. Use a opção "Entrar com Mercado Livre"' },
        { status: 401 }
      );
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remover senha do objeto user antes de retornar
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Determinar tipo de erro para resposta mais específica
    if (error instanceof Error && error.message.includes('prepared statement')) {
      console.error('🔍 Database connection issue detected');
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }
    
    if (error instanceof Error && error.name === 'ZodError') {
      console.error('🔍 Validation error detected');
      return NextResponse.json(
        { message: 'Dados inválidos fornecidos' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
