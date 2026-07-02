import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/utils/supabase';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const cookieStore = await cookies();
  const response = NextResponse.json({ success: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data?.session || !data.user) {
    return NextResponse.json({ error: 'Unable to create session. Please try again.' }, { status: 500 });
  }

  const username = email.split('@')[0];
  const profileClient = process.env.SUPABASE_SERVICE_ROLE_KEY ? createServiceRoleClient() : supabase;
  const { error: profileError } = await profileClient.from('profiles').insert({
    id: data.user.id,
    username
  });

  if (profileError) {
    console.error('Failed to create profile row:', profileError.message);
    return NextResponse.json({ error: 'Unable to initialize user profile.' }, { status: 500 });
  }

  return response;
}
