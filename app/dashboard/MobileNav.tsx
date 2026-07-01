"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { logout } from './actions.server';
import { 
  LayoutDashboard, 
  Layers, 
  TrendingUp, 
  History, 
  Coins, 
  Wallet, 
  ArrowUpRight, 
  LogOut 
} from 'lucide-react';

export default function MobileNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-4 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800 overflow-hidden">
              <Image src="/logo.svg" alt="Invest Guard logo" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Invest Guard</p>
              <p className="text-sm font-semibold text-white">Secure trading dashboard</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-800 bg-slate-950 text-white transition hover:border-slate-700"
            aria-label="Open menu"
          >
            <span className="space-y-1">
              <span className="block h-0.5 w-6 bg-white" />
              <span className="block h-0.5 w-6 bg-white" />
              <span className="block h-0.5 w-6 bg-white" />
            </span>
          </button>
        </div>
      </div>

      <div className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm transform bg-slate-950 shadow-2xl transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-900">
              <Image src="/logo.svg" alt="Invest Guard" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Invest Guard</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Menu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-200"
            aria-label="Close menu"
          >
            Close
          </button>
        </div>

        <nav className="space-y-3 p-5 overflow-y-auto max-h-[calc(100vh-80px)]">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-base font-semibold text-white transition hover:border-slate-700"
            onClick={() => setDrawerOpen(false)}
          >
            <LayoutDashboard className="h-5 w-5 text-sky-500" />
            Overview
          </Link>
          
          <Link
            href="/dashboard/invest"
            className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-base font-semibold text-slate-100 transition hover:border-slate-700"
            onClick={() => setDrawerOpen(false)}
          >
            <Layers className="h-5 w-5 text-sky-500" />
            Invest Tiers
          </Link>

          <Link
            href="/dashboard/trading-arena"
            className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-base font-semibold text-slate-100 transition hover:border-slate-700"
            onClick={() => setDrawerOpen(false)}
          >
            <TrendingUp className="h-5 w-5 text-sky-500" />
            Trading Arena
          </Link>

          <Link
            href="/dashboard/trade-history"
            className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-base font-semibold text-slate-100 transition hover:border-slate-700"
            onClick={() => setDrawerOpen(false)}
          >
            <History className="h-5 w-5 text-sky-500" />
            Trade History
          </Link>

          <Link
            href="/dashboard/loans"
            className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-base font-semibold text-slate-100 transition hover:border-slate-700"
            onClick={() => setDrawerOpen(false)}
          >
            <Coins className="h-5 w-5 text-sky-500" />
            Capital Loans
          </Link>

          {/* New Fund Account Module Link */}
          <Link
            href="/dashboard/deposit"
            className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-base font-semibold text-slate-100 transition hover:border-slate-700"
            onClick={() => setDrawerOpen(false)}
          >
            <Wallet className="h-5 w-5 text-sky-500" />
            Fund Account
          </Link>

          {/* New Capital Removal Module Link */}
          <Link
            href="/dashboard/removal"
            className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-base font-semibold text-slate-100 transition hover:border-slate-700"
            onClick={() => setDrawerOpen(false)}
          >
            <ArrowUpRight className="h-5 w-5 text-sky-500" />
            Capital Removal
          </Link>
          
          <form action={logout} className="mt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-3 w-full rounded-3xl bg-red-500/10 border border-red-500/20 px-4 py-4 text-base font-semibold text-red-300 transition hover:bg-red-500/15"
            >
              <LogOut className="h-5 w-5 text-red-400" />
              Log Out
            </button>
          </form>
        </nav>
      </div>

      {drawerOpen ? (
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
          aria-label="Close sidebar overlay"
        />
      ) : null}
    </div>
  );
}