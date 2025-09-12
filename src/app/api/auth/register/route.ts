import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbHelpers } from '@/lib/db';
import { registerSchema } from '@/lib/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  console.log('🚀 Register API called');
  
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
    console.log('📝 Request body received:', { email: body.email, hasPassword: !!body.password, hasName: !!body.name });
    
    // Validar dados de entrada
    const validatedData = registerSchema.parse(body);
    const { email, password, name } = validatedData;
    console.log('✅ Data validation passed');

    // Verificar se o usuário já existe
    console.log('🔍 Checking if user exists...');
    const existingUser = await dbHelpers.getUserByEmail(email);
    console.log('📊 User check result:', { exists: !!existingUser });
    
    if (existingUser) {
      console.log('⚠️ User already exists');
      return NextResponse.json(
        { message: 'Este email já está em uso' },
        { status: 409 }
      );
    }

    // Hash da senha
    console.log('🔐 Hashing password...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('✅ Password hashed');

    // Criar usuário no banco de dados
    console.log('👤 Creating user in database...');
    const newUser = await dbHelpers.createUser({
      email,
      name,
      password: hashedPassword,
    });
    console.log('✅ User created successfully:', { id: newUser.id, email: newUser.email });

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remover senha do objeto user antes de retornar
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Conta criada com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Register error:', error);
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
        { error: 'Invalid data provided' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}