import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request) {
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
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

  return response;
}