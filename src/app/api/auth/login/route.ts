import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbHelpers } from '@/lib/db';
import { loginSchema } from '@/lib/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // Buscar usuário no banco de dados
    const user = await dbHelpers.getUserByEmail(email);
    if (!user) {
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
    console.error('Login error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
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