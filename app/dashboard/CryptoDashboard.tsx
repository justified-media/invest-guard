"use client";

import { useMemo, useState } from 'react';

type Coin = {
  symbol: string;
  name: string;
  label: string;
  exchange: string;
};

const topCoins: Coin[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', label: 'Bitcoin (BTC)', exchange: 'BINANCE' },
  { symbol: 'ETHUSDT', name: 'Ethereum', label: 'Ethereum (ETH)', exchange: 'BINANCE' },
  { symbol: 'BNBUSDT', name: 'Binance Coin', label: 'Binance Coin (BNB)', exchange: 'BINANCE' },
  { symbol: 'XRPUSDT', name: 'XRP', label: 'XRP', exchange: 'BINANCE' },
  { symbol: 'ADAUSDT', name: 'Cardano', label: 'Cardano (ADA)', exchange: 'BINANCE' },
  { symbol: 'SOLUSDT', name: 'Solana', label: 'Solana (SOL)', exchange: 'BINANCE' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin', label: 'Dogecoin (DOGE)', exchange: 'BINANCE' },
  { symbol: 'DOTUSDT', name: 'Polkadot', label: 'Polkadot (DOT)', exchange: 'BINANCE' },
  { symbol: 'MATICUSDT', name: 'Polygon', label: 'Polygon (MATIC)', exchange: 'BINANCE' },
  { symbol: 'LTCUSDT', name: 'Litecoin', label: 'Litecoin (LTC)', exchange: 'BINANCE' },
];

export default function CryptoDashboard() {
  const [selectedCoin, setSelectedCoin] = useState<Coin>(topCoins[0]);

  const iframeSrc = useMemo(() => {
    const symbolEncoded = encodeURIComponent(`${selectedCoin.exchange}:${selectedCoin.symbol}`);
    return `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${symbolEncoded}&interval=D&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Africa/Lagos&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=investguard`;
  }, [selectedCoin]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Top 10 Most Traded Crypto</h3>
          <p className="text-xs text-slate-400">Tap any asset to load its live market chart instantly.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-300 text-sm shadow-sm backdrop-blur-sm">
          Active chart: <span className="font-semibold text-white">{selectedCoin.label}</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[32px] border border-slate-800 bg-slate-950 p-6 shadow-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Market pulse</p>
              <h4 className="mt-4 text-2xl font-semibold text-white">24H Trading Momentum</h4>
              <p className="mt-3 text-sm text-slate-400">A curated list of the most traded crypto assets. Select one to view the live price action.</p>
            </div>
            <div className="rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Today’s leaders</p>
                  <p className="mt-4 text-3xl font-bold text-white">Top 10</p>
                </div>
                <span className="inline-flex items-center rounded-2xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                  Live list
                </span>
              </div>
              <div className="mt-5 rounded-3xl bg-slate-950 p-4 text-sm text-slate-400 ring-1 ring-slate-800">
                Every coin is ready to load in the chart. Just click and the dashboard updates instantly.
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Crypto watchlist</p>
                <h4 className="text-xl font-semibold text-white">Most traded assets</h4>
              </div>
              <span className="inline-flex items-center rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                {topCoins.length} assets
              </span>
            </div>
            <div className="grid gap-3">
              {topCoins.map((coin, index) => (
                <button
                  key={coin.symbol}
                  type="button"
                  onClick={() => setSelectedCoin(coin)}
                  className={`group flex items-center justify-between gap-4 rounded-[28px] border px-4 py-4 text-left transition-all duration-200 ${
                    coin.symbol === selectedCoin.symbol
                      ? 'border-sky-500/40 bg-sky-500/10 shadow-xl'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{coin.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{coin.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-2xl bg-slate-950 text-xs font-semibold text-slate-300">
                      {coin.symbol.replace('USDT', '')}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">#{index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-4 shadow-xl">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Live chart</p>
              <h4 className="text-2xl font-semibold text-white">{selectedCoin.label}</h4>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-950/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Real-time updating
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="border-b border-slate-800 bg-slate-900 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Chart feed</p>
                  <p className="mt-1 text-sm font-semibold text-white">{selectedCoin.exchange}:{selectedCoin.symbol}</p>
                </div>
                <div className="rounded-2xl bg-slate-950 px-3 py-2 text-xs text-slate-400">Daily interval</div>
              </div>
            </div>
            <div className="h-[420px] sm:h-[520px] md:h-[580px] lg:h-[660px]">
              <iframe
                src={iframeSrc}
                className="h-full w-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
