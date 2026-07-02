'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// 1. EXACT PRODUCT MATRIX - Based on image_896758.png
const PLANS_DATA_NODES = [
  { 
    name: "Starter Tier", 
    value: "$500", 
    roi: "5x ROI", 
    returnAmount: "$2,500",
    description: "Entry-level institutional access with automated yield routing"
  },
  { 
    name: "Silver Tier", 
    value: "$1,000", 
    roi: "5x ROI", 
    returnAmount: "$5,000", 
    badge: "GREAT VALUE",
    description: "Enhanced allocation with priority execution channels"
  },
  { 
    name: "Gold Premium", 
    value: "$2,500", 
    roi: "4x ROI", 
    returnAmount: "$10,000", 
    badge: "POPULAR PLAN",
    description: "Premium tier with dedicated node infrastructure"
  },
  { 
    name: "Platinum Pro", 
    value: "$5,000", 
    roi: "4x ROI", 
    returnAmount: "$20,000",
    description: "Professional-grade with advanced compounding algorithms"
  },
  { 
    name: "VIP Executive", 
    value: "$10,000", 
    roi: "5x ROI", 
    returnAmount: "$50,000", 
    badge: "MAX ELITE",
    description: "Executive access with priority OTC desk and custom strategies"
  }
];

// Feature data for institutional stability section
const FEATURES_DATA = [
  {
    id: "01",
    title: "Institutional Custody",
    description: "Assets are sequestered in separate multi-signature cold storage vaults safeguarded by continuous telemetry tracking grids and biometrically sealed access layers."
  },
  {
    id: "02",
    title: "Automated Micro-Compounding",
    description: "Algorithmic modules auto-reinvest premium yields instantly to minimize dispersion overhead. Our proprietary engine executes 1.2M+ rebalancing ops per second."
  },
  {
    id: "03",
    title: "Global Scalability",
    description: "Instant programmatic checkout interfaces optimized for multi-regional settlement paths. Seamless integration with 40+ fiat on-ramps and cross-chain bridges."
  },
  {
    id: "04",
    title: "Real-Time Risk Oracle",
    description: "Dynamic exposure monitoring with automated hedge triggers. Our oracle network aggregates 150+ data feeds to ensure capital preservation in volatile regimes."
  },
  {
    id: "05",
    title: "Compliance & Audit Trail",
    description: "Every transaction is immutably logged and timestamped. Full SOC2 Type II & ISO 27001 certified infrastructure with quarterly third-party audits."
  }
];

// Testimonial data
const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Chief Investment Officer, Quantum Capital",
    content: "InvestGuard's institutional node infrastructure has revolutionized our yield generation strategy. The 5x ROI on our VIP Executive allocation exceeded all projections.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Founder, CryptoVault Ventures",
    content: "The automated micro-compounding engine is a game-changer. We've seen consistent 4x returns with minimal overhead. Gold Premium tier is exceptional value.",
    rating: 5
  },
  {
    name: "Dr. Emily Watson",
    role: "Head of Research, Blockchain Institute",
    content: "The multi-signature infrastructure and bank-grade custody provide the security we require for institutional deployment. Platinum Pro tier is our go-to.",
    rating: 5
  }
];

// Telemetry metrics for social proof
const METRICS_DATA = [
  { value: "50K+", label: "Active Accounts" },
  { value: "$2.4B", label: "Managed Volume" },
  { value: "99.99%", label: "Engine Uptime" },
  { value: "4.9★", label: "Audit Score" }
];

const ADDITIONAL_METRICS = [
  "0.01ms Latency",
  "150+ Assets",
  "24/7 Support"
];

