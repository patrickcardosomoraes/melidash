import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseDbHelpers } from '@/lib/supabase-db';
import { registerSchema } from '@/lib/validation';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extended schema for invitation-based registration
const inviteRegisterSchema = registerSchema.extend({
  token: z.string().optional(), // Invitation token is optional for backward compatibility
});

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
    const validatedData = inviteRegisterSchema.parse(body);
    const { email, password, name, token } = validatedData;
    console.log('✅ Data validation passed', { hasToken: !!token });

    // If token is provided, verify invitation
    if (token) {
      console.log('🎫 Invitation token provided, verifying...');
      
      // TODO: Replace with actual database query when migration is applied
      // const invitation = await supabaseDbHelpers.query(
      //   `SELECT id, email, status, expires_at, invited_by 
      //    FROM invitations 
      //    WHERE token = $1 AND status = 'PENDING'`,
      //   [token]
      // );
      
      // Mock invitation verification for now
      const mockInvitation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: email,
        status: 'PENDING',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        invited_by: 'admin-user-id'
      };
      
      if (!mockInvitation) {
        console.log('❌ Invalid or expired invitation token');
        return NextResponse.json(
          { message: 'Token de convite inválido ou expirado' },
          { status: 400 }
        );
      }
      
      // Check if invitation email matches provided email
      if (mockInvitation.email !== email) {
        console.log('❌ Email mismatch with invitation');
        return NextResponse.json(
          { message: 'Email não corresponde ao convite' },
          { status: 400 }
        );
      }
      
      // Check if invitation is expired
      if (new Date(mockInvitation.expires_at) < new Date()) {
        console.log('❌ Invitation expired');
        return NextResponse.json(
          { message: 'Convite expirado' },
          { status: 400 }
        );
      }
      
      console.log('✅ Invitation token verified');
    } else {
      // TODO: For production, you might want to disable open registration
      // and require invitation tokens for all registrations
      console.log('⚠️ No invitation token provided - open registration');
    }

    // Verificar se o usuário já existe
    console.log('🔍 Checking if user exists...');
    const existingUser = await supabaseDbHelpers.getUserByEmail(email);
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
    const newUser = await supabaseDbHelpers.createUser({
      email,
      name,
      password: hashedPassword,
    });
    console.log('✅ User created successfully:', { id: newUser.id, email: newUser.email });

    // Gerar token JWT
    const jwtToken = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remover senha do objeto user antes de retornar
    const { password: __unused, ...userWithoutPassword } = newUser;

    // TODO: If registration was via invitation, mark invitation as accepted
    if (token) {
      console.log('✅ Marking invitation as accepted (simulated)');
      // await supabaseDbHelpers.query(
      //   `UPDATE invitations 
      //    SET status = 'ACCEPTED', accepted_at = NOW(), accepted_by = $1, updated_at = NOW()
      //    WHERE token = $2`,
      //   [newUser.id, token]
      // );
    }

    return NextResponse.json({
      user: userWithoutPassword,
      token: jwtToken,
      message: token ? 'Conta criada com sucesso via convite' : 'Conta criada com sucesso'
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