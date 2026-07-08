'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Globe, 
  Shield, 
  ArrowUpRight,
  Menu,
  X,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  Play,
  Users,
  Briefcase,
  Lock,
  Award,
  Smartphone,
  Apple,
  ChevronRight,
  BarChart3,
  Coins,
  Wallet,
  Cpu,
  ChevronDown,
  Search,
  ExternalLink,
  Gift,
  Rocket,
  Activity
} from 'lucide-react';

// Stats Data (Static - these don't change with live prices)
const STATS_DATA = [
  { value: "$3.2B+", label: "Trading Volume", icon: DollarSign },
  { value: "2M+", label: "Active Users", icon: Users },
  { value: "120+", label: "Supported Assets", icon: Coins },
  { value: "150+", label: "Countries Reach", icon: Globe }
];

// Why Choose Data
const WHY_CHOOSE = [
  {
    icon: BarChart3,
    title: "Advanced Trading Tools",
    description: "Real-time analytics, advanced charting, and automated trading strategies at your fingertips."
  },
  {
    icon: Zap,
    title: "Ultra Fast Transactions",
    description: "Lightning-fast execution with microsecond latency for optimal trade performance."
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Multi-signature wallets, cold storage, and continuous security audits for complete peace of mind."
  },
  {
    icon: Wallet,
    title: "Low Trading Fees",
    description: "Competitive fee structure with volume discounts and zero hidden charges."
  }
];

// Process Steps Data
const PROCESS_STEPS = [
  { number: "01", title: "Create Account", description: "Sign up in minutes with email verification" },
  { number: "02", title: "Deposit Funds", description: "Add funds via bank transfer or crypto" },
  { number: "03", title: "Start Trading", description: "Access global markets and start earning" }
];

// Security Features
const SECURITY_FEATURES = [
  "Two Factor Authentication (2FA)",
  "Regular 3rd Party Audits",
  "Encrypted P2P Transactions",
  "Cold Storage Multi-Sig Wallets",
  "Real-Time Fraud Detection",
  "Biometric Access Control"
];

// Testimonials with Unsplash profile images
const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Head of Trading, Nova Capital",
    content: "Invest Guard has completely transformed our trading operations. The speed and reliability are unmatched in the industry.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Michael Chang",
    role: "CEO, CryptoTech Ventures",
    content: "We've been using Invest Guard for over a year now and the returns have been exceptional. The platform is a game-changer.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Dr. Emily Williams",
    role: "Blockchain Researcher, MIT",
    content: "The security architecture and institutional-grade features make Invest Guard the clear choice for serious traders.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

// Footer Categories
const FOOTER_CATEGORIES = {
  aboutUs: [
    { label: "Our Story", href: "#" },
    { label: "Team", href: "#" },
    { label: "Corporate Vision", href: "#" },
    { label: "Careers", href: "#" }
  ],
  pricing: [
    { label: "Starter Plan", href: "#" },
    { label: "Pro Plan", href: "#" },
    { label: "Enterprise Plan", href: "#" },
    { label: "Fee Schedule", href: "#" }
  ],
  plans: [
    { label: "Challenge Details", href: "#" },
    { label: "Funded Accounts", href: "#" },
    { label: "Allocation Tiers", href: "#" },
    { label: "Profit Split", href: "#" }
  ],
  features: [
    { label: "Trading Ecosystem", href: "#" },
    { label: "API Access", href: "#" },
    { label: "Advanced Tools", href: "#" },
    { label: "Mobile Trading", href: "#" }
  ],
  support: [
    { label: "Documentation", href: "#" },
    { label: "Live Chat", href: "#" },
    { label: "Support Tickets", href: "#" },
    { label: "Community", href: "#" }
  ]
};

