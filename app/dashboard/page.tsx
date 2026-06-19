import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import Link from 'next/link';

export default async function DashboardPage() {
  const cookieStore = await cookies();

  // Initialize secure server-side client to read authentication cookies
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

  // 1. SECURITY LOCK: Fetch active user session
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Kicks unauthenticated users out instantly
  if (authError || !user) {
    redirect('/login?message=Please log in to access your trading dashboard');
  }

  // 2. DATA FETCH: Fetch custom username and wallet balance from your public.profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, balance')
    .eq('id', user.id)
    .single();

  const displayUsername = profile?.username || user.email?.split('@')[0] || 'Investor';
  const displayBalance = profile?.balance ?? 0.00;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="text-2xl font-black text-white tracking-tight">
            Invest<span className="text-sky-500">Guard</span>
          </div>
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 bg-sky-600 text-white font-semibold rounded-xl transition-all">
              📊 Overview
            </Link>
            <button className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl font-medium transition-all">
              📈 Trading Arena
            </button>
            <button className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl font-medium transition-all">
              💼 My Portfolio
            </button>
          </nav>
        </div>

        {/* LOGOUT SECURE ACTION */}
        <form action={async () => {
          'use server';
          const cookieStore = await cookies();
          const supabaseServer = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll(); } } }
          );
          await supabaseServer.auth.signOut();
          redirect('/login');
        }}>
          <button type="submit" className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-950/30 font-semibold rounded-xl transition-all">
            🚪 Log Out
          </button>
        </form>
      </aside>

      {/* MAIN PORTAL AREA */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* PROFILE HEADER DYNAMIC GREETING */}
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

        {/* ACCOUNT WALLET BALANCE MATRIX */}
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
              {user.email}
            </span>
          </div>
        </section>

        {/* LIVE COIN PRICES & INTERACTIVE CHARTS */}
        <section className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-white tracking-tight">Global Trading Terminal</h3>
            <p className="text-xs text-slate-400">Real-time cryptocurrency ticker indices and chart parameters.</p>
          </div>

          {/* TRADINGVIEW CRYPTO MARKET CHART WIDGET */}
          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-2 md:p-4 shadow-xl min-h-[500px]">
            <iframe
              src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=BINANCE%3ABTCUSDT&interval=D&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Africa%/Lagos&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=investguard"
              className="w-full h-[500px] rounded-xl border-0"
              allowFullScreen
            />
          </div>
        </section>

      </main>
    </div>
  );
}