import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
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
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Build query with Supabase client
    let supabaseQuery = supabase
      .from('invitations')
      .select(`
        id,
        email,
        status,
        expires_at,
        created_at,
        accepted_at,
        invited_by
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status);
    }

    const { data: result, error, count } = await supabaseQuery;
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Erro ao buscar convites');
    }
    
    // Get inviter names for invites that have invited_by
    const invites = result || [];
    const inviterIds = invites.filter(inv => inv.invited_by).map(inv => inv.invited_by);
    
    let inviters: { id: string; name: string; email: string }[] = [];
    if (inviterIds.length > 0) {
      const { data: inviterData } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', inviterIds);
      inviters = inviterData || [];
    }
    
    // Transform data to match expected format
    const invitesWithInviters = invites.map(invite => {
      const inviter = inviters.find(inv => inv.id === invite.invited_by);
      return {
        ...invite,
        invited_by_name: inviter?.name || null,
        invited_by_email: inviter?.email || null
      };
    });
    
    const total = count || 0;

    return NextResponse.json({
      success: true,
      data: {
        invites: invitesWithInviters,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
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