// Asset configuration with REAL reference prices (fallback)
const ASSET_CONFIG = [
  { 
    id: 'bitcoin', 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    color: 'from-amber-500 to-orange-600',
    fallbackPrice: 43245.80,
    fallbackChange: 2.4
  },
  { 
    id: 'ethereum', 
    symbol: 'ETH', 
    name: 'Ethereum', 
    color: 'from-indigo-400 to-purple-600',
    fallbackPrice: 2845.30,
    fallbackChange: 1.8
  },
  { 
    id: 'solana', 
    symbol: 'SOL', 
    name: 'Solana', 
    color: 'from-teal-400 to-fuchsia-500',
    fallbackPrice: 98.75,
    fallbackChange: 5.2
  },
  { 
    id: 'binancecoin', 
    symbol: 'BNB', 
    name: 'BNB', 
    color: 'from-yellow-400 to-amber-500',
    fallbackPrice: 345.60,
    fallbackChange: -0.5
  },
  { 
    id: 'ripple', 
    symbol: 'XRP', 
    name: 'XRP', 
    color: 'from-sky-400 to-blue-600',
    fallbackPrice: 0.6245,
    fallbackChange: 3.1
  }
];

// Live Chart Component
function LiveChart({ data, isUp }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    const padding = 10;
    
    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = padding + (1 - (value - minValue) / range) * (height - padding * 2);
      return { x, y };
    });
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    const color = isUp ? 'rgba(52, 211, 153, ' : 'rgba(248, 113, 113, ';
    gradient.addColorStop(0, color + '0.2)');
    gradient.addColorStop(1, color + '0.02)');
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, height);
    points.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = isUp ? '#34d399' : '#f87171';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.shadowColor = isUp ? '#34d399' : '#f87171';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = isUp ? '#34d399' : '#f87171';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = isUp ? '#34d399' : '#f87171';
      ctx.fill();
      ctx.shadowColor = isUp ? '#34d399' : '#f87171';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    
  }, [data, isUp]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={80} 
      className="w-full h-full"
    />
  );
}

// Format price helper
function formatPrice(price) {
  if (!price && price !== 0) return '$0.00';
  
  if (price >= 1000) {
    return '$' + price.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  } else if (price >= 1) {
    return '$' + price.toFixed(2);
  } else if (price > 0 && price < 1) {
    return '$' + price.toFixed(4);
  } else {
    return '$0.00';
  }
}

