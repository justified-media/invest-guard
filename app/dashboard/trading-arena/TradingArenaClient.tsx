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

// 54 Top Global Markets across multiple asset classes
const ASSETS = [
  // --- CRYPTO ASSETS (15) ---
  { id: 'BTC', name: 'Bitcoin', symbol: 'BINANCE:BTCUSDT', basePrice: 65000, type: 'CRYPTO' },
  { id: 'ETH', name: 'Ethereum', symbol: 'BINANCE:ETHUSDT', basePrice: 3500, type: 'CRYPTO' },
  { id: 'SOL', name: 'Solana', symbol: 'BINANCE:SOLUSDT', basePrice: 150, type: 'CRYPTO' },
  { id: 'BNB', name: 'BNB Chain', symbol: 'BINANCE:BNBUSDT', basePrice: 580, type: 'CRYPTO' },
  { id: 'XRP', name: 'Ripple', symbol: 'BINANCE:XRPUSDT', basePrice: 0.52, type: 'CRYPTO' },
  { id: 'ADA', name: 'Cardano', symbol: 'BINANCE:ADAUSDT', basePrice: 0.45, type: 'CRYPTO' },
  { id: 'DOT', name: 'Polkadot', symbol: 'BINANCE:DOTUSDT', basePrice: 6.20, type: 'CRYPTO' },
  { id: 'LINK', name: 'Chainlink', symbol: 'BINANCE:LINKUSDT', basePrice: 14.80, type: 'CRYPTO' },
  { id: 'MATIC', name: 'Polygon', symbol: 'BINANCE:MATICUSDT', basePrice: 0.65, type: 'CRYPTO' },
  { id: 'DOGE', name: 'Dogecoin', symbol: 'BINANCE:DOGEUSDT', basePrice: 0.13, type: 'CRYPTO' },
  { id: 'SHIB', name: 'Shiba Inu', symbol: 'BINANCE:SHIBUSDT', basePrice: 0.000018, type: 'CRYPTO' },
  { id: 'AVAX', name: 'Avalanche', symbol: 'BINANCE:AVAXUSDT', basePrice: 28.50, type: 'CRYPTO' },
  { id: 'LTC', name: 'Litecoin', symbol: 'BINANCE:LTCUSDT', basePrice: 78.00, type: 'CRYPTO' },
  { id: 'UNI', name: 'Uniswap', symbol: 'BINANCE:UNIUSDT', basePrice: 7.50, type: 'CRYPTO' },
  { id: 'NEAR', name: 'NEAR Protocol', symbol: 'BINANCE:NEARUSDT', basePrice: 5.10, type: 'CRYPTO' },

  // --- FOREX PAIRS (20) ---
  { id: 'EUR/USD', name: 'Euro / US Dollar', symbol: 'FX:EURUSD', basePrice: 1.0825, type: 'FOREX' },
  { id: 'GBP/USD', name: 'British Pound / US Dollar', symbol: 'FX:GBPUSD', basePrice: 1.2740, type: 'FOREX' },
  { id: 'USD/JPY', name: 'US Dollar / Japanese Yen', symbol: 'FX:USDJPY', basePrice: 156.45, type: 'FOREX' },
  { id: 'AUD/USD', name: 'Australian Dollar / US Dollar', symbol: 'FX:AUDUSD', basePrice: 0.6650, type: 'FOREX' },
  { id: 'USD/CAD', name: 'US Dollar / Canadian Dollar', symbol: 'FX:USDCAD', basePrice: 1.3620, type: 'FOREX' },
  { id: 'USD/CHF', name: 'US Dollar / Swiss Franc', symbol: 'FX:USDCHF', basePrice: 0.8950, type: 'FOREX' },
  { id: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', symbol: 'FX:NZDUSD', basePrice: 0.6120, type: 'FOREX' },
  { id: 'EUR/GBP', name: 'Euro / British Pound', symbol: 'FX:EURGBP', basePrice: 0.8510, type: 'FOREX' },
  { id: 'EUR/JPY', name: 'Euro / Japanese Yen', symbol: 'FX:EURJPY', basePrice: 169.30, type: 'FOREX' },
  { id: 'GBP/JPY', name: 'British Pound / Japanese Yen', symbol: 'FX:GBPJPY', basePrice: 199.10, type: 'FOREX' },
  { id: 'AUD/JPY', name: 'Australian Dollar / Japanese Yen', symbol: 'FX:AUDJPY', basePrice: 104.20, type: 'FOREX' },
  { id: 'EUR/AUD', name: 'Euro / Australian Dollar', symbol: 'FX:EURAUD', basePrice: 1.6280, type: 'FOREX' },
  { id: 'EUR/CAD', name: 'Euro / Canadian Dollar', symbol: 'FX:EURCAD', basePrice: 1.4750, type: 'FOREX' },
  { id: 'GBP/CAD', name: 'British Pound / Canadian Dollar', symbol: 'FX:GBPCAD', basePrice: 1.7340, type: 'FOREX' },
  { id: 'CHF/JPY', name: 'Swiss Franc / Japanese Yen', symbol: 'FX:CHFJPY', basePrice: 174.60, type: 'FOREX' },
  { id: 'AUD/CAD', name: 'Australian Dollar / Canadian Dollar', symbol: 'FX:AUDCAD', basePrice: 0.9060, type: 'FOREX' },
  { id: 'AUD/NZD', name: 'Australian Dollar / New Zealand Dollar', symbol: 'FX:AUDNZD', basePrice: 1.0870, type: 'FOREX' },
  { id: 'CAD/JPY', name: 'Canadian Dollar / Japanese Yen', symbol: 'FX:CADJPY', basePrice: 114.80, type: 'FOREX' },
  { id: 'NZD/JPY', name: 'New Zealand Dollar / Japanese Yen', symbol: 'FX:NZDJPY', basePrice: 95.80, type: 'FOREX' },
  { id: 'GBP/AUD', name: 'British Pound / Australian Dollar', symbol: 'FX:GBPAUD', basePrice: 1.9150, type: 'FOREX' },

  // --- COMMODITIES & METALS (7) ---
  { id: 'XAU/USD', name: 'Gold / US Dollar', symbol: 'TVC:GOLD', basePrice: 2330.50, type: 'COMMODITY' },
  { id: 'XAG/USD', name: 'Silver / US Dollar', symbol: 'TVC:SILVER', basePrice: 29.80, type: 'COMMODITY' },
  { id: 'USOIL', name: 'Crude Oil WTI', symbol: 'TVC:USOIL', basePrice: 78.40, type: 'COMMODITY' },
  { id: 'UKOIL', name: 'Brent Crude Oil', symbol: 'TVC:UKOIL', basePrice: 82.60, type: 'COMMODITY' },
  { id: 'NGAS', name: 'Natural Gas', symbol: 'TVC:NATURALGAS', basePrice: 2.85, type: 'COMMODITY' },
  { id: 'COPPER', name: 'Copper Futures', symbol: 'COMEX:HG1!', basePrice: 4.55, type: 'COMMODITY' },
  { id: 'PLAT', name: 'Platinum Futures', symbol: 'NYMEX:PL1!', basePrice: 995.00, type: 'COMMODITY' },

  // --- GLOBAL STOCKS & INDICES (12) ---
  { id: 'SPX', name: 'S&P 500 Index', symbol: 'SP:SPX', basePrice: 5300, type: 'INDEX' },
  { id: 'NDX', name: 'Nasdaq 100', symbol: 'NASDAQ:NDX', basePrice: 18500, type: 'INDEX' },
  { id: 'DJI', name: 'Dow Jones 30', symbol: 'DJ:DJI', basePrice: 39000, type: 'INDEX' },
  { id: 'UK100', name: 'FTSE 100 Index', symbol: 'INDEX:UKX', basePrice: 8250, type: 'INDEX' },
  { id: 'AAPL', name: 'Apple Inc.', symbol: 'NASDAQ:AAPL', basePrice: 190.50, type: 'INDEX' },
  { id: 'TSLA', name: 'Tesla Inc.', symbol: 'NASDAQ:TSLA', basePrice: 175.20, type: 'INDEX' },
  { id: 'NVDA', name: 'NVIDIA Corp.', symbol: 'NASDAQ:NVDA', basePrice: 950.00, type: 'INDEX' },
  { id: 'MSFT', name: 'Microsoft Corp.', symbol: 'NASDAQ:MSFT', basePrice: 420.00, type: 'INDEX' },
  { id: 'AMZN', name: 'Amazon.com Inc.', symbol: 'NASDAQ:AMZN', basePrice: 180.40, type: 'INDEX' },
  { id: 'GOOGL', name: 'Alphabet Inc.', symbol: 'NASDAQ:GOOGL', basePrice: 173.10, type: 'INDEX' },
  { id: 'META', name: 'Meta Platforms', symbol: 'NASDAQ:META', basePrice: 475.00, type: 'INDEX' },
  { id: 'AMD', name: 'Advanced Micro Devices', symbol: 'NASDAQ:AMD', basePrice: 160.30, type: 'INDEX' },
];

export default function TradingArenaClient({ initialBalance, userId }: TradingArenaClientProps) {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [amount, setAmount] = useState('10');
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY');
  const [executing, setExecuting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);

  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [livePrice, setLivePrice] = useState(ASSETS[0].basePrice);

  // Sync initial asset price configuration changes instantly
  useEffect(() => {
    setLivePrice(selectedAsset.basePrice);
  }, [selectedAsset]);

  // Handle dynamic asset tickers without mutating layout bounds
  useEffect(() => {
    setIsMounted(true);

    const interval = setInterval(() => {
      setLivePrice((prev) => {
        let volatilityFactor = 0.0015; // default crypto/equity bounds
        if (selectedAsset.type === 'FOREX') volatilityFactor = 0.0002;
        if (selectedAsset.type === 'INDEX') volatilityFactor = 0.0005;

        const volatility = prev * volatilityFactor; 
        const change = (Math.random() - 0.5) * volatility;
        
        const decimals = (selectedAsset.type === 'FOREX' || prev < 5) ? 4 : 2;
        return Number((prev + change).toFixed(decimals));
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [selectedAsset]);

  const totalCost = useMemo(() => {
    const value = Number(amount || '0');
    return Number.isFinite(value) ? value * livePrice : 0;
  }, [amount, livePrice]);

  const handleExecuteTrade = async () => {
    const tradeAmount = Number(amount);
    if (!tradeAmount || tradeAmount <= 0) {
      alert(`Enter a valid trade size.`);
      return;
    }

    const tradeValue = tradeAmount * livePrice;
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
          amount: tradeAmount,
          type: mode,
          symbol: selectedAsset.symbol,
          entry_price: livePrice,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Trade failed.');
      }

      setBalance(result.balance ?? balance);

      const newPosition: Position = {
        id: Math.random().toString(36).substring(2, 9),
        symbol: selectedAsset.id,
        type: mode,
        amount: tradeAmount,
        entryPrice: livePrice,
        marketType: selectedAsset.type as any
      };
      setPositions((prev) => [newPosition, ...prev]);

      alert(`${mode} order executed successfully for ${tradeAmount} units of ${selectedAsset.id}.`);
    } catch (error) {
      console.error(error);
      alert('Trade failed. Please try again.');
    } finally {
      setExecuting(false);
    }
  };

  const handleClosePosition = async (position: Position, currentPnL: number) => {
    if (!confirm(`Are you sure you want to close this ${position.type} position?`)) return;
    const originalValue = position.amount * position.entryPrice;
    const finalSettlement = originalValue + currentPnL;

    setBalance((prev) => prev + finalSettlement);
    setPositions((prev) => prev.filter((p) => p.id !== position.id));
    alert(`Position closed! Settle amount: $${finalSettlement.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
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
          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-700 hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:px-10 lg:flex-row">
        {/* Chart Frame & Open Dashboard List */}
        <section className="lg:w-3/4 flex flex-col gap-6">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-4 shadow-2xl sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:max-w-md">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Live asset terminal</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <select
                    value={selectedAsset.id}
                    onChange={(e) => {
                      const found = ASSETS.find(a => a.id === e.target.value);
                      if (found) setSelectedAsset(found);
                    }}
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 font-semibold outline-none focus:border-sky-500 transition cursor-pointer text-base w-full sm:w-auto"
                  >
                    <optgroup label="Forex Currency Pairs" className="bg-slate-900 text-slate-400">
                      {ASSETS.filter(a => a.type === 'FOREX').map(asset => (
                        <option key={asset.id} value={asset.id} className="text-white">{asset.name} ({asset.id})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Crypto Assets" className="bg-slate-900 text-slate-400">
                      {ASSETS.filter(a => a.type === 'CRYPTO').map(asset => (
                        <option key={asset.id} value={asset.id} className="text-white">{asset.name} ({asset.id})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Commodities & Metals" className="bg-slate-900 text-slate-400">
                      {ASSETS.filter(a => a.type === 'COMMODITY').map(asset => (
                        <option key={asset.id} value={asset.id} className="text-white">{asset.name} ({asset.id})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Stocks & Indices" className="bg-slate-900 text-slate-400">
                      {ASSETS.filter(a => a.type === 'INDEX').map(asset => (
                        <option key={asset.id} value={asset.id} className="text-white">{asset.name} ({asset.id})</option>
                      ))}
                    </optgroup>
                  </select>
                  
                  <span className="text-sm font-bold text-sky-400 bg-sky-950/50 px-2.5 py-1.5 rounded-full border border-sky-900/50 animate-pulse font-mono">
                    ${livePrice.toLocaleString(undefined, { minimumFractionDigits: (selectedAsset.type === 'FOREX' || livePrice < 5) ? 4 : 2 })}
                  </span>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-950 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-400 ring-1 ring-slate-800 self-start sm:self-center">
                Multi-Asset Arena
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950">
              {isMounted ? (
                <AdvancedRealTimeChart
                  key={selectedAsset.id} 
                  symbol={selectedAsset.symbol}
                  theme="dark"
                  height="600px"
                  allow_symbol_change={false}
                />
              ) : (
                <div className="flex h-[600px] w-full items-center justify-center text-sm uppercase tracking-widest text-slate-500">
                  Loading Live Chart Framework...
                </div>
              )}
            </div>
          </div>

          {/* Positions Feed View */}
          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider text-slate-400 text-xs">Open Positions</h3>
            {positions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6 border border-dashed border-slate-800 rounded-2xl">No open trading positions.</p>
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
                      const matchingAsset = ASSETS.find(a => a.id === pos.symbol);
                      const currentMarketPrice = matchingAsset?.id === selectedAsset.id ? livePrice : (matchingAsset?.basePrice || pos.entryPrice);
                      
                      const priceDiff = currentMarketPrice - pos.entryPrice;
                      const pnl = pos.type === 'BUY' ? priceDiff * pos.amount : -priceDiff * pos.amount;
                      const isProfit = pnl >= 0;
                      const decimals = (pos.marketType === 'FOREX' || pos.entryPrice < 5) ? 4 : 2;

                      return (
                        <tr key={pos.id} className="text-slate-200">
                          <td className="py-3.5 font-semibold text-white">{pos.symbol}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${pos.type === 'BUY' ? 'bg-green-950 text-green-400 border border-green-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                              {pos.type}
                            </span>
                          </td>
                          <td className="py-3.5 font-mono">{pos.amount.toLocaleString()} Units</td>
                          <td className="py-3.5 text-slate-400 font-mono">${pos.entryPrice.toLocaleString(undefined, { minimumFractionDigits: decimals })}</td>
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

        {/* Right Interaction Sidebar Forms */}
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
              Trade Size (Units)
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500 font-mono"
              />
            </label>

            <div className="mt-6 space-y-3 rounded-3xl bg-slate-950 p-5 text-sm text-slate-400 ring-1 ring-slate-800">
              <div className="flex items-center justify-between">
                <span>Market Price</span>
                <span className="font-semibold text-white font-mono">
                  ${livePrice.toLocaleString(undefined, { minimumFractionDigits: (selectedAsset.type === 'FOREX' || livePrice < 5) ? 4 : 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Value</span>
                <span className="font-semibold text-white font-mono">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
              {executing ? 'Executing...' : `${mode} ${selectedAsset.id}`}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}