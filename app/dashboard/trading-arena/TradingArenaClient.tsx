"use client";

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

interface TradingArenaClientProps {
  initialBalance: number;
  userId: string;
}

interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  amount: number; // Stored as Lot Size (e.g., 0.01)
  entryPrice: number;
  marketType: 'CRYPTO' | 'FOREX' | 'INDEX' | 'COMMODITY';
}

const ASSETS = [
  // --- FOREX PAIRS (Standard Lot = 100,000 Units) ---
  { id: 'EUR/USD', name: 'Euro / US Dollar', symbol: 'FX:EURUSD', basePrice: 1.0825, type: 'FOREX', contractSize: 100000 },
  { id: 'GBP/USD', name: 'British Pound / US Dollar', symbol: 'FX:GBPUSD', basePrice: 1.2740, type: 'FOREX', contractSize: 100000 },
  { id: 'USD/JPY', name: 'US Dollar / Japanese Yen', symbol: 'FX:USDJPY', basePrice: 156.45, type: 'FOREX', contractSize: 100000 },
  
  // --- CRYPTO ASSETS (Standard Lot = 1 Unit/Coin) ---
  { id: 'BTC', name: 'Bitcoin', symbol: 'BINANCE:BTCUSDT', basePrice: 65000, type: 'CRYPTO', contractSize: 1 },
  { id: 'ETH', name: 'Ethereum', symbol: 'BINANCE:ETHUSDT', basePrice: 3500, type: 'CRYPTO', contractSize: 1 },
  { id: 'SOL', name: 'Solana', symbol: 'BINANCE:SOLUSDT', basePrice: 150, type: 'CRYPTO', contractSize: 1 },

  // --- COMMODITIES (Standard Lot sizes vary, e.g., Gold = 100 Ounces) ---
  { id: 'XAU/USD', name: 'Gold / US Dollar', symbol: 'TVC:GOLD', basePrice: 2330.50, type: 'COMMODITY', contractSize: 100 },
  { id: 'USOIL', name: 'Crude Oil WTI', symbol: 'TVC:USOIL', basePrice: 78.40, type: 'COMMODITY', contractSize: 1000 },
];

