"use client";

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CryptoAsset = 'BTC' | 'ETH' | 'XRP' | 'SOL';

export default function RemovalPage() {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>('ETH');
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleRemovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("No authenticated session located.");

      const { error } = await supabase
        .from('removals')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          asset_type: selectedAsset,
          destination_address: destinationAddress,
          status: 'PENDING'
        });

      if (error) throw error;

      // Reset form variables and trigger the success modal popup
      setAmount('');
      setDestinationAddress('');
      setShowPopup(true);
    } catch (err: any) {
      console.error(err);
      setStatus({ success: false, message: err.message || "Database execution tracking error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      
      {/* SECTION HEADER & SUB-NAV SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Capital Removal Desk</h1>
          <p className="text-xs text-slate-400 mt-1">Initiate settlement payouts from your profile balance node.</p>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-center">
          <span className="px-3 py-1.5 text-xs font-bold bg-sky-500 text-slate-950 rounded-lg shadow-md cursor-default">
            💸 Request
          </span>
          <Link 
            href="/dashboard/removal/status" 
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            📋 Payout Status
          </Link>
        </div>
      </div>

      {/* SECURITY WARNING NOTICE CARD */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-1">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <span>⚠️ Critical Network Verification Warning</span>
        </div>
        <p className="text-xs text-amber-300/80 leading-relaxed">
          Please double-check your external receiving address destination string. Blockchains are immutable; supplying an incorrect address or selecting an incompatible network layer will result in permanent capital loss.
        </p>
      </div>

      {/* ASSET SELECTOR CHIPS */}
      <div className="space-y-2">
        <label className="block text-2xs uppercase tracking-wider text-slate-400 font-bold">Target Settlement Network</label>
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

      {/* SUBMISSION BLOCK */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <form onSubmit={handleRemovalSubmit} className="space-y-4">
          
          {status && !status.success && (
            <div className="p-4 rounded-xl border text-xs font-mono bg-rose-950/30 text-rose-400 border-rose-900/50">
              {status.message}
            </div>
          )}

          <div>
            <label className="block text-2xs uppercase tracking-wider text-slate-400 font-bold mb-2">Destination Wallet Address</label>
            <input
              type="text"
              required
              placeholder={`Paste your external personal ${selectedAsset} address configuration`}
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-2xs uppercase tracking-wider text-slate-400 font-bold mb-2">Amount to Remove ($)</label>
            <input
              type="number"
              required
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold uppercase tracking-wider text-xs py-4 rounded-xl transition-all cursor-pointer mt-2 shadow-lg shadow-sky-950/30"
          >
            {loading ? 'Processing Ledger Line...' : `Confirm ${selectedAsset} Settlement`}
          </button>
        </form>
      </div>

      {/* PROCESSED CONFIRMATION POPUP MODAL OVERLAY */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="mx-auto h-12 w-12 rounded-full bg-sky-500/10 border border-sky-500 flex items-center justify-center text-sky-400 text-lg">
              🔄
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white tracking-tight">Request Processing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your capital payout request has been broadcasted successfully and is currently being processed by our system underwriting ledger.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 font-bold uppercase tracking-wider py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
            >
              Acknowledge File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}