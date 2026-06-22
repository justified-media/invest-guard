"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { supabase } from '@/utils/supabase';

const SIMULATED_PRICE = 65000;

interface TradingArenaClientProps {
  initialBalance: number;
  userId: string;
}

export default function TradingArenaClient({ initialBalance, userId }: TradingArenaClientProps) {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [amount, setAmount] = useState('0.01');
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY');
  const [executing, setExecuting] = useState(false);

  const totalCost = useMemo(() => {
    const value = Number(amount || '0');
    return Number.isFinite(value) ? value * SIMULATED_PRICE : 0;
  }, [amount]);

  const handleExecuteTrade = async () => {
    const btcAmount = Number(amount);
    if (!btcAmount || btcAmount <= 0) {
      alert('Enter a valid BTC amount.');
      return;
    }

    const tradeValue = btcAmount * SIMULATED_PRICE;
    if (mode === 'BUY' && tradeValue > balance) {
      alert('Insufficient balance to complete this buy order.');
      return;
    }

    setExecuting(true);

    try {
      const newBalance = mode === 'BUY' ? balance - tradeValue : balance + tradeValue;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      const { error: tradeError } = await supabase.from('trades').insert({
        user_id: userId,
        symbol: 'BINANCE:BTCUSDT',
        type: mode,
        amount: btcAmount,
        entry_price: SIMULATED_PRICE,
      });

      if (tradeError) {
        throw tradeError;
      }

      setBalance(newBalance);
      alert(`${mode} order executed successfully for ${btcAmount} BTC at $${SIMULATED_PRICE.toLocaleString()}.`);
    } catch (error) {
      console.error(error);
      alert('Trade failed. Please try again.');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">InvestGuard</p>
            <h1 className="mt-2 text-3xl font-black text-white">Trading Arena</h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-700 hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:px-10 lg:flex-row">
        <section className="lg:w-3/4">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-4 shadow-2xl sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Live chart</p>
                <h2 className="text-2xl font-semibold text-white">BTC/USDT Market</h2>
              </div>
              <div className="rounded-3xl bg-slate-950 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-400 ring-1 ring-slate-800">
                Premium arena
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950">
              <AdvancedRealTimeChart
                symbol="BINANCE:BTCUSDT"
                theme="dark"
                height="600px"
                allow_symbol_change
              />
            </div>
          </div>
        </section>

        <aside className="lg:w-1/4">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Portfolio Balance</p>
              <p className="mt-3 text-3xl font-semibold text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="mt-2 text-sm text-slate-400">Available cash for trading.</p>
            </div>

            <div className="mb-6 rounded-3xl bg-slate-950 p-4 ring-1 ring-slate-800">
              <div className="grid grid-cols-2 gap-2">
                {(['BUY', 'SELL'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMode(option)}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${mode === option ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-sm font-semibold text-slate-300">
              BTC Amount
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                min="0"
                step="0.0001"
                className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
              />
            </label>

            <div className="mt-6 space-y-3 rounded-3xl bg-slate-950 p-5 text-sm text-slate-400 ring-1 ring-slate-800">
              <div className="flex items-center justify-between">
                <span>Entry price</span>
                <span className="font-semibold text-white">${SIMULATED_PRICE.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated cost</span>
                <span className="font-semibold text-white">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Order type</span>
                <span className="font-semibold text-slate-100">{mode}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExecuteTrade}
              disabled={executing}
              className="mt-6 w-full rounded-3xl bg-sky-500 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {executing ? 'Executing...' : `${mode} BTC`}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
