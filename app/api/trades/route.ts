import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/utils/supabase';

function getContractSize(symbol: string, marketType: string): number {
  if (marketType === 'FOREX') return 100000;
  if (marketType === 'COMMODITY' && symbol.includes('XAU')) return 100; 
  if (marketType === 'COMMODITY' && symbol.includes('OIL')) return 1000; 
  return 1; 
}

// 1. GET ENDPOINT: Fetches active open trades on browser refresh
export async function GET(request: NextRequest) {
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

  // FIXED: Pointing back to your actual database table 'trades'
  const { data: activeTrades, error: dbError } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'OPEN');

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  const positions = (activeTrades || []).map((t) => ({
    id: t.id,
    symbol: t.symbol,
    type: t.type,
    amount: Number(t.amount), 
    entryPrice: Number(t.entry_price),
    marketType: t.market_type || 'CRYPTO',
  }));

  return NextResponse.json({ positions });
}

// 2. POST ENDPOINT: Executes a brand new trade
export async function POST(request: NextRequest) {
  const { amount, type, symbol, entry_price, marketType } = await request.json();
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

  const lotSizeValue = Number(amount);
  if (!lotSizeValue || lotSizeValue < 0.01) {
    return NextResponse.json({ error: 'Minimum trade size is 0.01 lots.' }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Unable to load user profile.' }, { status: 500 });
  }

  const contractSize = getContractSize(symbol, marketType);
  const actualUnits = lotSizeValue * contractSize;
  const tradeValue = actualUnits * Number(entry_price);

  if (type === 'BUY' && tradeValue > Number(profile.balance)) {
    return NextResponse.json({ error: 'Insufficient balance for this contract margin.' }, { status: 400 });
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

  // FIXED: Pointing back to your actual database table 'trades'
  const { data: insertedTrade, error: tradeError } = await dbClient
    .from('trades')
    .insert({
      user_id: user.id,
      symbol,
      type,
      amount: lotSizeValue, 
      entry_price: Number(entry_price),
      market_type: marketType,
      status: 'OPEN', 
    })
    .select()
    .single();

  if (tradeError) {
    return NextResponse.json({ error: tradeError.message }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true, 
    balance: newBalance, 
    tradeId: insertedTrade.id 
  });
}