// Format change percentage helper
function formatChange(change) {
  if (change === undefined || change === null) return '+0.00%';
  return (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
}

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [candlestickData, setCandlestickData] = useState([]);
  
  // Live price state
  const [livePrices, setLivePrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [apiSource, setApiSource] = useState('CoinGecko');

  // Generate candlestick data on client side only
  useEffect(() => {
    const handleScroll = function() {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const generateCandlestickData = function() {
      const data = [];
      for (let i = 0; i < 20; i++) {
        const height = 30 + Math.random() * 80;
        const y = 200 + Math.random() * 200;
        const isGreen = Math.random() > 0.5;
        data.push({ height, y, isGreen });
      }
      return data;
    };
    
    setCandlestickData(generateCandlestickData());
    
    return function() {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch live prices from MULTIPLE sources
  useEffect(() => {
    const fetchPrices = async function() {
      try {
        // Try CoinGecko first
        const ids = ASSET_CONFIG.map(function(asset) { return asset.id; }).join(',');
        const url = 'https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=usd&include_24hr_change=true';
        
        console.log('🔄 Fetching from CoinGecko:', url);
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ CoinGecko data received:', data);
          
          // Check if we got valid data
          const hasData = ASSET_CONFIG.some(function(asset) {
            return data[asset.id] && data[asset.id].usd !== undefined;
          });
          
          if (hasData) {
            setLivePrices(data);
            setLastUpdated(new Date());
            setLoading(false);
            setError(null);
            setApiSource('CoinGecko');
            return;
          } else {
            console.warn('⚠️ CoinGecko returned empty data, trying fallback...');
          }
        }
        
        // If CoinGecko fails, try Binance API
        console.log('🔄 Trying Binance API...');
        const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT"]');
        
        if (binanceResponse.ok) {
          const binanceData = await binanceResponse.json();
          console.log('✅ Binance data received:', binanceData);
          
          // Map Binance data to our format
          const mappedData = {};
          binanceData.forEach(function(item) {
            const symbolMap = {
              'BTCUSDT': 'bitcoin',
              'ETHUSDT': 'ethereum',
              'SOLUSDT': 'solana',
              'BNBUSDT': 'binancecoin',
              'XRPUSDT': 'ripple'
            };
            const id = symbolMap[item.symbol];
            if (id) {
              mappedData[id] = {
                usd: parseFloat(item.lastPrice),
                usd_24h_change: parseFloat(item.priceChangePercent)
              };
            }
          });
          
          setLivePrices(mappedData);
          setLastUpdated(new Date());
          setLoading(false);
          setError(null);
          setApiSource('Binance');
          return;
        }
        
        // If both fail, use fallback data
        console.warn('⚠️ All APIs failed, using fallback data');
        const fallbackData = {};
        ASSET_CONFIG.forEach(function(asset) {
          fallbackData[asset.id] = {
            usd: asset.fallbackPrice,
            usd_24h_change: asset.fallbackChange
          };
        });
        setLivePrices(fallbackData);
        setLastUpdated(new Date());
        setLoading(false);
        setError('Using cached market data');
        setApiSource('Fallback');
        
      } catch (error) {
        console.error('❌ Error fetching prices:', error);
        // Use fallback data on error
        const fallbackData = {};
        ASSET_CONFIG.forEach(function(asset) {
          fallbackData[asset.id] = {
            usd: asset.fallbackPrice,
            usd_24h_change: asset.fallbackChange
          };
        });
        setLivePrices(fallbackData);
        setLastUpdated(new Date());
        setLoading(false);
        setError('Using cached market data');
        setApiSource('Fallback');
      }
    };

    fetchPrices();
    const intervalId = setInterval(fetchPrices, 60000);
    return function() {
      clearInterval(intervalId);
    };
  }, []);

  // Prepare asset data with live prices
  const getAssetWithLiveData = function(assetConfig) {
    const priceData = livePrices[assetConfig.id] || {};
    const price = priceData.usd !== undefined ? priceData.usd : assetConfig.fallbackPrice;
    const change24h = priceData.usd_24h_change !== undefined ? priceData.usd_24h_change : assetConfig.fallbackChange;
    
    return {
      ...assetConfig,
      price: price,
      priceFormatted: formatPrice(price),
      change: change24h,
      changeFormatted: formatChange(change24h),
      isUp: change24h >= 0
    };
  };

  // Get all assets with live data
  const assetsWithLiveData = ASSET_CONFIG.map(function(asset) {
    return getAssetWithLiveData(asset);
  });

  // Get top 4 assets for hero section
  const topAssets = assetsWithLiveData.slice(0, 4);

  // Get ticker assets (all 5)
  const tickerAssets = assetsWithLiveData;

  return (
    <div className="min-h-screen bg-[#020710] text-slate-100 overflow-x-hidden selection:bg-sky-500/30 selection:text-white">
      
      {/* Status Banner */}
      <div className="bg-slate-950/95 border-b border-slate-800/60 px-4 py-1.5 flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-4">
          <span className="text-slate-500">Source: {apiSource}</span>
          {lastUpdated && (
            <span className="text-slate-600">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          {loading && (
            <span className="text-sky-400 animate-pulse">⏳ Loading...</span>
          )}
        </div>
        {error && (
          <span className="text-amber-400">{error}</span>
        )}
      </div>

      {/* 0. CRYPTO TICKER - Fixed Top */}
      <div className="bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/60 py-2 px-4 sticky top-0 z-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8 animate-scroll whitespace-nowrap">
            {tickerAssets.concat(tickerAssets).map(function(asset, index) {
              return (
                <div key={index} className="flex items-center gap-3 flex-shrink-0">
                  <div className={'w-6 h-6 rounded-full bg-gradient-to-br ' + asset.color + ' flex items-center justify-center'}>
                    <span className="text-[8px] font-black text-white">{asset.symbol.slice(0, 2)}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{asset.symbol}</span>
                  <span className="text-xs text-slate-400">{asset.priceFormatted}</span>
                  <span className={'text-xs font-bold ' + (asset.isUp ? 'text-emerald-400' : 'text-rose-400')}>
                    {asset.changeFormatted}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. NAVIGATION HEADER */}
      <header className={'border-b border-slate-800/50 bg-[#020710]/95 backdrop-blur-xl sticky top-12 z-40 transition-all duration-300 ' + (isScrolled ? 'shadow-lg shadow-sky-500/5' : '')}>
        <nav className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <span className="text-white font-black text-sm">IG</span>
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              INVEST<span className="text-sky-400">GUARD</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Security
            </Link>
            <Link href="/login" className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/signup" className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl transition-all duration-200 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30">
              Get Started
            </Link>
          </div>

          <button 
            onClick={function() { setIsMobileMenuOpen(!isMobileMenuOpen); }}
            className="md:hidden p-2 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-400"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div className="md:hidden px-4 py-4 border-t border-slate-800/60 space-y-3">
            <Link href="#" className="block text-sm font-medium text-slate-300 hover:text-white transition-colors py-2">
              Features
            </Link>
            <Link href="#" className="block text-sm font-medium text-slate-300 hover:text-white transition-colors py-2">
              Pricing
            </Link>
            <Link href="#" className="block text-sm font-medium text-slate-300 hover:text-white transition-colors py-2">
              Security
            </Link>
            <Link href="/login" className="block text-sm font-medium text-slate-300 hover:text-white transition-colors py-2">
              Login
            </Link>
            <Link href="/signup" className="block text-center px-6 py-3 text-sm font-medium bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl transition-all duration-200">
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {candlestickData.length > 0 && (
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
              {candlestickData.map(function(item, i) {
                return (
                  <g key={i}>
                    <rect
                      x={50 + i * 55}
                      y={item.y}
                      width={20}
                      height={item.height}
                      fill={item.isGreen ? '#34d399' : '#f87171'}
                      opacity="0.5"
                    />
                    <line
                      x1={50 + i * 55 + 10}
                      y1={item.y - 20}
                      x2={50 + i * 55 + 10}
                      y2={item.y + item.height + 20}
                      stroke={item.isGreen ? '#34d399' : '#f87171'}
                      strokeWidth="2"
                      opacity="0.3"
                    />
                  </g>
                );
              })}
              <path
                d="M 0,400 Q 200,350 400,300 T 800,250 T 1200,200"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                opacity="0.3"
              />
            </svg>
          </div>
        )}

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        
        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800/60 backdrop-blur-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Live Markets</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight text-white mb-4">
              Trade Crypto <br />
              <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Smarter and Faster
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-400 max-w-lg leading-relaxed mb-8">
              Join the leading institutional trading platform with advanced tools, 
              lightning-fast execution, and bank-grade security for all your crypto trades.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium rounded-xl shadow-2xl shadow-sky-500/20 transition-all duration-200 hover:scale-105 inline-flex items-center justify-center gap-2 group"
              >
                Start Trading Now
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#features"
                className="px-8 py-4 border border-slate-700 hover:border-sky-500 text-slate-300 hover:text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Explore Markets
                <Play className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map(function(i) {
                  return <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />;
                })}
              </div>
              <span className="text-sm text-slate-400">Trusted by 2M+ traders worldwide</span>
            </div>
          </div>

          {/* Hero Glass Card */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-sky-400" />
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Portfolio Value</p>
                      <p className="text-3xl font-black text-white">$128,450</p>
                      <p className="text-sm text-emerald-400">+12.4% this month</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-sky-400" />
                    </div>
                  </div>

                  <div className="h-20 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 rounded-xl border border-slate-700/30 p-2">
                    <svg className="w-full h-full" viewBox="0 0 200 60">
                      <polyline
                        points="0,40 20,35 40,45 60,30 80,20 100,25 120,15 140,30 160,10 180,20 200,5"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        className="opacity-80"
                      />
                      <polyline
                        points="0,40 20,35 40,45 60,30 80,20 100,25 120,15 140,30 160,10 180,20 200,5"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="4"
                        className="opacity-20 blur-sm"
                      />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    {topAssets.map(function(asset) {
                      return (
                        <div key={asset.symbol} className="flex items-center justify-between bg-slate-950/50 rounded-xl px-3 py-2 border border-slate-800/30">
                          <div className="flex items-center gap-2">
                            <div className={'w-6 h-6 rounded-lg bg-gradient-to-br ' + asset.color + ' flex items-center justify-center'}>
                              <span className="text-[8px] font-black text-white">{asset.symbol.slice(0, 2)}</span>
                            </div>
                            <span className="text-sm font-medium text-white">{asset.symbol}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-white">{asset.priceFormatted}</span>
                            <span className={'text-xs ml-2 ' + (asset.isUp ? 'text-emerald-400' : 'text-rose-400')}>
                              {asset.changeFormatted}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS ROW */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 md:p-8">
          {STATS_DATA.map(function(stat, index) {
            var Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-sky-400" />
                  <span className="text-2xl md:text-3xl font-black text-white">{stat.value}</span>
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CHOOSE GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
            Why Choose Invest Guard
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Industry-leading features designed for professional traders and institutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE.map(function(item, index) {
            var Icon = item.icon;
            return (
              <div key={index} className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 hover:border-sky-500/30 transition-all hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-sky-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. TOP ASSETS SLIDER */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 border-t border-slate-800/60">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
            Top Trading Assets
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real-time market data with live price charts for the most actively traded cryptocurrencies
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {assetsWithLiveData.map(function(asset) {
            const chartData = [25, 20, 30, 15, 10, 20, 5, 15, 8, 12, 18, 25].map(function(val) {
              return val + (Math.random() * 10 - 5);
            });
            
            return (
              <div key={asset.symbol} className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 hover:border-sky-500/30 transition-all hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className={'w-10 h-10 rounded-xl bg-gradient-to-br ' + asset.color + ' flex items-center justify-center'}>
                    <span className="text-xs font-black text-white">{asset.symbol}</span>
                  </div>
                  <div>
                    <p className="font-bold text-white">{asset.name}</p>
                    <p className="text-xs text-slate-400">{asset.symbol}/USD</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-black text-white">{asset.priceFormatted}</span>
                  <span className={'text-sm font-bold px-2 py-1 rounded-lg ' + (asset.isUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10')}>
                    {asset.changeFormatted}
                  </span>
                </div>
                <div className="h-16 bg-slate-950/50 rounded-lg border border-slate-800/30 p-1">
                  <LiveChart data={chartData} isUp={asset.isUp} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                  {lastUpdated && (
                    <span className="text-[8px] text-slate-500">
                      Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PROCESS PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 border-t border-slate-800/60">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
            Start Trading in Minutes
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get started with our simple three-step process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/3 left-1/3 right-1/3 h-0.5 bg-sky-500/20" />
          
          {PROCESS_STEPS.map(function(step, index) {
            return (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-2xl font-black text-sky-400 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-black text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.description}</p>
                {index < PROCESS_STEPS.length - 1 && (
                  <ChevronRight className="hidden md:block absolute right-0 top-1/3 h-6 w-6 text-slate-600" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. SECURITY SECTION */}
      <section className="bg-slate-900/30 border-y border-slate-800/60 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
                Your Assets are Protected in the <br />
                <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  Ethereal Vault
                </span>
              </h2>
              <p className="text-slate-400 mb-6">
                Enterprise-grade security infrastructure designed to protect your digital assets
                with multiple layers of encryption and monitoring.
              </p>
              
              <div className="space-y-3">
                {SECURITY_FEATURES.map(function(feature, index) {
                  return (
                    <div key={index} className="flex items-center gap-3 bg-slate-950/50 rounded-xl px-4 py-3 border border-slate-800/60">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-sky-400" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-black text-white mb-2">100% Insured</h3>
                  <p className="text-sm text-slate-400">Your assets are fully protected</p>
                </div>

                <div className="absolute top-4 right-4 flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                </div>
                
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. METATRADER 5 DOWNLOAD BANNER */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-3xl p-8 md:p-12 border border-slate-800/60">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Trade Anytime, Anywhere <br />
                <span className="text-sky-400">with MetaTrader 5</span>
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Access institutional-grade execution speeds, advanced charting indicators, 
                and global markets on the go. Seamlessly sync your Invest Guard portfolio 
                with the world's most powerful trading terminal.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium rounded-xl shadow-2xl shadow-sky-500/20 transition-all duration-200 hover:scale-105 inline-flex items-center gap-3 group"
                >
                  <Smartphone className="h-5 w-5" />
                  <div className="text-left">
                    <p className="text-xs opacity-80">GET IT ON</p>
                    <p className="font-bold">Google Play</p>
                  </div>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="https://apps.apple.com/app/metatrader-5/id413251709"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-slate-900/80 border border-slate-700/60 hover:border-sky-500/30 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 inline-flex items-center gap-3 group"
                >
                  <Apple className="h-5 w-5" />
                  <div className="text-left">
                    <p className="text-xs opacity-80">Download on</p>
                    <p className="font-bold">App Store</p>
                  </div>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">Institutional-grade execution</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">Advanced charting tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">Global market access</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] max-w-md mx-auto bg-gradient-to-br from-slate-900/50 to-slate-950/50 rounded-2xl border border-slate-700/50 p-4 shadow-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs text-slate-500 ml-2">MetaTrader 5 · Advanced Charts</span>
                </div>
                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/30">
                  <svg className="w-full h-32" viewBox="0 0 300 100">
                    <polyline
                      points="0,80 30,70 60,85 90,60 120,50 150,65 180,40 210,55 240,30 270,45 300,20"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      className="opacity-80"
                    />
                    <polyline
                      points="0,80 30,70 60,85 90,60 120,50 150,65 180,40 210,55 240,30 270,45 300,20"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="6"
                      className="opacity-20 blur-sm"
                    />
                    <circle cx="240" cy="30" r="4" fill="#34d399" />
                    <text x="245" y="35" fontSize="8" fill="#34d399" className="font-mono">$43,245</text>
                    <line x1="120" y1="0" x2="120" y2="100" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" strokeDasharray="4" />
                    <line x1="200" y1="0" x2="200" y2="100" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" strokeDasharray="4" />
                  </svg>
                  <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>08:00</span>
                    <span>12:00</span>
                    <span>16:00</span>
                    <span>20:00</span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-mono">
                  MT5 · v4.02
                </div>
                <div className="absolute top-4 right-4 flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-sky-500/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 border-t border-slate-800/60">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
            What Our Users Say
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real reviews from our community of traders and investors
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(function(testimonial, index) {
            return (
              <div key={index} className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 hover:border-sky-500/30 transition-all hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[0, 1, 2, 3, 4].map(function(i) {
                    return <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />;
                  })}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700/50"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-bold text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="border-t border-slate-800/60 bg-slate-950/90 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-black text-sm">IG</span>
                </div>
                <span className="text-lg font-black text-white">
                  INVEST<span className="text-sky-400">GUARD</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-xs">
                The leading institutional-grade trading platform for cryptocurrency and digital assets.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">About Us</h4>
              <ul className="space-y-2">
                {FOOTER_CATEGORIES.aboutUs.map(function(link) {
                  return (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Pricing</h4>
              <ul className="space-y-2">
                {FOOTER_CATEGORIES.pricing.map(function(link) {
                  return (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Plans</h4>
              <ul className="space-y-2">
                {FOOTER_CATEGORIES.plans.map(function(link) {
                  return (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mt-4 mb-2">Features</h4>
              <ul className="space-y-2">
                {FOOTER_CATEGORIES.features.map(function(link) {
                  return (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Help &amp; Support</h4>
              <ul className="space-y-2">
                {FOOTER_CATEGORIES.support.map(function(link) {
                  return (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2026 Invest Guard. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}