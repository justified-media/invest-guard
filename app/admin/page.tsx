"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Wallet = dynamic(() => import('lucide-react').then((mod) => mod.Wallet), { ssr: false });
const Coins = dynamic(() => import('lucide-react').then((mod) => mod.Coins), { ssr: false });
const Users = dynamic(() => import('lucide-react').then((mod) => mod.Users), { ssr: false });
const Settings = dynamic(() => import('lucide-react').then((mod) => mod.Settings), { ssr: false });
const Check = dynamic(() => import('lucide-react').then((mod) => mod.Check), { ssr: false });
const X = dynamic(() => import('lucide-react').then((mod) => mod.X), { ssr: false });
const Save = dynamic(() => import('lucide-react').then((mod) => mod.Save), { ssr: false });
const ShieldAlert = dynamic(() => import('lucide-react').then((mod) => mod.ShieldAlert), { ssr: false });

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type TabType = 'deposits' | 'loans' | 'users' | 'settings';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('deposits');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Data pools
  const [data, setData] = useState<any[]>([]);
  const [walletSettings, setWalletSettings] = useState<{ [key: string]: string }>({});
  
  // Quick balance injection state variables
  const [fundingAmount, setFundingAmount] = useState<string>('');
  const [fundingUserId, setFundingUserId] = useState<string | null>(null);

  useEffect(() => {
    async function verifyAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
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

  const fetchTabData = async (tab: TabType) => {
    setLoading(true);
    if (tab === 'settings') {
      const { data: res } = await supabase.from('system_settings').select('*');
      if (res) {
        const configMap = res.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
        setWalletSettings(configMap);
      }
    } else {
      const targetTable = tab === 'users' ? 'profiles' : tab;
      const { data: result, error } = await supabase
        .from(targetTable)
        .select('*')
        .order(tab === 'users' ? 'username' : 'created_at', { ascending: false });
      
      if (!error && result) setData(result);
    }
    setLoading(false);
  };

  // Process Deposits & Loans
  const handleUpdateStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED', userId?: string, amount?: number) => {
    try {
      // 1. Update the ledger entry status (deposits or loans)
      const { error } = await supabase
        .from(activeTab)
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Fixed: Balance updates now apply to BOTH deposits and loans upon approval
      if (newStatus === 'APPROVED' && userId && amount) {
        // Fetch current user balance explicitly to prevent transaction mismatch overwrites
        const { data: currentProfile, error: profileError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        const currentBalance = currentProfile?.balance || 0;
        
        // Add the approved transaction amount to their existing profile balance
        const { error: balanceError } = await supabase
          .from('profiles')
          .update({ balance: currentBalance + amount })
          .eq('id', userId);

        if (balanceError) throw balanceError;
      }

      // Sync local component state array instantly
      setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      alert(`Transaction row updated successfully to ${newStatus}.`);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to execute data modification: ${err.message || "Unknown error"}`);
    }
  };

  // Admin Manual Balance Adjustment Handler
  const handleDirectFunding = async (userId: string) => {
    const value = parseFloat(fundingAmount);
    if (isNaN(value) || value <= 0) return alert("Enter a valid numerical value.");

    try {
      const { data: currentProfile } = await supabase.from('profiles').select('balance').eq('id', userId).single();
      const currentBalance = currentProfile?.balance || 0;

      const { error } = await supabase
        .from('profiles')
        .update({ balance: currentBalance + value })
        .eq('id', userId);

      if (error) throw error;

      setData(prev => prev.map(u => u.id === userId ? { ...u, balance: currentBalance + value } : u));
      setFundingUserId(null);
      setFundingAmount('');
      alert("User ledger balance adjusted successfully.");
    } catch (err) {
      alert("Error injecting funds.");
    }
  };

  // Toggle Admin clearance flags directly inside dashboard user rows
  const toggleUserAdminFlag = async (userId: string, currentFlag: boolean) => {
    try {
      await supabase.from('profiles').update({ is_admin: !currentFlag }).eq('id', userId);
      setData(prev => prev.map(u => u.id === userId ? { ...u, is_admin: !currentFlag } : u));
    } catch (err) {
      alert("Failed to modify user access privileges.");
    }
  };

  // Update System Crypto Input Settings
  const handleSaveSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase.from('system_settings').upsert({ key, value });
      if (error) throw error;
      alert("System parameter updated successfully.");
    } catch (err) {
      alert("Failed to preserve configuration rules.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-800 border-t-sky-500" />
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Loading Panel Database Layers...</p>
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
      
      {/* HEADER */}
      <div className="border-b border-slate-900 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          🛡️ Master Administrative Grid
        </h1>
        <p className="text-xs text-slate-400 mt-1">Global ecosystem configuration, asset adjustments, profile clearance management modules.</p>
      </div>

      {/* CORE NAVIGATION BAR */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-xl">
        {(['deposits', 'loans', 'users', 'settings'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'deposits' && <Wallet className="h-3.5 w-3.5" />}
            {tab === 'loans' && <Coins className="h-3.5 w-3.5" />}
            {tab === 'users' && <Users className="h-3.5 w-3.5" />}
            {tab === 'settings' && <Settings className="h-3.5 w-3.5" />}
            {tab}
          </button>
        ))}
      </div>

      {/* WORKSPACE PANELS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* DEPOSITS & LOANS TAB */}
        {(activeTab === 'deposits' || activeTab === 'loans') && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-800">
                  <th className="p-4 pl-6">Target User Reference</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Type Allocation</th>
                  <th className="p-4 text-center">Status Index</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono text-xs">
                {data.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center text-slate-500">QUEUE EMPTY</td></tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/10">
                      <td className="p-4 pl-6 text-slate-400 truncate max-w-[150px]">{row.user_id}</td>
                      <td className="p-4 font-bold text-white">${row.amount?.toLocaleString()}</td>
                      <td className="p-4 text-sky-400 font-bold">{row.asset_type || row.loan_tier || 'USD'}</td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                          row.status === 'APPROVED' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900' :
                          row.status === 'REJECTED' ? 'bg-rose-950/30 text-rose-400 border-rose-900' : 'bg-amber-950/30 text-amber-400 border-amber-900'
                        }`}>{row.status}</span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {row.status === 'PENDING' ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleUpdateStatus(row.id, 'APPROVED', row.user_id, row.amount)} className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-slate-950 cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleUpdateStatus(row.id, 'REJECTED')} className="p-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg hover:bg-rose-500 hover:text-slate-950 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                          </div>
                        ) : <span className="text-slate-600 italic text-[10px]">Settled</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS ACCOUNT MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-800">
                  <th className="p-4 pl-6">Profile Identifier</th>
                  <th className="p-4">Username Handle</th>
                  <th className="p-4">Active Core Balance</th>
                  <th className="p-4 text-center">Security Level</th>
                  <th className="p-4 pr-6 text-right">Financial Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono text-xs">
                {data.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/10">
                    <td className="p-4 pl-6 text-slate-500 text-[11px] font-bold">{user.id}</td>
                    <td className="p-4 font-bold text-white">{user.username || 'Anonymous Node'}</td>
                    <td className="p-4 text-emerald-400 font-black">${(user.balance || 0).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleUserAdminFlag(user.id, !!user.is_admin)} className={`px-2.5 py-1 rounded text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                        user.is_admin ? 'bg-sky-500 text-slate-950' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}>{user.is_admin ? 'ADMIN' : 'CLIENT'}</button>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {fundingUserId === user.id ? (
                        <div className="flex justify-end gap-1.5 items-center">
                          <input type="number" placeholder="Amt" value={fundingAmount} onChange={(e) => setFundingAmount(e.target.value)} className="w-20 bg-slate-950 border border-slate-800 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-sky-500" />
                          <button onClick={() => handleDirectFunding(user.id)} className="p-1 bg-emerald-500 text-slate-950 rounded cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setFundingUserId(null)} className="p-1 bg-slate-800 text-slate-400 rounded cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ) : (
                        <button onClick={() => setFundingUserId(user.id)} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all text-[11px] cursor-pointer">+ Load Funds</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SYSTEM WALLET INFRASTRUCTURE SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="p-6 space-y-6 font-mono text-xs">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-sky-400">System Gateway Parameters</h2>
            {Object.keys(walletSettings).length === 0 ? (
              <p className="text-slate-500 italic">No configuration nodes mapped to interface matrix layout.</p>
            ) : (
              Object.keys(walletSettings).map((key) => (
                <div key={key} className="space-y-2 max-w-xl border border-slate-800/60 bg-slate-950/40 p-4 rounded-xl">
                  <label className="block text-slate-400 font-bold uppercase tracking-wide text-[10px]">{key.replace(/_/g, ' ')}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={walletSettings[key]} 
                      onChange={(e) => setWalletSettings(prev => ({ ...prev, [key]: e.target.value }))}
                      className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 font-mono text-xs focus:outline-none focus:border-sky-500/40"
                    />
                    <button 
                      onClick={() => handleSaveSetting(key, walletSettings[key])}
                      className="p-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer"
                      title="Save Configuration Data"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}