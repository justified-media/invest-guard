'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import the router for redirecting
import { supabase } from '@/utils/supabase';

export default function SignupPage() {
  const router = useRouter(); // Initialize router instance
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle Google Registration
  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/v1/callback`,
      },
    });
    if (error) setMessage(`Error: ${error.message}`);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 1. Create the user account (with confirmation disabled, they are automatically active!)
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      setMessage(`Error: ${error.message}`);
      setLoading(false);
      return;
    }

    // 2. Double-check if a session was created right away
    if (data?.session) {
      setMessage('Account created! Entering dashboard...');
      router.refresh();
      router.push('/dashboard');
    } else {
      // Fallback: If Supabase didn't automatically start the session, sign them in manually
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (loginError) {
        setMessage(`Account created, but auto-login failed: ${loginError.message}`);
        setLoading(false);
      } else {
        setMessage('Success! Entering dashboard...');
        router.refresh();
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-6 left-6">
        <Link href="/" className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors">
          ← Back to InvestGuard
        </Link>
      </div>

      <div className="sm:mx-auto w-full max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create your free account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          InvestGuard is the best investment trading platform.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/60 rounded-2xl space-y-6">
          
          {/* GOOGLE SIGN UP BUTTON */}
          <div>
            <button
              onClick={handleGoogleSignUp}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-300 rounded-xl shadow-sm bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.21 8.79 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.45h6.45c-.28 1.47-1.11 2.72-2.36 3.56l3.66 2.84c2.14-1.98 3.39-4.89 3.39-8.5z"/>
                <path fill="#FBBC05" d="M5.1 14.7c-.25-.75-.4-1.55-.4-2.38s.15-1.63.4-2.38L1.5 7.14C.54 9.07 0 11.23 0 13.5s.54 4.43 1.5 6.36l3.6-2.86z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.9 1.09-3.21 0-5.99-2.17-6.96-5.26l-3.6 2.81C3.4 20.35 7.35 23 12 23z"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-xs text-slate-400 uppercase tracking-wider">Or email signup</span>
          </div>

          {/* EMAIL FORM */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
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
                className="mt-1 block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                placeholder="Minimum 6 characters"
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
                className="w-full flex justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Register Account'}
              </button>
            </div>
          </form>

          <div className="text-center pt-2">
            <Link href="/login" className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors">
              Already have an account? Log In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}