export default function TradingArenaClient({ initialBalance, userId }: TradingArenaClientProps) {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [lotSize, setLotSize] = useState('0.01'); // Exness style input defaults to minimum 0.01 micro-lot
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY');
  const [executing, setExecuting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);

  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [livePrice, setLivePrice] = useState(ASSETS[0].basePrice);

  // 1. PERSISTENCE ENGINE: Fetch active open positions from your DB on mount
  useEffect(() => {
    setIsMounted(true);

    const fetchActivePositions = async () => {
      try {
        const response = await fetch(`/api/positions?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setPositions(data.positions || []);
        }
      } catch (err) {
        console.error("Failed loading persistent trades:", err);
      }
    };

    fetchActivePositions();
  }, [userId]);

  useEffect(() => {
    setLivePrice(selectedAsset.basePrice);
  }, [selectedAsset]);

  // Live price fluctuation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrice((prev) => {
        let volatilityFactor = 0.0015;
        if (selectedAsset.type === 'FOREX') volatilityFactor = 0.0002;

        const volatility = prev * volatilityFactor; 
        const change = (Math.random() - 0.5) * volatility;
        
        const decimals = (selectedAsset.type === 'FOREX' || prev < 5) ? 4 : 2;
        return Number((prev + change).toFixed(decimals));
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [selectedAsset]);

  // 2. EXNESS RISK CALCULATION: Margin value = Lot Size * Contract Size * Asset Price
  const totalCost = useMemo(() => {
    const lots = Number(lotSize || '0');
    if (!Number.isFinite(lots) || lots <= 0) return 0;
    
    const actualUnits = lots * selectedAsset.contractSize;
    return actualUnits * livePrice;
  }, [lotSize, selectedAsset, livePrice]);

  const handleExecuteTrade = async () => {
    const enteredLots = Number(lotSize);
    if (!enteredLots || enteredLots < 0.01) {
      alert(`Minimum acceptable trade volume is 0.01 lots.`);
      return;
    }

    if (mode === 'BUY' && totalCost > balance) {
      alert('Insufficient available margin check portfolio balance.');
      return;
    }

    setExecuting(true);

    try {
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: enteredLots, // saving actual requested lot layout
          type: mode,
          symbol: selectedAsset.id,
          entry_price: livePrice,
          marketType: selectedAsset.type,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Trade processing failed.');
      }

      setBalance(result.balance ?? balance);

      // Add to layout state locally while it lives securely in your database
      const newPosition: Position = {
        id: result.tradeId || Math.random().toString(36).substring(2, 9),
        symbol: selectedAsset.id,
        type: mode,
        amount: enteredLots,
        entryPrice: livePrice,
        marketType: selectedAsset.type as any
      };
      setPositions((prev) => [newPosition, ...prev]);

      alert(`Exness ${mode} order executed for ${enteredLots} Lots of ${selectedAsset.id}.`);
    } catch (error) {
      console.error(error);
      alert('Trade execution failed.');
    } finally {
      setExecuting(false);
    }
  };

  const handleClosePosition = async (position: Position, currentPnL: number) => {
    if (!confirm(`Are you sure you want to close this position?`)) return;

    try {
      const response = await fetch('/api/trade/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, positionId: position.id, pnl: currentPnL }),
      });

      if (!response.ok) throw new Error("Could not drop from backend table state.");

      const assetConfig = ASSETS.find(a => a.id === position.symbol) || selectedAsset;
      const originalMarginCost = position.amount * assetConfig.contractSize * position.entryPrice;
      const settlementValue = originalMarginCost + currentPnL;

      setBalance((prev) => prev + settlementValue);
      setPositions((prev) => prev.filter((p) => p.id !== position.id));
    } catch (err) {
      alert("Error closing position securely.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">InvestGuard</p>
            <h1 className="mt-2 text-3xl font-black text-white">Trading Arena</h1>
          </div>
          <Link href="/dashboard" className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-semibold transition hover:bg-slate-800">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:px-10 lg:flex-row">
        {/* Left Terminal Section */}
        <section className="lg:w-3/4 flex flex-col gap-6">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-4 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Market Select</p>
                <div className="flex items-center gap-3 mt-2">
                  <select
                    value={selectedAsset.id}
                    onChange={(e) => {
                      const found = ASSETS.find(a => a.id === e.target.value);
                      if (found) setSelectedAsset(found);
                    }}
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 font-semibold outline-none focus:border-sky-500 transition cursor-pointer"
                  >
                    <optgroup label="Forex Currency Pairs" className="bg-slate-900">
                      {ASSETS.filter(a => a.type === 'FOREX').map(asset => (
                        <option key={asset.id} value={asset.id}>{asset.name} ({asset.id})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Crypto Assets" className="bg-slate-900">
                      {ASSETS.filter(a => a.type === 'CRYPTO').map(asset => (
                        <option key={asset.id} value={asset.id}>{asset.name} ({asset.id})</option>
                      ))}
                    </optgroup>
                  </select>
                  <span className="text-sm font-bold text-sky-400 bg-sky-950/50 px-2.5 py-1.5 rounded-full border border-sky-900/50 font-mono">
                    ${livePrice.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.type === 'FOREX' ? 4 : 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950">
              {isMounted ? (
                <AdvancedRealTimeChart key={selectedAsset.id} symbol={selectedAsset.symbol} theme="dark" height="500px" allow_symbol_change={false} />
              ) : (
                <div className="flex h-[500px] items-center justify-center text-slate-500 uppercase text-xs tracking-widest">Loading Live Feed...</div>
              )}
            </div>
          </div>

          {/* Open Positions Board (Survives Browser Refreshes Now!) */}
          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Open Positions</h3>
            {positions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6 border border-dashed border-slate-800 rounded-2xl">No active open positions detected.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-medium">
                      <th className="pb-3">Market</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Volume (Lots)</th>
                      <th className="pb-3">Entry Price</th>
                      <th className="pb-3">Live PnL</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {positions.map((pos) => {
                      const matchingAsset = ASSETS.find(a => a.id === pos.symbol) || selectedAsset;
                      const currentMarketPrice = matchingAsset.id === selectedAsset.id ? livePrice : matchingAsset.basePrice;
                      
                      const priceDiff = currentMarketPrice - pos.entryPrice;
                      // Exness style Profit Calculation: Pip Diff * Lot Size * Contract size
                      const totalUnitsTraded = pos.amount * matchingAsset.contractSize;
                      const pnl = pos.type === 'BUY' ? priceDiff * totalUnitsTraded : -priceDiff * totalUnitsTraded;
                      
                      const isProfit = pnl >= 0;
                      const decimals = pos.marketType === 'FOREX' ? 4 : 2;

                      return (
                        <tr key={pos.id} className="text-slate-200">
                          <td className="py-3.5 font-semibold text-white">{pos.symbol}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${pos.type === 'BUY' ? 'bg-green-950 text-green-400 border border-green-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                              {pos.type}
                            </span>
                          </td>
                          <td className="py-3.5 font-mono">{pos.amount} Lots</td>
                          <td className="py-3.5 text-slate-400 font-mono">${pos.entryPrice.toLocaleString(undefined, { minimumFractionDigits: decimals })}</td>
                          <td className={`py-3.5 font-bold font-mono ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                            {isProfit ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 text-right">
                            <button onClick={() => handleClosePosition(pos, pnl)} className="bg-slate-950 hover:bg-red-950 hover:text-red-400 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-800 transition">
                              Close
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

        {/* Right Sidebar Form */}
        <aside className="lg:w-1/4">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-6 shadow-2xl sticky top-6">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Available Margin</p>
              <p className="mt-3 text-3xl font-semibold text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="mb-6 rounded-3xl bg-slate-950 p-4 ring-1 ring-slate-800">
              <div className="grid grid-cols-2 gap-2">
                {(['BUY', 'SELL'] as const).map((option) => (
                  <button
                    key={option} type="button" onClick={() => setMode(option)}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${mode === option ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-sm font-semibold text-slate-300">
              Volume (Lots)
              <input
                value={lotSize}
                onChange={(event) => setLotSize(event.target.value)}
                type="number" min="0.01" step="0.01"
                className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 font-mono"
              />
            </label>

            <div className="mt-6 space-y-3 rounded-3xl bg-slate-950 p-5 text-sm text-slate-400 ring-1 ring-slate-800">
              <div className="flex items-center justify-between">
                <span>Contract Size</span>
                <span className="font-semibold text-white font-mono">{selectedAsset.contractSize.toLocaleString()} Units</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Value</span>
                <span className="font-semibold text-white font-mono">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              type="button" onClick={handleExecuteTrade} disabled={executing}
              className="mt-6 w-full rounded-3xl bg-sky-500 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
            >
              {executing ? 'Processing...' : `${mode} ${selectedAsset.id}`}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}