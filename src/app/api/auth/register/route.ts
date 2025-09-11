import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbHelpers } from '@/lib/db';
import { registerSchema } from '@/lib/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = registerSchema.parse(body);
    const { email, password, name } = validatedData;

    // Verificar se o usuário já existe
    const existingUser = await dbHelpers.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Este email já está em uso' },
        { status: 409 }
      );
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário no banco de dados
    const newUser = await dbHelpers.createUser({
      email,
      name,
      password: hashedPassword,
    });

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
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}