export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import Link from 'next/link';
import MobileNav from './MobileNav';
import { 
  LayoutDashboard, 
  Layers, 
  TrendingUp, 
  History, 
  Coins, 
  Wallet, 
  ArrowUpRight, 
  Briefcase, 
  LogOut 
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    redirect('/login?message=Please log in to access your trading dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-hidden h-screen">
      
      {/* ========================================================= */}
      {/* DESKTOP SIDE NAVIGATION BAR (Hidden on Mobile)            */}
      {/* ========================================================= */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col justify-between p-6 shrink-0 h-full">
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="text-2xl font-black text-white tracking-tight">
            Invest<span className="text-sky-500">Guard</span>
          </div>
          
          {/* All Desktop Links consolidated here */}
          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all group">
              <LayoutDashboard className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
              Overview
            </Link>
            
            <Link href="/dashboard/invest" className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all group">
              <Layers className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
              Invest Tiers
            </Link>
            
            <Link href="/dashboard/trading-arena" className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all group">
              <TrendingUp className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
              Trading Arena
            </Link>
            
            <Link href="/dashboard/trade-history" className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all group">
              <History className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
              Trade History
            </Link>

            <Link href="/dashboard/loans" className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all group">
              <Coins className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
              Capital Loans
            </Link>

            {/* Added Fund Account (Deposit) Page */}
            <Link href="/dashboard/deposit" className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all group">
              <Wallet className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
              Fund Account
            </Link>

            {/* Added Capital Removal (Payout) Page */}
            <Link href="/dashboard/removal" className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all group">
              <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
              Capital Removal
            </Link>

            
          </nav>
        </div>

        {/* Secure Logout Action */}
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
          <button type="submit" className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-950/30 font-bold text-xs uppercase tracking-wider rounded-xl transition-all group">
            <LogOut className="h-4 w-4 text-red-400/70 group-hover:text-red-400 transition-colors" />
            Log Out
          </button>
        </form>
      </aside>

      {/* ========================================================= */}
      {/* MAIN VIEWPORT TERMINAL                                    */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        
        {/* MOBILE TOP BAR (Only shows on mobile viewports) */}
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="text-xl font-black text-white tracking-tight">
            Invest<span className="text-sky-500">Guard</span>
          </div>
          <MobileNav />
        </div>

        {/* Main page view injection content block */}
        <main className="p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}