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
  const [lotSize, setLotSize] = useState('0.01'); 
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY');
  const [executing, setExecuting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Navigation state

  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [livePrice, setLivePrice] = useState(ASSETS[0].basePrice);

  // 1. PERSISTENCE ENGINE
  useEffect(() => {
    setIsMounted(true);

    const fetchActivePositions = async () => {
      try {
        const response = await fetch(`/api/trades?userId=${userId}`);
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

  // 2. EXNESS RISK CALCULATION
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
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: enteredLots, 
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
      const response = await fetch('/api/trades/close', {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header / Responsive Navigation Panel */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">InvestGuard</p>
            <h1 className="mt-1 text-xl sm:text-2xl font-black text-white tracking-tight">Trading Arena</h1>
          </div>
          
          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-800">
              Back to Dashboard
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-900 flex flex-col gap-3">
            <Link 
              href="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </header>

      {/* Main Container Workspace Layout */}
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:py-8 lg:px-10 lg:flex-row flex-1">
        
        {/* Left Terminal Section */}
        <section className="w-full lg:w-3/4 flex flex-col gap-6 order-2 lg:order-1">
          <div className="rounded-[24px] sm:rounded-[32px] border border-slate-800 bg-slate-900 p-4 shadow-2xl sm:p-6">
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Market Select</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <select
                    value={selectedAsset.id}
                    onChange={(e) => {
                      const found = ASSETS.find(a => a.id === e.target.value);
                      if (found) setSelectedAsset(found);
                    }}
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm sm:text-base font-semibold outline-none focus:border-sky-500 transition cursor-pointer"
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
                  <span className="text-xs sm:text-sm font-bold text-sky-400 bg-sky-950/50 px-3 py-1.5 rounded-full border border-sky-900/50 font-mono whitespace-nowrap">
                    ${livePrice.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.type === 'FOREX' ? 4 : 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* TradingView Technical Chart Frame Wrapper */}
            <div className="overflow-hidden rounded-[20px] sm:rounded-[28px] border border-slate-800 bg-slate-950 h-[350px] sm:h-[500px]">
              {isMounted ? (
                <AdvancedRealTimeChart key={selectedAsset.id} symbol={selectedAsset.symbol} theme="dark" height="100%" width="100%" allow_symbol_change={false} />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500 uppercase text-xs tracking-widest">Loading Live Feed...</div>
              )}
            </div>
          </div>

          {/* Open Positions Board Panel */}
          <div className="rounded-[24px] sm:rounded-[32px] border border-slate-800 bg-slate-900 p-4 sm:p-6 shadow-2xl">
            <h3 className="text-xs sm:text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Open Positions</h3>
            {positions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8 border border-dashed border-slate-800 rounded-2xl">No active open positions detected.</p>
            ) : (
              <>
                {/* Mobile View: Layout Cards (Hidden on Medium and Up) */}
                <div className="flex flex-col gap-3 md:hidden">
                  {positions.map((pos) => {
                    const matchingAsset = ASSETS.find(a => a.id === pos.symbol) || selectedAsset;
                    const currentMarketPrice = matchingAsset.id === selectedAsset.id ? livePrice : matchingAsset.basePrice;
                    const priceDiff = currentMarketPrice - pos.entryPrice;
                    const totalUnitsTraded = pos.amount * matchingAsset.contractSize;
                    const pnl = pos.type === 'BUY' ? priceDiff * totalUnitsTraded : -priceDiff * totalUnitsTraded;
                    const isProfit = pnl >= 0;
                    const decimals = pos.marketType === 'FOREX' ? 4 : 2;

                    return (
                      <div key={pos.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-base">{pos.symbol}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${pos.type === 'BUY' ? 'bg-green-950 text-green-400 border border-green-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                            {pos.type}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono">
                          <div>Vol: <span className="text-slate-200">{pos.amount} Lots</span></div>
                          <div>Entry: <span className="text-slate-200">${pos.entryPrice.toLocaleString(undefined, { minimumFractionDigits: decimals })}</span></div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                          <span className={`font-mono text-base font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                            {isProfit ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <button onClick={() => handleClosePosition(pos, pnl)} className="bg-slate-900 hover:bg-red-950 hover:text-red-400 text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-800 transition">
                            Close
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop View: Traditional Data Grid (Hidden on Mobile) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[600px]">
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
              </>
            )}
          </div>
        </section>

        {/* Right Sidebar Form Section */}
        <aside className="w-full lg:w-1/4 order-1 lg:order-2">
          <div className="rounded-[24px] sm:rounded-[32px] border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl lg:sticky lg:top-[90px]">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Available Margin</p>
              <p className="mt-2 text-2xl sm:text-3xl font-semibold text-white tracking-tight">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="mb-5 rounded-2xl bg-slate-950 p-3 ring-1 ring-slate-800">
              <div className="grid grid-cols-2 gap-2">
                {(['BUY', 'SELL'] as const).map((option) => (
                  <button
                    key={option} type="button" onClick={() => setMode(option)}
                    className={`rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition tracking-wider ${mode === option ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-xs sm:text-sm font-semibold text-slate-300">
              Volume (Lots)
              <input
                value={lotSize}
                onChange={(event) => setLotSize(event.target.value)}
                type="number" min="0.01" step="0.01"
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 font-mono text-sm"
              />
            </label>

            <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-950 p-4 text-xs sm:text-sm text-slate-400 ring-1 ring-slate-800">
              <div className="flex items-center justify-between gap-2">
                <span>Contract Size</span>
                <span className="font-semibold text-white font-mono text-right">{selectedAsset.contractSize.toLocaleString()} Units</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Estimated Value</span>
                <span className="font-semibold text-white font-mono text-right">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              type="button" onClick={handleExecuteTrade} disabled={executing}
              className="mt-5 w-full rounded-2xl bg-sky-500 px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-950 transition hover:bg-sky-400 disabled:opacity-60 shadow-lg shadow-sky-500/10 uppercase tracking-wider"
            >
              {executing ? 'Processing...' : `${mode} ${selectedAsset.id}`}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}