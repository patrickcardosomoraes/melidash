import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseDbHelpers } from '@/lib/supabase-db';
import crypto from 'crypto';

// Validation schemas
const createInviteSchema = z.object({
  email: z.string().email('Email inválido'),
  expiresInDays: z.number().min(1).max(30).default(7)
});

const updateInviteSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'])
});

// GET /api/admin/invites - List all invitations
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement proper authentication check for admin role
    // For now, we'll simulate admin check
    const adminUserId = 'admin-user-id'; // This should come from auth
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query
    let query = `
      SELECT 
        i.id,
        i.email,
        i.status,
        i.expires_at,
        i.created_at,
        i.accepted_at,
        u.name as invited_by_name,
        u.email as invited_by_email
      FROM invitations i
      LEFT JOIN users u ON i.invited_by = u.id
    `;
    
    const params: any[] = [];
    
    if (status) {
      query += ` WHERE i.status = $${params.length + 1}`;
      params.push(status);
    }
    
    query += ` ORDER BY i.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    // TODO: Replace with actual database query
    // const result = await supabaseDbHelpers.query(query, params);
    
    // Mock response for now
    const mockInvites = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        status: 'PENDING',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        accepted_at: null,
        invited_by_name: 'Admin User',
        invited_by_email: 'admin@melidash.com'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        invites: mockInvites,
        pagination: {
          page,
          limit,
          total: 1,
          totalPages: 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching invites:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/admin/invites - Create new invitation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createInviteSchema.parse(body);
    
    // TODO: Implement proper authentication check for admin role
    const adminUserId = 'admin-user-id'; // This should come from auth
    
    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validatedData.expiresInDays);
    
    // TODO: Check if user already exists
    // const existingUser = await supabaseDbHelpers.getUserByEmail(validatedData.email);
    // if (existingUser) {
    //   return NextResponse.json(
    //     { success: false, error: 'Usuário já existe' },
    //     { status: 400 }
    //   );
    // }
    
    // TODO: Check if there's already a pending invitation
    // const existingInvite = await supabaseDbHelpers.query(
    //   'SELECT id FROM invitations WHERE email = $1 AND status = $2',
    //   [validatedData.email, 'PENDING']
    // );
    // if (existingInvite.length > 0) {
    //   return NextResponse.json(
    //     { success: false, error: 'Já existe um convite pendente para este email' },
    //     { status: 400 }
    //   );
    // }
    
    // TODO: Insert invitation into database
    // const result = await supabaseDbHelpers.query(
    //   `INSERT INTO invitations (email, token, invited_by, expires_at) 
    //    VALUES ($1, $2, $3, $4) 
    //    RETURNING id, email, token, expires_at, created_at`,
    //   [validatedData.email, token, adminUserId, expiresAt]
    // );
    
    // Mock response for now
    const mockInvite = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: validatedData.email,
      token,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    };
    
    // TODO: Send invitation email
    // await sendInvitationEmail(validatedData.email, token);
    
    return NextResponse.json({
      success: true,
      message: 'Convite criado com sucesso',
      data: {
        invite: mockInvite,
        inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${token}`
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos', 
          details: error.issues 
        },
        { status: 400 }
      );
    }
    
    console.error('Error creating invite:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/invites - Update invitation status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateInviteSchema.parse(body);
    
    // TODO: Implement proper authentication check for admin role
    const adminUserId = 'admin-user-id';
    
    // TODO: Update invitation in database
    // const result = await supabaseDbHelpers.query(
    //   `UPDATE invitations 
    //    SET status = $1, updated_at = NOW() 
    //    WHERE id = $2 
    //    RETURNING id, email, status, updated_at`,
    //   [validatedData.status, validatedData.id]
    // );
    
    // Mock response
    const mockUpdatedInvite = {
      id: validatedData.id,
      email: 'user@example.com',
      status: validatedData.status,
      updated_at: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      message: 'Convite atualizado com sucesso',
      data: { invite: mockUpdatedInvite }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos', 
          details: error.issues 
        },
        { status: 400 }
      );
    }
    
    console.error('Error updating invite:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}