'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function AuthPage() {
  // Basic State Management: true = Login view, false = Sign Up view
  const [isLogin, setIsLogin] = useState(true);
  
  // Input form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle Form Submission
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isLogin) {
      // Log the user into InvestGuard
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Success! Logging you in...');
        // We will route to the dashboard next!
      }
    } else {
      // Register a brand new user account
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Registration successful! Check your email for the confirmation link.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Back to Home Navigation */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors">
          ← Back to InvestGuard
        </Link>
      </div>

      <div className="sm:mx-auto w-full max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          {isLogin ? 'Sign in to InvestGuard' : 'Create your free account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          InvestGuard is the best investment trading platform.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/60 rounded-2xl space-y-6">
          
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-xl text-xs font-medium ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-700'}`}>
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register Account'}
              </button>
            </div>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-xs text-slate-400 uppercase tracking-wider">Or</span>
          </div>

          <div className="text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
              className="text-sm font-medium text-sky-600 hover:text-sky-700 focus:outline-none transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}