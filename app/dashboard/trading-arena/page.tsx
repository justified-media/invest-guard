import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import TradingArenaClient from './TradingArenaClient';

export const dynamic = 'force-dynamic';

export default async function TradingArenaPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const { data: profile, error: profileError, status } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', user.id)
    .single();

  let balance = 10000;
  if ((profileError && status !== 406) || (!profile && status !== 406 && profileError)) {
    console.error('Profile fetch failed:', profileError?.message || 'unexpected error');
    redirect('/dashboard');
  }

  if (!profile) {
    const username = user.email ? user.email.split('@')[0] : user.id;
    const { data: insertedProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username,
        balance,
      })
      .select('balance')
      .single();

    if (insertError || !insertedProfile) {
      console.error('Unable to ensure profile row:', insertError?.message || 'no profile returned');
      redirect('/dashboard');
    }

    balance = insertedProfile.balance ?? balance;
  } else {
    balance = profile.balance ?? balance;
  }

  return <TradingArenaClient initialBalance={balance} userId={user.id} />;
}
