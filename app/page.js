// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            Invest<span className="text-sky-500">Guard</span>
          </span>
        </div>
        <Link
          href="/login"
          className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          Login
        </Link>
        
        <Link
          href="/signUp"
          className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          Sign up
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-sky-50 border border-sky-100 mb-8">
            <span className="text-sm font-medium text-sky-700">
              🌟 Trusted by 50,000+ Investors Worldwide
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900 mb-6">
            InvestGuard is the best{" "}
            <span className="text-sky-500">investment trading</span> platform
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Secure your wealth and master the markets with our institutional-grade 
            investment platform. Built for both beginners and seasoned investors.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 transition-all duration-200 hover:shadow-xl hover:shadow-sky-300 text-base min-w-[200px]"
            >
              Get Started Instantly
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <span className="flex items-center text-sm text-slate-500">
              <span className="mr-2">🔒</span> Free & secure sign-up
            </span>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sky-500 text-lg">🛡️</span>
              <span className="text-sm text-slate-600">Institutional-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sky-500 text-lg">⏰</span>
              <span className="text-sm text-slate-600">24/7 Market Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sky-500 text-lg">🔐</span>
              <span className="text-sm text-slate-600">256-bit Encryption</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose InvestGuard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why choose <span className="text-sky-500">InvestGuard</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            A smarter way to invest, backed by cutting-edge technology and 
            unparalleled security.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group">
            <div className="w-14 h-14 rounded-xl bg-sky-50 group-hover:bg-sky-100 transition-colors flex items-center justify-center mb-6 text-3xl">
              🛡️
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Institutional-Grade Protection
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Your wealth deserves the highest level of security. We employ 
              bank-grade encryption and multi-layer authentication protocols.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group">
            <div className="w-14 h-14 rounded-xl bg-sky-50 group-hover:bg-sky-100 transition-colors flex items-center justify-center mb-6 text-3xl">
              📈
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Intelligent Portfolio Growth
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Our AI-powered insights help you make informed decisions and 
              automatically optimize your portfolio for long-term growth.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group">
            <div className="w-14 h-14 rounded-xl bg-sky-50 group-hover:bg-sky-100 transition-colors flex items-center justify-center mb-6 text-3xl">
              👥
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Community of Investors
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Join thousands of investors who trust InvestGuard for their 
              financial future. Share insights and grow together.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-sky-500 mb-2">50K+</div>
            <div className="text-sm text-slate-600">Active Investors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-sky-500 mb-2">$2.4B</div>
            <div className="text-sm text-slate-600">Assets Under Management</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-sky-500 mb-2">99.9%</div>
            <div className="text-sm text-slate-600">Platform Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-sky-500 mb-2">4.9★</div>
            <div className="text-sm text-slate-600">User Rating</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to secure your wealth?
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              Join InvestGuard today and take control of your financial future 
              with confidence.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-sky-500/40 text-base"
            >
              Get Started Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm font-medium text-slate-900">
            Invest<span className="text-sky-500">Guard</span>
          </span>
          <p className="text-sm text-slate-500">
            © 2026 InvestGuard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}