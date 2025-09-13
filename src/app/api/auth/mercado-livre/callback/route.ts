import { NextRequest, NextResponse } from 'next/server';
import { MercadoLivreAPI } from '@/lib/api/mercado-livre';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Verificar se houve erro na autorização
    if (error) {
      console.error('ML Authorization error:', error);
      return NextResponse.redirect(
        new URL('/dashboard?error=ml_auth_failed', request.url)
      );
    }

    // Verificar se o código foi fornecido
    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard?error=no_auth_code', request.url)
      );
    }

    // Validar state para segurança (em produção, validar contra valor armazenado)
    if (!state) {
      console.error('Missing state parameter');
      return NextResponse.redirect(
        new URL('/dashboard?error=invalid_state', request.url)
      );
    }

    const mlApi = new MercadoLivreAPI();

    try {
      // Trocar código por tokens no servidor
      const tokenData = await mlApi.exchangeCodeForTokens(code);

      // Obter informações do usuário do ML (confirma token válido)
      const mlApiWithToken = new MercadoLivreAPI(tokenData.accessToken, tokenData.refreshToken);
      const mlUserInfo = await mlApiWithToken.getUserInfo();

      // Definir cookies legíveis pelo cliente para transferência para localStorage
      const redirectUrl = new URL('/auth/callback', request.url);
      redirectUrl.searchParams.set('ml_connected', 'true');
      redirectUrl.searchParams.set('ml_user_id', mlUserInfo.id.toString());

      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set('ml_access_token', tokenData.accessToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 // 1 hora
      });
      response.cookies.set('ml_refresh_token', tokenData.refreshToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 dias
      });

      return response;
      
    } catch (tokenError) {
      console.error('Error exchanging code for token:', tokenError);
      return NextResponse.redirect(
        new URL('/dashboard?error=token_exchange_failed', request.url)
      );
    }
    
  } catch (error) {
    console.error('ML callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?error=callback_failed', request.url)
    );
  }
}
