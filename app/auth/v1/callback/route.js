import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // If "next" parameter isn't explicitly set by the button, default straight to /dashboard
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The setAll method can be safely ignored if middleware handles it
            }
          },
        },
      }
    );

    // Exchange the temporary code for a secure, active user session
    const { error } = await supabaseServer.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // SUCCESS: Force redirect straight to the dashboard!
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      // 🚨 CRITICAL LOGS FOR VERCEL LIVE DEBUGGING:
      console.error("===================================================");
      console.error("SUPABASE AUTH EXCHANGE ERROR DETECTED:", error.message);
      console.error("FULL ERROR CONTEXT:", JSON.stringify(error, null, 2));
      console.error("===================================================");
    }
  } else {
    // Log if the OAuth code parameter never arrived from Google at all
    console.error("OAuth error: No temporary code parameter found in callback URL");
  }

  // If something goes wrong, send them back to login with an error flag
  return NextResponse.redirect(`${origin}/login?message=Auth exchange failed`);
}