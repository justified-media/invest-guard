"use client";

import { useState, useEffect } from 'react';
// FIX: Import the dedicated browser client creator for App Router cookie syncing
import { createBrowserClient } from '@supabase/ssr';

// FIX: Instantiate the client using createBrowserClient so it reads the server layout cookies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

interface Plan {
  id: number;
  name: string;
  deposit: number;
  payout: number;
  multiplier: string;
  badge?: string;
  popular?: boolean;
}

const INVESTMENT_PLANS: Plan[] = [
  { id: 1, name: "Starter Tier", deposit: 500, payout: 2500, multiplier: "5x ROI" },
  { id: 2, name: "Silver Tier", deposit: 1000, payout: 5000, multiplier: "5x ROI", badge: "Great Value" },
  { id: 3, name: "Gold Premium", deposit: 2500, payout: 10000, multiplier: "4x ROI", popular: true },
  { id: 4, name: "Platinum Pro", deposit: 5000, payout: 20000, multiplier: "4x ROI" },
  { id: 5, name: "VIP Executive", deposit: 10000, payout: 50000, multiplier: "5x ROI", badge: "Max Elite" },
];

const CRYPTO_WALLETS = [
  { id: 'BTC', name: 'Bitcoin (BTC)', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', network: 'BTC Network' },
  { id: 'BINANCE', name: 'Binance Pay / USDT', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', network: 'BSC (BEP20)' },
  { id: 'XRP', name: 'Ripple (XRP)', address: 'r9cZA1mLm5RfZEydQZfrfKjZ3xg88SGZM5', network: 'Ripple Network', tag: '1029384' },
  { id: 'ETH', name: 'Ethereum (ETH)', address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', network: 'ERC20' },
];

export default function InvestmentPlansClient() {
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [step, setStep] = useState<'GRID' | 'PAYMENT'>('GRID');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTO_WALLETS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAuthenticatedUser() {
      try {
        // This will now successfully fetch the session cookie passing from layout.tsx
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          return;
        }

        const currentUserId = session.user.id;
        setUserId(currentUserId);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username, balance')
          .eq('id', currentUserId)
          .single();

        if (error) throw error;

        if (profile) {
          setUserName(profile.username || session.user.email?.split('@')[0] || "Investor");
          setBalance(profile.balance || 0);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    getAuthenticatedUser();
  }, []);

  const handleInitializeCheckout = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep('PAYMENT');
  };

  const handleFinalizeDepositRequest = async () => {
    if (!selectedPlan || !userId) return;
    setSubmitting(true);

    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planName: selectedPlan.name,
          depositAmount: selectedPlan.deposit,
          expectedPayout: selectedPlan.payout,
          cryptoMethod: selectedCrypto.id,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error || 'Request processing failed.');

      alert(`Your payment request for ${selectedPlan.name} has been broadcast to administration for validation!`);
      setStep('GRID');
      setSelectedPlan(null);
    } catch (err: any) {
      alert(err.message || "Error submitting investment verification.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-sky-500" />
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Loading Investment Options...</p>
      </div>
    );
  }

  return (
    <div className="text-slate-100 px-4 py-4 sm:px-6 lg:px-8">
      {/* Upper Content Frame Header */}
      <div className="mx-auto max-w-4xl text-center mb-10">
        <p className="text-xs font-bold tracking-[0.32em] uppercase text-sky-400">InvestGuard Systems</p>
        
        <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">{userName}</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {step === 'GRID' ? 'Select an investment tier below to begin compounding portfolio revenue.' : 'Complete deposit verification below to submit to admin.'}
        </p>
        
        <div className="mt-5 inline-flex items-center gap-3 bg-slate-900 border border-slate-800/80 px-5 py-2.5 rounded-full font-mono text-xs sm:text-sm shadow-xl">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400 font-sans font-medium">Available Balance:</span>
          </div>
          <span className="text-emerald-400 font-black">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {step === 'GRID' ? (
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INVESTMENT_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-3xl p-6 bg-slate-900/60 border border-slate-800 transition shadow-2xl ${
                plan.popular ? 'border-sky-500/60 ring-1 ring-sky-500/10' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-sky-500 px-3 py-0.5 text-2xs font-black text-slate-950 uppercase tracking-wider">
                  Popular Plan
                </span>
              )}
              {plan.badge && !plan.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-slate-800 border border-slate-700 px-3 py-0.5 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                  {plan.badge}
                </span>
              )}

              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-black text-white">{plan.name}</h3>
                  <span className="font-mono text-2xs font-bold bg-sky-950/40 text-sky-400 px-2 py-0.5 rounded border border-sky-900/50">
                    {plan.multiplier}
                  </span>
                </div>
                <div className="mt-5 space-y-1">
                  <p className="text-2xs uppercase tracking-wider text-slate-500 font-bold">Plan Value</p>
                  <p className="text-3xl font-black text-white font-mono">${plan.deposit.toLocaleString()}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">Guaranteed Return</span>
                  <span className="font-bold text-green-400 font-mono">${plan.payout.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleInitializeCheckout(plan)}
                className="mt-6 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-sky-500 hover:bg-sky-400 text-slate-950 transition shadow-lg shadow-sky-500/5"
              >
                Purchase Plan
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-2xl bg-slate-900 border border-slate-800 rounded-[32px] p-5 sm:p-8 shadow-2xl">
          <button 
            type="button" 
            onClick={() => setStep('GRID')}
            disabled={submitting}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider mb-6 transition disabled:opacity-40"
          >
            {`← Back to Plans`}
          </button>

          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Plan Selected</p>
              <h4 className="text-base font-bold text-white mt-0.5">{selectedPlan?.name}</h4>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-bold uppercase">Required Deposit</p>
              <p className="text-lg font-black text-sky-400 font-mono mt-0.5">${selectedPlan?.deposit.toLocaleString()}</p>
            </div>
          </div>

          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Select Payment Gateway</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {CRYPTO_WALLETS.map((coin) => (
              <button
                key={coin.id} 
                type="button" 
                onClick={() => setSelectedCrypto(coin)}
                disabled={submitting}
                className={`py-3 px-2 rounded-xl text-xs font-bold tracking-wide transition border ${
                  selectedCrypto.id === coin.id 
                    ? 'bg-sky-500 text-slate-950 border-transparent font-black shadow-lg shadow-sky-500/10' 
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                } disabled:opacity-50`}
              >
                {coin.id}
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-4">
            <div>
              <p className="text-2xs uppercase tracking-wider text-slate-500 font-bold">Network Channel</p>
              <p className="text-xs text-slate-200 font-bold mt-1 font-mono">{selectedCrypto.network}</p>
            </div>
            <div>
              <p className="text-2xs uppercase tracking-wider text-slate-500 font-bold">Deposit Address</p>
              <div className="flex items-center gap-2 mt-1.5 bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-hidden">
                <span className="text-xs text-slate-300 font-mono break-all selection:bg-sky-500/30 select-all flex-1">{selectedCrypto.address}</span>
              </div>
            </div>
            {selectedCrypto.tag && (
              <div>
                <p className="text-2xs uppercase tracking-wider text-red-400 font-bold">Required Destination Tag</p>
                <p className="text-sm text-white font-black font-mono mt-1">{selectedCrypto.tag}</p>
              </div>
            )}
          </div>

          <div className="mt-6 p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-2xs sm:text-xs text-amber-400 leading-relaxed">
            ⚠️ Transfer exactly the corresponding token value equivalent to <strong>${selectedPlan?.deposit}</strong>. Your confirmation request broadcasts straight to admin panels for network validation.
          </div>

          <button
            type="button"
            onClick={handleFinalizeDepositRequest}
            disabled={submitting}
            className="mt-6 w-full bg-green-500 hover:bg-green-400 text-slate-950 py-4 rounded-xl text-sm font-black uppercase tracking-wider transition disabled:bg-slate-800 disabled:text-slate-500 flex items-center justify-center gap-2 shadow-lg shadow-green-500/10"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
                <span>Your transaction is being processed...</span>
              </>
            ) : (
              'I Have Made Payment'
            )}
          </button>
        </div>
      )}
    </div>
  );
}