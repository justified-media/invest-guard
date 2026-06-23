import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const { userId, planName, depositAmount, expectedPayout, cryptoMethod } = await request.json();
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

    // Verify user authorization session integrity
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // Insert transaction row to trigger Admin dashboard feeds
    const { data: requestRow, error: dbError } = await supabase
      .from('investments')
      .insert({
        user_id: user.id,
        plan_name: planName,
        deposit_amount: Number(depositAmount),
        expected_payout: Number(expectedPayout),
        crypto_method: cryptoMethod,
        status: 'PENDING'
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, trackingId: requestRow.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}