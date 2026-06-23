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
  amount: number; 
  entryPrice: number;
  marketType: 'CRYPTO' | 'FOREX' | 'INDEX' | 'COMMODITY';
}

// 50+ High-Turnover Professional Global Trading Assets
const ASSETS = [
  // --- FOREX CURRENCY PAIRS (Contract Size: 100,000) ---
  { id: 'EUR/USD', name: 'Euro / US Dollar', symbol: 'FX:EURUSD', basePrice: 1.0825, type: 'FOREX', contractSize: 100000 },
  { id: 'GBP/USD', name: 'British Pound / US Dollar', symbol: 'FX:GBPUSD', basePrice: 1.2740, type: 'FOREX', contractSize: 100000 },
  { id: 'USD/JPY', name: 'US Dollar / Japanese Yen', symbol: 'FX:USDJPY', basePrice: 156.45, type: 'FOREX', contractSize: 100000 },
  { id: 'AUD/USD', name: 'Australian Dollar / US Dollar', symbol: 'FX:AUDUSD', basePrice: 0.6650, type: 'FOREX', contractSize: 100000 },
  { id: 'USD/CAD', name: 'US Dollar / Canadian Dollar', symbol: 'FX:USDCAD', basePrice: 1.3620, type: 'FOREX', contractSize: 100000 },
  { id: 'USD/CHF', name: 'US Dollar / Swiss Franc', symbol: 'FX:USDCHF', basePrice: 0.8950, type: 'FOREX', contractSize: 100000 },
  { id: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', symbol: 'FX:NZDUSD', basePrice: 0.6120, type: 'FOREX', contractSize: 100000 },
  { id: 'EUR/GBP', name: 'Euro / British Pound', symbol: 'FX:EURGBP', basePrice: 0.8510, type: 'FOREX', contractSize: 100000 },
  { id: 'EUR/JPY', name: 'Euro / Japanese Yen', symbol: 'FX:EURJPY', basePrice: 169.30, type: 'FOREX', contractSize: 100000 },
  { id: 'GBP/JPY', name: 'British Pound / Japanese Yen', symbol: 'FX:GBPJPY', basePrice: 199.10, type: 'FOREX', contractSize: 100000 },
  { id: 'AUD/JPY', name: 'Australian Dollar / Japanese Yen', symbol: 'FX:AUDJPY', basePrice: 104.20, type: 'FOREX', contractSize: 100000 },
  { id: 'EUR/CHF', name: 'Euro / Swiss Franc', symbol: 'FX:EURCHF', basePrice: 0.9710, type: 'FOREX', contractSize: 100000 },
  { id: 'GBP/CHF', name: 'British Pound / Swiss Franc', symbol: 'FX:GBPCHF', basePrice: 1.1415, type: 'FOREX', contractSize: 100000 },
  { id: 'CHF/JPY', name: 'Swiss Franc / Japanese Yen', symbol: 'FX:CHFJPY', basePrice: 174.60, type: 'FOREX', contractSize: 100000 },
  { id: 'EUR/CAD', name: 'Euro / Canadian Dollar', symbol: 'FX:EURCAD', basePrice: 1.4750, type: 'FOREX', contractSize: 100000 },
  { id: 'AUD/CAD', name: 'Australian Dollar / Canadian Dollar', symbol: 'FX:AUDCAD', basePrice: 0.9060, type: 'FOREX', contractSize: 100000 },
  { id: 'NZD/JPY', name: 'New Zealand Dollar / Japanese Yen', symbol: 'FX:NZDJPY', basePrice: 95.80, type: 'FOREX', contractSize: 100000 },
  { id: 'CAD/JPY', name: 'Canadian Dollar / Japanese Yen', symbol: 'FX:CADJPY', basePrice: 114.80, type: 'FOREX', contractSize: 100000 },

  // --- CRYPTOCURRENCIES (Contract Size: 1) ---
  { id: 'BTC', name: 'Bitcoin', symbol: 'BINANCE:BTCUSDT', basePrice: 65200, type: 'CRYPTO', contractSize: 1 },
  { id: 'ETH', name: 'Ethereum', symbol: 'BINANCE:ETHUSDT', basePrice: 3480, type: 'CRYPTO', contractSize: 1 },
  { id: 'SOL', name: 'Solana', symbol: 'BINANCE:SOLUSDT', basePrice: 148.50, type: 'CRYPTO', contractSize: 1 },
  { id: 'BNB', name: 'BNB Coin', symbol: 'BINANCE:BNBUSDT', basePrice: 580.20, type: 'CRYPTO', contractSize: 1 },
  { id: 'XRP', name: 'Ripple', symbol: 'BINANCE:XRPUSDT', basePrice: 0.4920, type: 'CRYPTO', contractSize: 1 },
  { id: 'ADA', name: 'Cardano', symbol: 'BINANCE:ADAUSDT', basePrice: 0.3850, type: 'CRYPTO', contractSize: 1 },
  { id: 'DOGE', name: 'Dogecoin', symbol: 'BINANCE:DOGEUSDT', basePrice: 0.1340, type: 'CRYPTO', contractSize: 1 },
  { id: 'DOT', name: 'Polkadot', symbol: 'BINANCE:DOTUSDT', basePrice: 6.25, type: 'CRYPTO', contractSize: 1 },
  { id: 'MATIC', name: 'Polygon', symbol: 'BINANCE:MATICUSDT', basePrice: 0.615, type: 'CRYPTO', contractSize: 1 },
  { id: 'LINK', name: 'Chainlink', symbol: 'BINANCE:LINKUSDT', basePrice: 14.40, type: 'CRYPTO', contractSize: 1 },
  { id: 'AVAX', name: 'Avalanche', symbol: 'BINANCE:AVAXUSDT', basePrice: 28.90, type: 'CRYPTO', contractSize: 1 },
  { id: 'SHIB', name: 'Shiba Inu', symbol: 'BINANCE:SHIBUSDT', basePrice: 0.000018, type: 'CRYPTO', contractSize: 1 },
  { id: 'LTC', name: 'Litecoin', symbol: 'BINANCE:LTCUSDT', basePrice: 74.30, type: 'CRYPTO', contractSize: 1 },
  { id: 'UNI', name: 'Uniswap', symbol: 'BINANCE:UNIUSDT', basePrice: 7.10, type: 'CRYPTO', contractSize: 1 },
  { id: 'NEAR', name: 'NEAR Protocol', symbol: 'BINANCE:NEARUSDT', basePrice: 4.85, type: 'CRYPTO', contractSize: 1 },
  { id: 'APT', name: 'Aptos', symbol: 'BINANCE:APTUSDT', basePrice: 7.20, type: 'CRYPTO', contractSize: 1 },

  // --- COMMODITIES & METALS ---
  { id: 'XAU/USD', name: 'Gold Spot / US Dollar', symbol: 'TVC:GOLD', basePrice: 2325.40, type: 'COMMODITY', contractSize: 100 },
  { id: 'XAG/USD', name: 'Silver Spot / US Dollar', symbol: 'TVC:SILVER', basePrice: 29.55, type: 'COMMODITY', contractSize: 5000 },
  { id: 'USOIL', name: 'Crude Oil WTI', symbol: 'TVC:USOIL', basePrice: 78.65, type: 'COMMODITY', contractSize: 1000 },
  { id: 'UKOIL', name: 'Brent Crude Oil', symbol: 'TVC:UKOIL', basePrice: 82.40, type: 'COMMODITY', contractSize: 1000 },
  { id: 'NGAS', name: 'Natural Gas', symbol: 'TVC:NATURALGAS', basePrice: 2.75, type: 'COMMODITY', contractSize: 10000 },

  // --- INDICES (Contract Size: 1) ---
  { id: 'US30', name: 'Dow Jones Industrial 30', symbol: 'TVC:DJI', basePrice: 39150, type: 'INDEX', contractSize: 1 },
  { id: 'SPX500', name: 'S&P 500 Index', symbol: 'TVC:SPX', basePrice: 5430, type: 'INDEX', contractSize: 1 },
  { id: 'NAS100', name: 'Nasdaq 100 Tech', symbol: 'TVC:NDX', basePrice: 19650, type: 'INDEX', contractSize: 1 },
  { id: 'GER40', name: 'Germany DAX 40', symbol: 'XETR:DAX', basePrice: 18120, type: 'INDEX', contractSize: 1 },
  { id: 'UK100', name: 'UK FTSE 100', symbol: 'TVC:UKX', basePrice: 8210, type: 'INDEX', contractSize: 1 },
  { id: 'JPN225', name: 'Nikkei 225 Yen', symbol: 'TVC:NI225', basePrice: 38600, type: 'INDEX', contractSize: 1 },
];

export default function TradingArenaClient({ initialBalance, userId }: TradingArenaClientProps) {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [lotSize, setLotSize] = useState('0.01'); 
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY');
  const [executing, setExecuting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  
  // UI Dynamic Menus
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assetSearchOpen, setAssetSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'FOREX' | 'CRYPTO' | 'COMMODITY' | 'INDEX'>('ALL');

  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [livePrice, setLivePrice] = useState(ASSETS[0].basePrice);

  // 1. DATA MOUNT PERSISTENCE
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
        let volatilityFactor = 0.0012;
        if (selectedAsset.type === 'FOREX') volatilityFactor = 0.00015;

        const volatility = prev * volatilityFactor; 
        const change = (Math.random() - 0.5) * volatility;
        
        const decimals = (selectedAsset.type === 'FOREX' || prev < 5) ? 4 : 2;
        return Number((prev + change).toFixed(decimals));
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [selectedAsset]);

  // 2. EXNESS COMPUTATION
  const totalCost = useMemo(() => {
    const lots = Number(lotSize || '0');
    if (!Number.isFinite(lots) || lots <= 0) return 0;
    return lots * selectedAsset.contractSize * livePrice;
  }, [lotSize, selectedAsset, livePrice]);

  // Dynamic Search Engine filtering mechanics
  const filteredAssets = useMemo(() => {
    return ASSETS.filter(asset => {
      const matchesSearch = asset.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            asset.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTabFilter === 'ALL' || asset.type === activeTabFilter;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTabFilter]);

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
      if (!response.ok || result.error) throw new Error(result.error || 'Processing failed.');

      setBalance(result.balance ?? balance);
      setPositions((prev) => [{
        id: result.tradeId || Math.random().toString(36).substring(2, 9),
        symbol: selectedAsset.id,
        type: mode,
        amount: enteredLots,
        entryPrice: livePrice,
        marketType: selectedAsset.type as any
      }, ...prev]);

      alert(`Exness ${mode} order executed for ${enteredLots} Lots of ${selectedAsset.id}.`);
    } catch (error) {
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
      if (!response.ok) throw new Error("Could not clear state.");

      const assetConfig = ASSETS.find(a => a.id === position.symbol) || selectedAsset;
      const originalMarginCost = position.amount * assetConfig.contractSize * position.entryPrice;
      
      setBalance((prev) => prev + (originalMarginCost + currentPnL));
      setPositions((prev) => prev.filter((p) => p.id !== position.id));
    } catch (err) {
      alert("Error closing position securely.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      
      {/* Header and Mobile Hamburger Navigation Layout */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500 font-bold">InvestGuard</p>
            <h1 className="mt-1 text-xl sm:text-2xl font-black text-white tracking-tight">Trading Arena</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-800">
              Back to Dashboard
            </Link>
          </div>

          <button 
            type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-900 flex flex-col gap-2">
            <Link href="/dashboard" className="w-full text-center rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm font-semibold">
              Back to Dashboard
            </Link>
          </div>
        )}
      </header>

      {/* Main Framework Viewport Workspace Grid */}
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:py-8 lg:px-10 lg:flex-row flex-1">
        
        {/* Left Terminal Section */}
        <section className="w-full lg:w-3/4 flex flex-col gap-6 order-2 lg:order-1">
          <div className="rounded-[24px] sm:rounded-[32px] border border-slate-800 bg-slate-900 p-4 shadow-2xl sm:p-6">
            
            {/* Asset Selection Bar Display Element */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-bold">Active Symbol</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setAssetSearchOpen(true)}
                    className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white border border-slate-800 rounded-xl px-4 py-2 text-sm sm:text-base font-bold transition group"
                  >
                    <span>{selectedAsset.id}</span>
                    <span className="text-xs text-slate-500 font-normal hidden sm:inline">— {selectedAsset.name}</span>
                    <svg className="h-4 w-4 text-slate-500 group-hover:text-sky-400 ml-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>

                  <span className="text-xs sm:text-sm font-bold text-sky-400 bg-sky-950/50 px-3 py-1.5 rounded-full border border-sky-900/50 font-mono whitespace-nowrap animate-pulse">
                    ${livePrice.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.type === 'FOREX' ? 4 : 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* TradingView Component Framework */}
            <div className="overflow-hidden rounded-[20px] sm:rounded-[28px] border border-slate-800 bg-slate-950 h-[360px] sm:h-[520px]">
              {isMounted ? (
                <AdvancedRealTimeChart key={selectedAsset.id} symbol={selectedAsset.symbol} theme="dark" height="100%" width="100%" allow_symbol_change={false} />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500 uppercase text-xs tracking-widest font-mono">Connecting Node...</div>
              )}
            </div>
          </div>

          {/* Open Positions Board Container */}
          <div className="rounded-[24px] sm:rounded-[32px] border border-slate-800 bg-slate-900 p-4 sm:p-6 shadow-2xl">
            <h3 className="text-xs sm:text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Open Positions</h3>
            {positions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8 border border-dashed border-slate-800 rounded-2xl">No active open positions detected.</p>
            ) : (
              <>
                {/* Mobile View: Structural Responsive Layout Cards */}
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
                          <div>Size: <span className="text-slate-200">{pos.amount} Lots</span></div>
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

                {/* Tablet / Desktop Data Grid Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[620px]">
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

        {/* Right Sidebar Interactive Form Layout Panel */}
        <aside className="w-full lg:w-1/4 order-1 lg:order-2">
          <div className="rounded-[24px] sm:rounded-[32px] border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl lg:sticky lg:top-[96px]">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-bold">Available Margin</p>
              <p className="mt-2 text-2xl sm:text-3xl font-semibold text-white tracking-tight font-mono">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="mb-5 rounded-2xl bg-slate-950 p-3 ring-1 ring-slate-800">
              <div className="grid grid-cols-2 gap-2">
                {(['BUY', 'SELL'] as const).map((option) => (
                  <button
                    key={option} type="button" onClick={() => setMode(option)}
                    className={`rounded-xl py-2.5 text-xs sm:text-sm font-bold transition tracking-wider ${mode === option ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
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

      {/* SEARCH SYSTEM MODAL OVERLAY: Responsive Asset Selection Center */}
      {assetSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl overflow-hidden">
            
            {/* Header Control Panel */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white">Asset Catalog Selector</h3>
                <p className="text-xs text-slate-500 mt-0.5">Explore over 50 global market instruments</p>
              </div>
              <button 
                type="button" onClick={() => { setAssetSearchOpen(false); setSearchQuery(''); }}
                className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Input Search Control Form */}
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Search assets by symbol or full title name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 font-medium transition"
              />
              <svg className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filtering Navigation Layout Tabs */}
            <div className="mt-3 flex gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800 text-xs font-bold tracking-wide">
              {(['ALL', 'FOREX', 'CRYPTO', 'COMMODITY', 'INDEX'] as const).map((tab) => (
                <button
                  key={tab} type="button" onClick={() => setActiveTabFilter(tab)}
                  className={`rounded-xl px-3.5 py-2 transition shrink-0 ${activeTabFilter === tab ? 'bg-sky-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800/60 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Rendered Search Results Catalog Lists */}
            <div className="mt-4 overflow-y-auto flex-1 pr-1 divide-y divide-slate-800/50 space-y-1">
              {filteredAssets.length === 0 ? (
                <div className="text-center py-12 text-sm text-slate-500 font-medium">No trading symbols match your search terms.</div>
              ) : (
                filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setAssetSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-950/60 text-left transition group"
                  >
                    <div className="flex flex-col gap-0.5 truncate max-w-[70%]">
                      <span className="font-bold text-white group-hover:text-sky-400 text-sm sm:text-base font-mono tracking-tight">{asset.id}</span>
                      <span className="text-xs text-slate-400 truncate font-medium">{asset.name}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 font-mono text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-slate-200">
                        ${asset.basePrice.toLocaleString(undefined, { minimumFractionDigits: asset.type === 'FOREX' ? 4 : 2 })}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500">
                        {asset.type}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}