"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TradeLog {
  id: string;
  user_id: string;
  symbol: string;
  type?: string;        // Made optional to prevent crashing if null or missing
  amount: number;
  entry_price: number;
  market_type?: string | null;
  status: string;
  created_at?: string;  // Made optional for safe fallback formatting
}

export default function TradeHistoryPage() {
  const [trades, setTrades] = useState<TradeLog[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClosedTradeHistoryAndProfile() {
      try {
        setLoading(true);
        setErrorMessage(null);
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setErrorMessage("Authentication session sync required. Please reload.");
          return;
        }

        const currentUserId = user.id;

        // 1. Fetch user profile cleanly
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', currentUserId)
          .single();

        setUserName(profile?.username || user.email?.split('@')[0] || "Trader");

        // 2. Fetch Trades and read explicit Postgres detailed error states
        const { data, error: tradeError } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', currentUserId)
          .eq('status', 'CLOSED');

        if (tradeError) {
          // Expose the raw exact Postgres string message
          throw new Error(`${tradeError.message} (${tradeError.hint || 'No hint'})`);
        }

        if (data) {
          // Sort safely in memory just in case 'created_at' index names vary in your schema
          const sortedData = [...data].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });
          setTrades(sortedData as TradeLog[]);
        }
      } catch (err: any) {
        console.error("Database query failed:", err);
        setErrorMessage(err.message || "Unknown database pipeline handshake exception.");
      } finally {
        setLoading(false);
      }
    }

    fetchClosedTradeHistoryAndProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-sky-500" />
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Parsing Database Ledger...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <div className="text-rose-500 font-bold text-sm font-mono uppercase tracking-wider">Database Query Error</div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-w-md mx-auto">
          <p className="text-xs text-rose-400 font-mono text-left whitespace-pre-wrap break-words">
            {errorMessage}
          </p>
        </div>
        <p className="text-2xs text-slate-500 max-w-xs font-mono">
          Check if RLS Policies are enabled for select queries on the 'trades' table in Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          History Ledger for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">{userName}</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Review complete historical archives of your closed market node operations.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Closed Operations</h3>
          <span className="text-2xs font-mono bg-slate-950 border border-slate-800 text-sky-400 px-2.5 py-1 rounded-md">
            Archived Files: {trades.length}
          </span>
        </div>

        {trades.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500 font-mono">
            No closed trade records found for this account node.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/40 text-2xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-4 pl-6">Asset Symbol</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Market Type</th>
                  <th className="p-4">Trade Size</th>
                  <th className="p-4">Execution Price</th>
                  <th className="p-4 pr-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                {trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 pl-6 font-bold text-white">{trade.symbol}</td>
                    <td className="p-4">
                      <span className={`text-2xs font-bold px-2 py-0.5 rounded border ${
                        trade.type === 'BUY' 
                          ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' 
                          : 'bg-rose-950/30 text-rose-400 border-rose-900/50'
                      }`}>
                        {trade.type || 'BUY'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-2xs font-sans">
                      {trade.market_type || 'CRYPTO'}
                    </td>
                    <td className="p-4 text-slate-300">{trade.amount}</td>
                    <td className="p-4 font-bold text-slate-100">
                      ${trade.entry_price ? trade.entry_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : "0.00"}
                    </td>
                    <td className="p-4 pr-6 text-right text-slate-500 text-2xs">
                      {trade.created_at ? new Date(trade.created_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}