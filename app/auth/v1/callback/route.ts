import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/utils/supabase';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/dashboard';

  if (!code) {
    const query = Array.from(url.searchParams.entries()).map(([key, value]) => ({ key, value }));
    const body = JSON.stringify({
      message: 'OAuth error: callback URL has no code parameter',
      requestUrl: request.url,
      query,
    }, null, 2);
    console.error(body);
    return new Response(body, {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL(next, url.origin));

  const supabaseServer = createServerClient(
    getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabaseServer.auth.exchangeCodeForSession(code);
  if (error) {
    console.error('SUPABASE AUTH EXCHANGE ERROR DETECTED:', error.message, 'callbackUrl=', request.url);
    const body = JSON.stringify({
      message: 'Supabase auth exchange failed',
      error: error.message,
      callbackUrl: request.url,
    });
    return new Response(body, {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: userData, error: userError } = await supabaseServer.auth.getUser();
  if (!userError && userData?.user) {
    const user = userData.user;
    const username = user.email ? user.email.split('@')[0] : user.id;
    const profileClient = process.env.SUPABASE_SERVICE_ROLE_KEY ? createServiceRoleClient() : supabaseServer;
    const { error: profileError } = await profileClient.from('profiles').upsert(
      {
        id: user.id,
        username,
        balance: 0,
      },
      { onConflict: 'id' }
    );
    if (profileError) {
      console.error('Failed to upsert profile row after OAuth callback:', profileError.message);
    }
  } else {
    console.error('Unable to resolve authenticated user after callback:', userError?.message);
  }

  return response;
}