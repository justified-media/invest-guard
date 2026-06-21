"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { logout } from './actions.server';

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

        <nav className="space-y-3 p-5">
          <Link
            href="/dashboard"
            className="block rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-base font-semibold text-white transition hover:border-slate-700"
            onClick={() => setDrawerOpen(false)}
          >
            Overview
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-left text-base font-semibold text-slate-100 transition hover:border-slate-700"
          >
            Trading Arena
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-left text-base font-semibold text-slate-100 transition hover:border-slate-700"
          >
            My Portfolio
          </button>
          <form action={logout} className="mt-4">
            <button
              type="submit"
              className="w-full rounded-3xl bg-red-500/10 border border-red-500/20 px-4 py-4 text-base font-semibold text-red-300 transition hover:bg-red-500/15"
            >
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
