"use client";

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoanDemoPage() {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [ssnMock, setSsnMock] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [cardNumberMock, setCardNumberMock] = useState('');
  const [employment, setEmployment] = useState('Employed');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("No authenticated session located.");

      // In a real database, you'd save reference strings or process via an API.
      // We will save the demographic metadata cleanly to show full-stack execution.
      const { error } = await supabase
        .from('loan_requests')
        .insert({
          user_id: user.id,
          full_name: fullName,
          date_of_birth: dob,
          requested_amount: parseFloat(loanAmount),
          employment_status: employment,
          status: 'PENDING',
          // Masking highly sensitive inputs right before database insertion as a best practice demo
          ssn_last_four: ssnMock.slice(-4) || '0000',
          card_last_four: cardNumberMock.slice(-4) || '0000'
        });

      if (error) throw error;

      setStatus({ success: true, message: "Demo Application logged! Check your Supabase table dashboard." });
      setFullName('');
      setDob('');
      setSsnMock('');
      setLoanAmount('');
      setCardNumberMock('');
    } catch (err: any) {
      console.error(err);
      setStatus({ success: false, message: err.message || "Database connection error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Capital Verification & Credit Form</h1>
        <p className="text-sm text-slate-400 mt-1">Simulated portal demonstrating front-to-back financial document ingestion parsing.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <form onSubmit={handleApplicationSubmit} className="space-y-4">
          
          {status && (
            <div className={`p-4 rounded-xl border text-xs font-mono ${
              status.success 
                ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' 
                : 'bg-rose-950/30 text-rose-400 border-rose-900/50'
            }`}>
              {status.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs uppercase tracking-wider text-slate-400 font-bold mb-2">Legal Full Name</label>
              <input
                type="text"
                required
                placeholder="Justice Developer"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-2xs uppercase tracking-wider text-slate-400 font-bold mb-2">Date of Birth</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-sky-500 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs uppercase tracking-wider text-slate-400 font-bold mb-2">Social Security Number (SSN)</label>
              <input
                type="password"
                required
                maxLength={9}
                placeholder="000000000"
                value={ssnMock}
                onChange={(e) => setSsnMock(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-sky-500 transition-colors tracking-widest"
              />
            </div>

            <div>
              <label className="block text-2xs uppercase tracking-wider text-slate-400 font-bold mb-2">Requested Loan Amount ($)</label>
              <input
                type="number"
                required
                placeholder="5000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs uppercase tracking-wider text-slate-400 font-bold mb-2">Credit Card Account Number</label>
              <input
                type="text"
                required
                maxLength={16}
                placeholder="4000 1234 5678 9010"
                value={cardNumberMock}
                onChange={(e) => setCardNumberMock(e.target.value.replace(/\s/g, ''))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-2xs uppercase tracking-wider text-slate-400 font-bold mb-2">Employment Structure</label>
              <select
                value={employment}
                onChange={(e) => setEmployment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-sky-500 transition-colors"
              >
                <option value="Employed">Employed Node</option>
                <option value="Self-Employed">Freelance Engineer</option>
                <option value="Contractor">Remote Operator</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold uppercase tracking-wider text-xs py-4 rounded-xl transition-all cursor-pointer mt-2"
          >
            {loading ? 'Transmitting Ingestion File...' : 'Submit Application Verification'}
          </button>
        </form>
      </div>
    </div>
  );
}