// Counter Animation Component
const Counter = ({ target, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <span ref={counterRef} className="text-3xl md:text-4xl font-black text-sky-400">
      {prefix}{count}{suffix}
    </span>
  );
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Generate particles only on client side to avoid hydration mismatch
    const newParticles = Array.from({ length: 20 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/30 selection:text-white overflow-x-hidden">
      
      {/* 1. PREMIUM HEADER NAVBAR */}
      <header className={`border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg shadow-sky-500/5' : ''
      }`}>
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-sky-500/20">
              IG
            </div>
            <span className="text-xl font-black tracking-tight text-white font-mono">
              INVEST<span className="text-sky-400 font-sans font-black">GUARD</span>
            </span>
            <span className="hidden lg:inline-block ml-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 border-l border-slate-800 pl-4">
              Institutional Node
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link 
              href="#" 
              className="hidden md:inline-block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors hover:scale-105 transform"
            >
              
            </Link>
            <Link 
              href="#" 
              className="hidden md:inline-block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors hover:scale-105 transform"
            >
              
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 text-xs font-mono font-bold tracking-wider uppercase text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-800 rounded-lg hover:scale-105 transform"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400 hover:bg-sky-500 hover:text-white transition-all duration-300 shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 hover:scale-105 transform"
            >
              Secure Sign Up →
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION WITH ANIMATED BACKGROUND */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-32 md:pt-32 md:pb-44 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse delay-700" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'gridMove 20s linear infinite'
          }} />
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900/80 border border-slate-800/60 backdrop-blur-sm mb-10 shadow-inner animate-bounce-slow">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-slate-400">
              ⚡ Global Institutional Node · 99.99% Uptime
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight text-white mb-8 uppercase font-sans animate-fade-in">
            Secure Wealth Yield <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Institutional Precision
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-mono uppercase tracking-wide animate-slide-up">
            Automate tier-based compilation matrices. Deploy locked liquidity pools directly into audited yield farms with <span className="text-white font-bold">InvestGuard Systems</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-slide-up-delay">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-mono font-bold uppercase tracking-wider text-xs rounded-xl shadow-2xl shadow-sky-500/20 transition-all duration-200 hover:scale-[1.05] min-w-[240px] group"
            >
              <span className="group-hover:animate-pulse">Deploy Capital Instantly</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <span className="flex items-center text-[10px] font-mono uppercase tracking-wider text-slate-500 gap-2">
              <span className="text-sky-400 animate-pulse">🔒</span> 256-Bit Telemetry Encryption
            </span>
          </div>

          {/* Hero Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-24 pt-10 border-t border-slate-800/80 font-mono text-[10px] uppercase tracking-widest text-slate-400">
            <div className="flex items-center justify-center gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm hover:border-sky-500/30 transition-all hover:scale-105 transform group">
              <span className="text-sky-400 text-lg group-hover:rotate-12 transition-transform">🛡️</span> Bank-Grade Audited Custody
            </div>
            <div className="flex items-center justify-center gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm hover:border-sky-500/30 transition-all hover:scale-105 transform group">
              <span className="text-sky-400 text-lg group-hover:rotate-12 transition-transform">⏰</span> Live Microsecond Tick Feeds
            </div>
            <div className="flex items-center justify-center gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm hover:border-sky-500/30 transition-all hover:scale-105 transform group">
              <span className="text-sky-400 text-lg group-hover:rotate-12 transition-transform">🔐</span> Multi-Signature Infrastructure
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC INVESTMENT TIERS */}
      <section className="bg-slate-950 border-y border-slate-800/60 py-28 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-sky-400 bg-sky-500/10 px-4 py-1.5 rounded-full border border-sky-500/20 animate-pulse">
              Portfolio Compound Matrix
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mt-6 font-mono">
              Available Investment Tiers
            </h2>
            <p className="text-slate-400 font-mono text-xs uppercase max-w-2xl mx-auto mt-3 tracking-wide">
              Select an asset allocation layer below to initiate automated trading routing protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
            {PLANS_DATA_NODES.map((plan, index) => (
              <div
                key={index}
                className={`bg-slate-900/70 rounded-3xl p-8 border backdrop-blur-sm flex flex-col relative transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(56,189,248,0.25)] ${
                  plan.badge ? 'border-sky-500/30' : 'border-slate-800/60'
                } ${index === 2 ? 'md:scale-105' : ''}`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-6 text-slate-950 font-mono text-[9px] font-black uppercase px-3 py-0.5 rounded-md tracking-widest shadow-md animate-pulse ${
                    plan.badge === "POPULAR PLAN" 
                      ? "bg-gradient-to-r from-amber-400 to-amber-500" 
                      : plan.badge === "MAX ELITE"
                      ? "bg-purple-500"
                      : "bg-sky-500"
                  }`}>
                    {plan.badge}
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-mono font-black text-slate-200 uppercase tracking-wider">
                    {plan.name}
                  </h3>
                  <span className="text-[10px] font-mono font-black text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded animate-pulse">
                    {plan.roi}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed mb-4">
                  {plan.description}
                </p>
                <div className="border-b border-slate-800/60 pb-6 mb-6 font-mono">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Plan Value</p>
                  <p className="text-4xl font-black text-white tracking-tight mt-1">{plan.value}</p>
                </div>
                <div className="flex justify-between items-center font-mono text-xs mb-8">
                  <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">Guaranteed Return</span>
                  <span className="text-emerald-400 font-black tracking-wide animate-pulse">{plan.returnAmount}</span>
                </div>
                <Link
                  href={`/purchase?tier=${plan.name.toLowerCase().replace(/ /g, "-")}`}
                  className="w-full text-center inline-flex justify-center items-center py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-200 shadow-md shadow-sky-500/10 active:scale-[0.99] mt-auto hover:scale-105 transform group"
                >
                  Purchase Plan
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center text-[10px] font-mono uppercase tracking-widest text-slate-500 border-t border-slate-800/60 pt-8">
            <span className="text-sky-400">⏤</span> bulk allocations &amp; enterprise vaults available · contact OTC desk <span className="text-sky-400">⏤</span>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-28 md:py-36">
        <div className="text-center mb-24">
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-sky-400 bg-sky-500/10 px-4 py-1.5 rounded-full border border-sky-500/20">
            Core Architecture
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white font-mono uppercase tracking-tight mt-6">
            Engineered For Absolute Stability
          </h2>
          <p className="text-slate-400 font-mono text-xs max-w-xl mx-auto uppercase tracking-wider mt-3">
            Enterprise trading rails optimized for rapid execution parameters.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {FEATURES_DATA.slice(0, 3).map((feature, index) => (
            <div
              key={feature.id}
              className="bg-gradient-to-br from-slate-900 to-slate-950/90 rounded-3xl p-10 border border-slate-800/60 group transition-all hover:border-sky-500/30 hover:-translate-y-2 transform duration-300"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
              }}
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-8 text-3xl font-mono font-black text-sky-400 group-hover:scale-110 transition-transform duration-300">
                  {feature.id}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-xs font-mono font-black text-sky-400">
                  {feature.id}
                </div>
              </div>
              <h3 className="text-lg font-mono font-black text-white uppercase tracking-wider mb-4">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono uppercase tracking-wide">
                {feature.description}
              </p>
              <div className="mt-6 h-0.5 w-12 bg-sky-500/30 group-hover:w-20 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10 mt-10">
          {FEATURES_DATA.slice(3).map((feature, index) => (
            <div
              key={feature.id}
              className="bg-gradient-to-br from-slate-900 to-slate-950/90 rounded-3xl p-10 border border-slate-800/60 group transition-all hover:border-sky-500/30 hover:-translate-y-2 transform duration-300"
              style={{
                animation: `fadeInUp 0.6s ease-out ${(index + 3) * 0.15}s both`
              }}
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-8 text-3xl font-mono font-black text-sky-400 group-hover:scale-110 transition-transform duration-300">
                  {feature.id}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-xs font-mono font-black text-sky-400">
                  {feature.id}
                </div>
              </div>
              <h3 className="text-lg font-mono font-black text-white uppercase tracking-wider mb-4">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono uppercase tracking-wide">
                {feature.description}
              </p>
              <div className="mt-6 h-0.5 w-12 bg-sky-500/30 group-hover:w-20 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="bg-slate-950 border-y border-slate-800/60 py-28 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-sky-400 bg-sky-500/10 px-4 py-1.5 rounded-full border border-sky-500/20">
              Client Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mt-6 font-mono">
              Trusted By Industry Leaders
            </h2>
            <p className="text-slate-400 font-mono text-xs max-w-xl mx-auto mt-3 tracking-wide">
              Real results from institutional investors and fund managers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-900/70 rounded-3xl p-8 border border-slate-800/60 backdrop-blur-sm transition-all hover:border-sky-500/30 hover:-translate-y-2 transform duration-300"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500/20 to-indigo-500/20 flex items-center justify-center text-2xl font-mono font-black text-sky-400 border border-sky-500/20">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-mono font-black text-white text-sm uppercase tracking-wider">
                      {testimonial.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TELEMETRY METRICS WITH ANIMATED COUNTERS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-28 md:py-36">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900/60 rounded-3xl p-10 border border-slate-800/60 font-mono text-center backdrop-blur-sm">
          {METRICS_DATA.map((metric, index) => (
            <div 
              key={index}
              className="group hover:scale-105 transform transition-all duration-300"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
              }}
            >
              {metric.value.includes('K') ? (
                <Counter target={50} suffix="K+" />
              ) : metric.value.includes('B') ? (
                <Counter target={2.4} prefix="$" suffix="B" />
              ) : metric.value.includes('%') ? (
                <Counter target={99.99} suffix="%" />
              ) : (
                <Counter target={4.9} suffix="★" />
              )}
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-2">{metric.label}</div>
              <div className="w-8 h-0.5 bg-sky-500/30 mx-auto mt-3 group-hover:w-16 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 max-w-3xl mx-auto text-center">
          {ADDITIONAL_METRICS.map((metric, index) => (
            <div
              key={index}
              className={`text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-sky-400 transition-colors ${
                index < ADDITIONAL_METRICS.length - 1 ? 'border-r border-slate-800/60 pr-4' : ''
              }`}
            >
              {metric}
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA SECTION WITH ANIMATION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-28 md:pb-36">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950/90 rounded-3xl p-14 md:p-20 text-center border border-slate-800/60 shadow-2xl group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none animate-pulse delay-700" />
          
          {/* Animated particles - only rendered on client side */}
          {particles.length > 0 && (
            <div className="absolute inset-0 overflow-hidden">
              {particles.map((particle, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-sky-400/20 rounded-full"
                  style={{
                    top: `${particle.top}%`,
                    left: `${particle.left}%`,
                    animation: `float ${particle.duration}s linear infinite`,
                    animationDelay: `${particle.delay}s`
                  }}
                />
              ))}
            </div>
          )}

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-sky-400 bg-sky-500/10 px-4 py-1.5 rounded-full border border-sky-500/20 animate-pulse">
              Finalize Deployment
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-8 mb-6 uppercase font-mono tracking-tight animate-pulse">
              Initialize Allocation Matrix
            </h2>
            <p className="text-sm text-slate-400 font-mono uppercase tracking-wide mb-10 leading-relaxed max-w-2xl mx-auto">
              Open your core secure investor profile now and execute programmatic liquidity contracts. <br className="hidden sm:block" />
              <span className="text-slate-500">Full KYC &amp; AML compliance pre-integrated.</span>
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-12 py-5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-200 shadow-2xl shadow-sky-500/20 hover:shadow-sky-500/30 hover:scale-105 transform group"
            >
              Configure Live Account →
              <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
            </Link>
            <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-1">
                <span className="text-emerald-400 animate-pulse">✓</span> No hidden fees
              </span>
              <span className="w-px h-4 bg-slate-800"></span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-400 animate-pulse">✓</span> Instant withdrawal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-slate-800/60 bg-slate-950/90 py-12 font-mono text-[10px] uppercase tracking-widest text-slate-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-bold text-sm">
              INVEST<span className="text-sky-400 font-sans font-black">GUARD</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-600 tracking-normal">INSTITUTIONAL NODE v3.2.1</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 justify-center">
            <Link href="#" className="hover:text-slate-300 transition-colors hover:scale-105 transform">Privacy</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors hover:scale-105 transform">Terms</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors hover:scale-105 transform">Audit</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors hover:scale-105 transform">Status</Link>
          </div>
          <p className="tracking-normal text-slate-600 text-[9px]">
            © 2026 InvestGuard Systems. All active data pipelines operational.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6 pt-6 border-t border-slate-800/40 flex justify-between text-[8px] text-slate-700">
          <span>🔒 256-bit SSL · SOC2 Type II · ISO 27001</span>
          <span>⚡ latency &lt; 0.8ms</span>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }

        .animate-slide-up-delay {
          animation: slideUp 0.8s ease-out 0.3s both;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0f172a;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #0ea5e9, #6366f1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #38bdf8, #818cf8);
        }

        /* Card hover effects */
        .tier-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tier-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -20px rgba(56, 189, 248, 0.25);
        }

        .glow-card {
          box-shadow: 0 0 40px -10px rgba(56, 189, 248, 0.08);
        }
      `}</style>
    </div>
  );
}