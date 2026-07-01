"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CryptoAsset = 'BTC' | 'ETH' | 'XRP' | 'SOL';

export default function DepositPage() {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>('ETH');
  const [walletPool, setWalletPool] = useState<Record<CryptoAsset, string>>({
    BTC: 'Loading address...',
    ETH: 'Loading address...',
    XRP: 'Loading address...',
    SOL: 'Loading address...'
  });
  
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Fetch all addresses managed by the admin on mount
  useEffect(() => {
    async function fetchAllWallets() {
      const keys = ['wallet_btc', 'wallet_eth', 'wallet_xrp', 'wallet_solana'];
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', keys);
      
      if (!error && data) {
        const mappedWallets = { ...walletPool };
        data.forEach(item => {
          if (item.key === 'wallet_btc') mappedWallets.BTC = item.value;
          if (item.key === 'wallet_eth') mappedWallets.ETH = item.value;
          if (item.key === 'wallet_xrp') mappedWallets.XRP = item.value;
          if (item.key === 'wallet_solana') mappedWallets.SOL = item.value;
        });
        setWalletPool(mappedWallets);
      }
    }
    fetchAllWallets();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletPool[selectedAsset]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset message after 2 seconds
    } catch (err) {
      console.error("Failed to copy string resource:", err);
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("No authenticated session located.");

      const { error } = await supabase
        .from('deposits')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          asset_type: selectedAsset, // Saving the exact asset type used
          status: 'PENDING'
        });

      if (error) throw error;

      setStatus({ success: true, message: `Deposit verification logged for ${selectedAsset}! Waiting for admin confirmation.` });
      setAmount('');
    } catch (err: any) {
      console.error(err);
      setStatus({ success: false, message: err.message || "Database tracking error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* SECTION HEADER & SUB-NAV SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Fund Account</h1>
          <p className="text-xs text-slate-400 mt-1">Submit global capital clearings to your system ledger node.</p>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-center">
          <span className="px-3 py-1.5 text-xs font-bold bg-sky-500 text-slate-950 rounded-lg shadow-md cursor-default">
            💳 Deposit
          </span>
          <Link 
            href="/dashboard/deposit/status" 
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            📋 History
          </Link>
        </div>
      </div>

      {/* ASSET SELECTOR DROPDOWN / CHIPS */}
      <div className="space-y-2">
        <label className="block text-2xs uppercase tracking-wider text-slate-400 font-bold">Select Settlement Asset</label>
        <div className="grid grid-cols-4 gap-2">
          {(['BTC', 'ETH', 'XRP', 'SOL'] as CryptoAsset[]).map((asset) => (
            <button
              key={asset}
              type="button"
              onClick={() => setSelectedAsset(asset)}
              className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                selectedAsset === asset 
                  ? 'bg-sky-500/10 border-sky-500 text-sky-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {asset}
            </button>
          ))}
        </div>
      </div>

      {/* WALLET ADDRESS NOTICE CARD WITH COPY COMPONENT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-2xs uppercase tracking-wider text-sky-400 font-bold">Official {selectedAsset} Address</h3>
          <span className="text-3xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-500">Secure Node</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Send your allocation value to the smart contract address below. After transmitting from your provider, notify our processing queue using the submission block below.
        </p>
        
        <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between font-mono text-xs text-white gap-3 overflow-hidden">
          <span className="truncate select-all text-slate-200">{walletPool[selectedAsset]}</span>
          <button
            type="button"
            onClick={handleCopy}
            className={`shrink-0 text-2xs px-3 py-1.5 font-bold uppercase tracking-wider rounded-lg border transition-all ${
              copied 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* SUBMISSION FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <form onSubmit={handleDepositSubmit} className="space-y-4">
          
          {status && (
            <div className={`p-4 rounded-xl border text-xs font-mono ${
              status.success 
                ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' 
                : 'bg-rose-950/30 text-rose-400 border-rose-900/50'
            }`}>
              {status.message}
            </div>
          )}

          <div>
            <label className="block text-2xs uppercase tracking-wider text-slate-400 font-bold mb-2">Amount to Declare ($)</label>
            <input
              type="number"
              required
              placeholder="1500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold uppercase tracking-wider text-xs py-4 rounded-xl transition-all cursor-pointer mt-2"
          >
            {loading ? 'Transmitting Log File...' : `Confirm ${selectedAsset} Deposit`}
          </button>
        </form>
      </div>
    </div>
  );
}