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
      // Trocar código por tokens
      const tokenData = await mlApi.exchangeCodeForToken(code);
      
      // Obter informações do usuário do ML
      const mlApiWithToken = new MercadoLivreAPI(tokenData.accessToken, tokenData.refreshToken);
      const mlUserInfo = await mlApiWithToken.getUserInfo();
      
      // Aqui você pode salvar os tokens no banco de dados
      // Por enquanto, vamos redirecionar com sucesso
      const successUrl = new URL('/dashboard', request.url);
      successUrl.searchParams.set('ml_connected', 'true');
      successUrl.searchParams.set('ml_user_id', mlUserInfo.id.toString());
      
      // Em produção, salve os tokens no banco:
      // if (state) {
      //   await dbHelpers.updateUserTokens(state, {
      //     mlAccessToken: tokenData.accessToken,
      //     mlRefreshToken: tokenData.refreshToken,
      //     mlUserId: mlUserInfo.id.toString()
      //   });
      // }
      
      return NextResponse.redirect(successUrl);
      
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