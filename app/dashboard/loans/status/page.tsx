"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LoanRequest {
  id: string;
  requested_amount: number;
  employment_status: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

export default function LoanStatusPage() {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserLoans() {
      try {
        setLoading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return;

        const { data, error } = await supabase
          .from('loan_requests')
          .select('id, requested_amount, employment_status, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setRequests(data as LoanRequest[]);
      } catch (err) {
        console.error("Error retrieving application status records:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserLoans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-sky-500" />
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Querying Ledger Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* SECTION HEADER & SUB-NAV SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Capital Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Simulated ingestion desk parsing financial parameters.</p>
        </div>
        
        {/* Toggle Controls */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-center">
          <Link 
            href="/dashboard/loans" 
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            ✍️ Apply
          </Link>
          <span className="px-3 py-1.5 text-xs font-bold bg-sky-500 text-slate-950 rounded-lg shadow-md cursor-default">
            📋 Status Desk
          </span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Your Active File Queue</h3>
          <span className="text-2xs font-mono bg-slate-950 border border-slate-800 text-sky-400 px-2.5 py-1 rounded-md">
            Total Requests: {requests.length}
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500 font-mono">
            No capital placement requests found for this profile node.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/40 text-2xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-4 pl-6">Application Reference ID</th>
                  <th className="p-4">Requested Value</th>
                  <th className="p-4">Employment Segment</th>
                  <th className="p-4 text-center">Review Status</th>
                  <th className="p-4 pr-6 text-right">Filing Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-400 truncate max-w-[120px]">{req.id}</td>
                    <td className="p-4 font-bold text-white">${req.requested_amount.toLocaleString()}</td>
                    <td className="p-4 text-slate-400 text-2xs font-sans">{req.employment_status}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block text-2xs font-bold px-2.5 py-1 rounded-md border ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'
                          : req.status === 'REJECTED'
                          ? 'bg-rose-950/30 text-rose-400 border-rose-900/50'
                          : 'bg-amber-950/30 text-amber-400 border-amber-900/50'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right text-slate-500 text-2xs">
                      {new Date(req.created_at).toLocaleString()}
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