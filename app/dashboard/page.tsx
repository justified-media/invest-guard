"use client";

import { useState, useEffect, useRef } from 'react';
// FIXED: Stepped up 3 levels (../../../) to get out of app/dashboard and access the root lib folder
import { supabase } from '../../utils/supabase';
import { 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  Radio, 
  Zap, 
  Layers, 
  Globe, 
  ShieldCheck, 
  ArrowUpRight,
  User,
  Cpu,
  Terminal,
  Wallet
} from 'lucide-react';

interface CryptoAsset {
  symbol: string;
  name: string;
  pair: string;
  color: string; 
  change24h: string;
  isUp: boolean;
}

const TOP_ASSETS_NODE: CryptoAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', pair: 'BINANCE:BTCUSDT', color: 'from-amber-500 to-orange-600', change24h: '+4.21%', isUp: true },
  { symbol: 'ETH', name: 'Ethereum', pair: 'BINANCE:ETHUSDT', color: 'from-indigo-400 to-purple-600', change24h: '+2.85%', isUp: true },
  { symbol: 'BNB', name: 'BNB', pair: 'BINANCE:BNBUSDT', color: 'from-yellow-400 to-amber-500', change24h: '-0.45%', isUp: false },
  { symbol: 'SOL', name: 'Solana', pair: 'BINANCE:SOLUSDT', color: 'from-teal-400 to-fuchsia-500', change24h: '+8.12%', isUp: true },
  { symbol: 'XRP', name: 'Ripple', pair: 'BINANCE:XRPUSDT', color: 'from-sky-400 to-blue-600', change24h: '+1.04%', isUp: true },
  { symbol: 'ADA', name: 'Cardano', pair: 'BINANCE:ADAUSDT', color: 'from-blue-500 to-indigo-700', change24h: '-1.20%', isUp: false },
  { symbol: 'AVAX', name: 'Avalanche', pair: 'BINANCE:AVAXUSDT', color: 'from-red-500 to-rose-600', change24h: '+5.67%', isUp: true },
  { symbol: 'DOT', name: 'Polkadot', pair: 'BINANCE:DOTUSDT', color: 'from-pink-500 to-rose-500', change24h: '-0.15%', isUp: false },
  { symbol: 'LINK', name: 'Chainlink', pair: 'BINANCE:LINKUSDT', color: 'from-blue-600 to-indigo-500', change24h: '+3.94%', isUp: true },
  { symbol: 'DOGE', name: 'Dogecoin', pair: 'BINANCE:DOGEUSDT', color: 'from-yellow-500 to-yellow-600', change24h: '+12.40%', isUp: true },
];

