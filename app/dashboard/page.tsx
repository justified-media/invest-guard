'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data for our dashboard UI
  const [balance, setBalance] = useState(12450.85);
  const [invested, setInvested] = useState(8200.00);
  const [profit, setProfit] = useState(4250.85);

  const transactions = [
    { id: 1, type: 'Buy BTC', amount: '+$450.00', date: 'June 19, 2026', status: 'Completed' },
    { id: 2, type: 'Withdrawal', amount: '-$1,200.00', date: 'June 18, 2026', status: 'Completed' },
    { id: 3, type: 'Buy ETH', amount: '+$850.00', date: 'June 15, 2026', status: 'Processing' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            Invest<span className="text-sky-500">Guard</span>
          </div>
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 bg-sky-50 text-sky-700 font-semibold rounded-xl transition-all">
              📊 Overview
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl transition-all">
              📈 Trading Arena
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl transition-all">
              💼 My Portfolio
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl transition-all">
              ⚙️ Settings
            </button>
          </nav>
        </div>
        <div>
          <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-all">
            🚪 Log Out
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back, Investor!</h1>
            <p className="text-sm text-slate-500">InvestGuard is the best investment trading platform.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-sm">
              IG
            </div>
          </div>
        </header>

        {/* 2. MAIN STAT CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Total Balance */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Balance</p>
            <h3 className="text-3xl font-black text-slate-900">${balance.toLocaleString()}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              +12.5% this week
            </span>
          </div>

          {/* Card 2: Active Investments */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Deposits</p>
            <h3 className="text-3xl font-black text-slate-900">${invested.toLocaleString()}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700">
              2 Active Trades
            </span>
          </div>

          {/* Card 3: Total Profit */}
          <div className="bg-sky-500 p-6 rounded-2xl shadow-md text-white space-y-2">
            <p className="text-xs font-semibold text-sky-100 uppercase tracking-wider">Total Profit</p>
            <h3 className="text-3xl font-black">${profit.toLocaleString()}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
              Institutional Tier
            </span>
          </div>
        </section>

        {/* QUICK ACTIONS BUTTONS */}
        <section className="flex gap-4">
          <button className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all">
            ➕ Deposit Funds
          </button>
          <button className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-semibold rounded-xl shadow-sm transition-all">
            💸 Request Withdrawal
          </button>
        </section>

        {/* 3. RECENT ACTIVITY TABLE */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Account Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-3">Transaction</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{tx.type}</td>
                    <td className="px-6 py-4 text-slate-500">{tx.date}</td>
                    <td className="px-6 py-4 font-mono font-medium">{tx.amount}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}