"use client";

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

const SIMULATED_PRICE = 65000;

interface TradingArenaClientProps {
  initialBalance: number;
  userId: string;
}

// Define structure for an open trading position
interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  amount: number;
  entryPrice: number;
}

export default function TradingArenaClient({ initialBalance, userId }: TradingArenaClientProps) {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [amount, setAmount] = useState('0.01');
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY');
  const [executing, setExecuting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // State to manage active open trades
  const [positions, setPositions] = useState<Position[]>([]);

  // Simulated live fluctuating price to show dynamic PnL
  const [livePrice, setLivePrice] = useState(SIMULATED_PRICE);

  useEffect(() => {
    setIsMounted(true);

    // Simulate minor live market movements every 3 seconds to show profit/loss updates
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 150; // Fluctuate price up or down by up to $75
      setLivePrice((prev) => Math.round((prev + change) * 100) / 100);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalCost = useMemo(() => {
    const value = Number(amount || '0');
    return Number.isFinite(value) ? value * livePrice : 0;
  }, [amount, livePrice]);

  const handleExecuteTrade = async () => {
    const btcAmount = Number(amount);
    if (!btcAmount || btcAmount <= 0) {
      alert('Enter a valid BTC amount.');
      return;
    }

    const tradeValue = btcAmount * livePrice;
    if (mode === 'BUY' && tradeValue > balance) {
      alert('Insufficient balance to complete this buy order.');
      return;
    }

    setExecuting(true);

    try {
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: btcAmount,
          type: mode,
          symbol: 'BINANCE:BTCUSDT',
          entry_price: livePrice,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Trade failed.');
      }

      // 1. Update cash balance from server response
      setBalance(result.balance ?? balance);

      // 2. Add to active positions state so the user can track it visually
      const newPosition: Position = {
        id: Math.random().toString(36).substring(2, 9), // unique frontend ID
        symbol: 'BTC/USDT',
        type: mode,
        amount: btcAmount,
        entryPrice: livePrice
      };
      setPositions((prev) => [newPosition, ...prev]);

      alert(`${mode} order executed successfully for ${btcAmount} BTC.`);
    } catch (error) {
      console.error(error);
      alert('Trade failed. Please try again.');
    } finally {
      setExecuting(false);
    }
  };

  // Logic to calculate PnL and close out an active position
  const handleClosePosition = async (position: Position, currentPnL: number) => {
    if (!confirm(`Are you sure you want to close this ${position.type} position?`)) return;

    // Calculate return value: Buy returns (Value + PnL), Sell returns (Value + PnL)
    const originalValue = position.amount * position.entryPrice;
    const finalSettlement = originalValue + currentPnL;

    try {
      // In a production app, you would send a POST to /api/close-trade here
      // For instant frontend simulation: update balance and wipe position
      setBalance((prev) => prev + finalSettlement);
      setPositions((prev) => prev.filter((p) => p.id !== position.id));
      alert(`Position closed! Settlement of $${finalSettlement.toLocaleString(undefined, {minimumFractionDigits: 2})} applied to your balance.`);
    } catch (err) {
      alert('Failed to close position.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header Banner */}
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
        {/* Left Interactive Column (Chart & Positions Feed) */}
        <section className="lg:w-3/4 flex flex-col gap-6">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-4 shadow-2xl sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Live chart</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-white">BTC/USDT Market</h2>
                  <span className="text-sm font-bold text-sky-400 bg-sky-950/50 px-2.5 py-0.5 rounded-full border border-sky-900/50 animate-pulse">
                    ${livePrice.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-950 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-400 ring-1 ring-slate-800">
                Premium arena
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950">
              {isMounted ? (
                <AdvancedRealTimeChart
                  symbol="BINANCE:BTCUSDT"
                  theme="dark"
                  height="600px"
                  allow_symbol_change
                />
              ) : (
                <div className="flex h-[600px] w-full items-center justify-center text-sm uppercase tracking-widest text-slate-500">
                  Loading Live Chart...
                </div>
              )}
            </div>
          </div>

          {/* NEW SECTION: Live Open Positions Dashboard Feed */}
          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider text-slate-400 text-xs">Open Positions</h3>
            {positions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6 border border-dashed border-slate-800 rounded-2xl">No open trading positions. Execute an order on the panel to start tracking live PnL.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-medium">
                      <th className="pb-3">Market</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Entry Price</th>
                      <th className="pb-3">Live PnL</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {positions.map((pos) => {
                      // PnL Formula: Buy profits when price goes up. Sell profits when price goes down.
                      const priceDiff = livePrice - pos.entryPrice;
                      const pnl = pos.type === 'BUY' ? priceDiff * pos.amount : -priceDiff * pos.amount;
                      const isProfit = pnl >= 0;

                      return (
                        <tr key={pos.id} className="text-slate-200">
                          <td className="py-3.5 font-semibold text-white">{pos.symbol}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${pos.type === 'BUY' ? 'bg-green-950 text-green-400 border border-green-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                              {pos.type}
                            </span>
                          </td>
                          <td className="py-3.5 font-mono">{pos.amount} BTC</td>
                          <td className="py-3.5 text-slate-400">${pos.entryPrice.toLocaleString()}</td>
                          <td className={`py-3.5 font-bold font-mono ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                            {isProfit ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleClosePosition(pos, pnl)}
                              className="bg-slate-950 hover:bg-red-950 hover:text-red-400 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-800 hover:border-red-900 transition"
                            >
                              Close Position
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Right Interaction Sidebar */}
        <aside className="lg:w-1/4">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-6 shadow-2xl position-sticky top-6">
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
                <span className="font-semibold text-white">${livePrice.toLocaleString()}</span>
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