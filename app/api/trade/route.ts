import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/utils/supabase';

export async function POST(request: NextRequest) {
  const { amount, type, symbol, entry_price } = await request.json();
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
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const amountValue = Number(amount);
  if (!amountValue || amountValue <= 0) {
    return NextResponse.json({ error: 'Invalid trade amount.' }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Unable to load user profile.' }, { status: 500 });
  }

  const tradeValue = amountValue * Number(entry_price);
  if (type === 'BUY' && tradeValue > Number(profile.balance)) {
    return NextResponse.json({ error: 'Insufficient balance.' }, { status: 400 });
  }

  const newBalance = type === 'BUY'
    ? Number(profile.balance) - tradeValue
    : Number(profile.balance) + tradeValue;

  const dbClient = process.env.SUPABASE_SERVICE_ROLE_KEY ? createServiceRoleClient() : supabase;

  const { error: updateError } = await dbClient
    .from('profiles')
    .update({ balance: newBalance })
    .eq('id', user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { error: tradeError } = await dbClient.from('trades').insert({
    user_id: user.id,
    symbol,
    type,
    amount: amountValue,
    entry_price: Number(entry_price),
  });

  if (tradeError) {
    return NextResponse.json({ error: tradeError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, balance: newBalance });
}
