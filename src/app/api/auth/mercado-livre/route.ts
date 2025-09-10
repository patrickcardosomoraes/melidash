import { NextRequest, NextResponse } from 'next/server';
import { MercadoLivreAPI } from '@/lib/api/mercado-livre';

const mlApi = new MercadoLivreAPI();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Gerar URL de autorização do Mercado Livre
    const authUrl = mlApi.getAuthUrl();
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating ML auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}