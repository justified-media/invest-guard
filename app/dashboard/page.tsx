// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import CryptoDashboard from './CryptoDashboard';

export default async function DashboardPage() {
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

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch data specifically related to the profile viewport
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, balance')
    .eq('id', user?.id)
    .single();

  const displayUsername = profile?.username || user?.email?.split('@')[0] || 'Investor';
  const displayBalance = profile?.balance ?? 0.00;

  return (
    <>
      {/* PROFILE HEADER GREETING */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Hello, {displayUsername}!
          </h1>
          <p className="text-sm text-slate-400 mt-1">Welcome back. Your live tracking node is fully operational.</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold uppercase tracking-wider ring-4 ring-sky-500/10">
          {displayUsername.substring(0, 2)}
        </div>
      </header>

      {/* ACCOUNT MATRIX CONTAINER */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl group-hover:bg-sky-500/10 transition-all"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Stored Wallet Balance</p>
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            ${Number(displayBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ● Active Session Secured
          </span>
        </div>

        <div className="bg-gradient-to-br from-sky-600 to-sky-700 p-6 rounded-2xl shadow-xl text-white space-y-2 relative overflow-hidden">
          <p className="text-xs font-semibold text-sky-200 uppercase tracking-wider">Verified Node Account</p>
          <h3 className="text-3xl font-black tracking-tight">Client Tier 1</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-sky-100 backdrop-blur-sm">
            {user?.email}
          </span>
        </div>
      </section>

      {/* LIVE COIN METRICS SECTION */}
      <CryptoDashboard />
    </>
  );
}