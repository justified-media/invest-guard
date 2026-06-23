import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/utils/supabase';

export async function POST(request: NextRequest) {
  try {
    const { positionId } = await request.json();
    if (!positionId) {
      return NextResponse.json({ error: 'Missing position identifier.' }, { status: 400 });
    }

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

    const dbClient = process.env.SUPABASE_SERVICE_ROLE_KEY ? createServiceRoleClient() : supabase;

    // Updates the trade to CLOSED
    const { error: updateError } = await dbClient
      .from('trades')
      .update({ status: 'CLOSED' })
      .eq('id', positionId)
      .eq('user_id', user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}