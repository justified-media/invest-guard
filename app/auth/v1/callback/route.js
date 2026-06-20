import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/dashboard';

  if (!code) {
    console.error('OAuth error: No temporary code parameter found in callback URL', request.url);
    return NextResponse.redirect(`${url.origin}/login?message=Auth exchange failed`);
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
    return NextResponse.redirect(`${url.origin}/login?message=Auth exchange failed`);
  }

  return response;
}