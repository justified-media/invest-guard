"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Vercel-safe dynamic icon loading optimization vectors
const Wallet = dynamic(() => import('lucide-react').then((mod) => mod.Wallet), { ssr: false });
const Coins = dynamic(() => import('lucide-react').then((mod) => mod.Coins), { ssr: false });
const ArrowUpRight = dynamic(() => import('lucide-react').then((mod) => mod.ArrowUpRight), { ssr: false });
const Check = dynamic(() => import('lucide-react').then((mod) => mod.Check), { ssr: false });
const X = dynamic(() => import('lucide-react').then((mod) => mod.X), { ssr: false });
const ShieldAlert = dynamic(() => import('lucide-react').then((mod) => mod.ShieldAlert), { ssr: false });

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type TabType = 'deposits' | 'loans' | 'removals';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('deposits');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 1. Verify user's admin role status on layout mount
  useEffect(() => {
    async function verifyAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Changed: Enforce absolute isolation by routing straight to our custom administrative terminal gate
      if (!user) {
        router.push('/admin/login?message=Secure gate authorization required');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (profile?.is_admin) {
        setIsAdmin(true);
        fetchTabData(activeTab);
      } else {
        setLoading(false);
      }
    }
    verifyAdmin();
  }, [activeTab, router]);

  // 2. Load rows dynamically from the selected feature table
  const fetchTabData = async (tab: TabType) => {
    setLoading(true);
    const { data: result, error } = await supabase
      .from(tab)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && result) setData(result);
    setLoading(false);
  };

  // 3. Update transaction row status handler
  const handleUpdateStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const { error } = await supabase
        .from(activeTab)
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update UI state instantly without requiring a full page refresh
      setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (err) {
      console.error("Error updating transaction row:", err);
      alert("Failed to update status on database table.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-800 border-t-sky-500" />
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Loading Records...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-12 w-12 bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center rounded-2xl mb-4">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-lg font-bold text-white">Access Denied</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">This space is restricted to authenticated portal administrators.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-900 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          🛡️ Admin Control Panel <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-md">Master</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review and action pending customer deposits, capital loans, and removal transfers across the ecosystem.</p>
      </div>

      {/* SEGMENT TAB NAVIGATION */}
      <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md">
        {(['deposits', 'loans', 'removals'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab 
                ? 'bg-sky-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'deposits' && <Wallet className="h-3.5 w-3.5" />}
            {tab === 'loans' && <Coins className="h-3.5 w-3.5" />}
            {tab === 'removals' && <ArrowUpRight className="h-3.5 w-3.5" />}
            {tab}
          </button>
        ))}
      </div>

      {/* DATA MANAGEMENT WORKSPACE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {data.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-slate-500 uppercase tracking-wider">
            No entries found in this ledger queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-800">
                  <th className="p-4 pl-6">Account ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Asset Type / Details</th>
                  {activeTab === 'removals' && <th className="p-4">Destination Target</th>}
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono text-xs text-slate-300">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 pl-6 text-slate-400 truncate max-w-[120px] font-bold">{row.user_id}</td>
                    <td className="p-4 font-bold text-white">${row.amount?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-400 font-bold">
                        {row.asset_type || row.loan_tier || 'USD'}
                      </span>
                    </td>
                    {activeTab === 'removals' && (
                      <td className="p-4 text-slate-400 truncate max-w-[140px] text-[11px]">{row.destination_address}</td>
                    )}
                    <td className="p-4 text-center">
                      <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded border ${
                        row.status === 'APPROVED'
                          ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'
                          : row.status === 'REJECTED'
                          ? 'bg-rose-950/30 text-rose-400 border-rose-900/50'
                          : 'bg-amber-950/30 text-amber-400 border-amber-900/50'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {row.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(row.id, 'APPROVED')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all cursor-pointer"
                            title="Approve Transaction"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(row.id, 'REJECTED')}
                            className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-slate-950 transition-all cursor-pointer"
                            title="Reject Transaction"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}