"use client";

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ShieldLock = dynamic(() => import('lucide-react').then((mod) => mod.ShieldAlert), { ssr: false });

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Authenticate credentials via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Authentication context assignment failed.");

      // 2. Immediately verify if this user possesses Master Clearance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile?.is_admin) {
        // Force log out immediately if a standard user tries to log in here
        await supabase.auth.signOut();
        throw new Error("Unauthorized Access: This terminal requires elevated privileges.");
      }

      // 3. Clear pass, route straight to Admin Panel Master Workspace
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || "An unexpected security validation error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center rounded-2xl">
            <ShieldLock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">Admin Terminal Gate</h1>
          <p className="text-xs text-slate-500">Authorized personnel node verification gateway.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono rounded-xl">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleAdminSignIn} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold uppercase tracking-wider">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50"
              placeholder="name@investguard.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold uppercase tracking-wider">Security Access Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-slate-950 font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
          >
            {loading ? 'Verifying Credentials...' : 'Request Access'}
          </button>
        </form>
      </div>
    </div>
  );
}