export default function CryptoDashboard() {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(TOP_ASSETS_NODE[0]);
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState<string>("Operator");
  const [userBalance, setUserBalance] = useState<string>("0.00"); 
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    async function fetchUserProfile() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username, balance')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Profile data hook mismatch:", profileError.message);
          return;
        }

        if (profile) {
          if (profile.username) setUserName(profile.username);
          if (profile.balance !== undefined && profile.balance !== null) {
            setUserBalance(Number(profile.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
          }
        }
      } catch (err) {
        console.error("Unexpected error syncing telemetry profile nodes:", err);
      }
    }

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!mounted || !chartContainerRef.current) return;

    chartContainerRef.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": selectedAsset.pair,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "allow_symbol_change": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com",
      "backgroundColor": "rgba(3, 7, 18, 1)", 
      "gridColor": "rgba(15, 23, 42, 0.4)",
      "hide_top_toolbar": false,
      "hide_side_toolbar": false,
      "save_image": false
    });

    chartContainerRef.current.appendChild(script);
  }, [selectedAsset, mounted]);

  if (!mounted) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center font-mono text-xs text-sky-400">
        INITIALIZING SECURE TERMINAL DATA NODES...
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full min-h-screen text-slate-200 p-1">
      
      {/* TELEMETRY BANNER HEADERS, ACCOUNT PROFILES, AND BALANCE SPEC CARD */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-sky-400 font-mono text-[10px] uppercase tracking-widest font-black bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              <Radio className="h-3 w-3 animate-pulse" /> Quantum Data Ingestion
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-amber-400 font-mono tracking-wider font-bold uppercase">
              <Terminal className="h-3 w-3" /> ANALYTICS.EXECUTE //
            </div>
          </div>
          
          <h2 className="text-xl font-black text-white uppercase tracking-tight mt-1.5 flex items-center gap-2 font-mono">
            24H Trading Momentum Matrice <span className="text-xs text-slate-500 font-normal">v4.02</span>
          </h2>
          
          <p className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1.5 uppercase tracking-wide">
            <Cpu className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-white font-bold text-sky-400">ANALYZE WITH PRECISION.</span> 
            <span className="text-slate-500">LEAP WITH CONVICTION.</span>
          </p>
        </div>
        
        {/* WALLET METRIC AND USER PROFILE ACTIONS CONTAINER */}
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          
          {/* USER WALLET ACCOUNT BALANCE NODE */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl px-4 py-2 shadow-xl min-w-[140px]">
            <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Wallet className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-left font-mono">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold leading-none">Net Account Value</p>
              <p className="text-xs font-black text-emerald-400 mt-1">${userBalance} <span className="text-[9px] text-slate-500 font-normal">USD</span></p>
            </div>
          </div>

          {/* DYNAMIC WELCOME USER CONTAINER */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl px-4 py-2 shadow-xl">
            <div className="h-7 w-7 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center">
              <User className="h-4 w-4 text-sky-400" />
            </div>
            <div className="text-left font-mono">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold leading-none">Authenticated Operator</p>
              <p className="text-xs font-black text-slate-100 mt-1">Welcome, {userName}</p>
            </div>
          </div>
          
          <div className="hidden xl:inline-flex items-center gap-2 px-3 py-2 bg-slate-950/80 border border-slate-800/80 rounded-xl text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Clearinghouse Online
          </div>
        </div>
      </div>

      {/* CORE 12-COLUMN TERMINAL GRID HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        
        {/* LEFT COMPONENT COLUMN */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* PREMIUM BOX 1 */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/50 p-5 rounded-2xl border border-slate-800/70 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Layers className="h-16 w-16 text-sky-400" />
            </div>
            <span className="text-[9px] font-black tracking-widest text-sky-500 font-mono uppercase bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
              Market Pulse Terminal
            </span>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mt-3 font-mono">
              Top 10 Most Traded Crypto
            </h3>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1.5">
              A highly curated, enterprise index monitoring liquidity velocity. Tap any active validation asset core below to execute hot-swapping routing pathways directly into the live viewport.
            </p>
          </div>

          {/* PREMIUM BOX 2 */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-5 rounded-2xl border border-slate-800/40 shadow-lg relative">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black tracking-widest text-emerald-400 font-mono uppercase">
                  Telemetry Engine Overview
                </span>
                <h4 className="text-sm font-extrabold text-slate-200 uppercase tracking-tight mt-1 font-mono">
                  Today's Alpha Index Leaders
                </h4>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                Live list
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Every cryptographic node listed in the directory is primed for real-time visualization. Activating a node causes the integrated advanced TradingView system dashboard to render configuration charts instantaneously.
            </p>
          </div>

          {/* INTERACTIVE COMPACT ASSET LIST CONTAINER */}
          <div className="space-y-2 flex-1">
            <div className="flex justify-between items-center bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-sky-400" />
                <span className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-widest">
                  Crypto Watchlist Terminal
                </span>
              </div>
              <span className="text-[9px] bg-slate-900 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-800 font-bold uppercase tracking-widest">
                10 Assets Active
              </span>
            </div>

            {/* SCROLLABLE INTERACTIVE INDEX LIST */}
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800/80 scrollbar-track-transparent">
              {TOP_ASSETS_NODE.map((asset) => {
                const isTarget = selectedAsset.symbol === asset.symbol;
                return (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all group font-mono text-xs cursor-pointer text-left ${
                      isTarget 
                        ? 'bg-sky-500/10 border-sky-500/40 text-white shadow-lg shadow-sky-500/5' 
                        : 'bg-slate-950/40 border-slate-900/60 text-slate-400 hover:border-slate-800 hover:bg-slate-950/80 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${asset.color} overflow-hidden flex items-center justify-center shadow-lg shadow-black/40 border border-white/10 group-hover:scale-105 transition-transform`}>
                        <span className="text-[10px] font-black text-white tracking-tighter leading-none">
                          {asset.symbol.slice(0, 2)}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-black text-slate-200 group-hover:text-white transition-colors">{asset.symbol}</p>
                          <span className="text-[8px] text-slate-600">/USDT</span>
                        </div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-sans font-medium">{asset.name}</p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <span className={`text-[9px] font-bold ${asset.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {asset.change24h}
                      </span>
                      {isTarget ? (
                        <span className="text-[8px] font-black text-sky-400 bg-sky-500/10 px-1.5 py-0.5 border border-sky-500/30 rounded uppercase tracking-widest animate-pulse">
                          Routing
                        </span>
                      ) : (
                        <span className="text-[8px] text-slate-600 group-hover:text-slate-400 font-sans tracking-tight transition-colors flex items-center gap-0.5">
                          Stream <ArrowUpRight className="h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SYSTEM COLUMN */}
        <div className="lg:col-span-8 flex flex-col space-y-4 w-full h-full">
          
          {/* PREMIUM LIVE HEADER MODULE */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-950 to-slate-950/80 border border-slate-800/70 p-4 rounded-2xl backdrop-blur-md shadow-lg w-full">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shadow-inner">
                <BarChart3 className="h-4 w-4 text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest leading-none">Active Matrix Workspace</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
                </div>
                <p className="text-sm font-black text-white font-mono mt-1 tracking-tight">
                  TERMINAL STREAM // <span className="text-sky-400">{selectedAsset.name} ({selectedAsset.symbol}/USDT)</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-center text-[9px] text-slate-400 font-mono uppercase tracking-widest border border-slate-800 bg-slate-950/90 px-3 py-1.5 rounded-xl shadow-md">
              <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" /> Real-Time Rendering Engine Enabled
            </div>
          </div>

          {/* DYNAMIC VIEWPORT CONTAINER */}
          <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex-1 min-h-[520px] md:min-h-[580px] xl:min-h-[660px] h-full relative group transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none z-10" />
            <div ref={chartContainerRef} className="w-full h-full" />
          </div>

          {/* SYSTEM FOOTER SPEC SHEET DATA CARD */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
            <div className="bg-slate-950/40 border border-slate-900 p-3 rounded-xl font-mono text-[10px] text-slate-500 uppercase">
              <p className="text-slate-600 font-bold">Data Feed Frequency</p>
              <p className="text-slate-300 mt-0.5 font-bold flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-400" /> &lt; 1ms Liquidity Ticks
              </p>
            </div>
            <div className="bg-slate-950/40 border border-slate-900 p-3 rounded-xl font-mono text-[10px] text-slate-500 uppercase">
              <p className="text-slate-600 font-bold">Protocol Validation</p>
              <p className="text-slate-300 mt-0.5 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> SECURE SSL CORE
              </p>
            </div>
            <div className="hidden sm:block bg-slate-950/40 border border-slate-900 p-3 rounded-xl font-mono text-[10px] text-slate-500 uppercase">
              <p className="text-slate-600 font-bold">Global Sync Network</p>
              <p className="text-slate-300 mt-0.5 font-bold flex items-center gap-1">
                <Globe className="h-3 w-3 text-sky-400" /> MULTI-REGION EDGES
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}