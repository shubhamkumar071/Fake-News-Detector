import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, BarChart2, ShieldAlert } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const ProfilePage = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { username: 'Guest', email: 'guest@example.com', role: 'ROLE_USER' };
  const [stats, setStats] = useState({ total: 0, avg: 0, risky: 0 });

  useEffect(() => {
    fetchHistoryStats();
  }, []);

  const fetchHistoryStats = async () => {
    try {
      const res = await api.get('/analysis/history');
      if (res.data && res.data.length > 0) {
        const total = res.data.length;
        const sum = res.data.reduce((acc, curr) => acc + curr.credibilityScore, 0);
        const avg = Math.round(sum / total);
        const risky = res.data.filter(r => r.credibilityScore < 45).length;
        setStats({ total, avg, risky });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-4xl mx-auto w-full overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-100">User Profile</h1>
            <p className="text-xs text-slate-400 mt-1">Manage credentials and monitor verification metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Left Card: Account Card */}
            <div className="md:col-span-2 glass-card rounded-[32px] p-6 md:p-8 border border-slate-800/50 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">{user.username}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/20 inline-block mt-1">
                    {user.role === 'ROLE_ADMIN' ? 'Security Administrator' : 'Verified Auditor'}
                  </span>
                </div>
              </div>

              <div className="h-[1px] bg-slate-850 my-2"></div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</p>
                    <p className="font-semibold text-slate-200 mt-0.5">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Shield className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Access Level</p>
                    <p className="font-semibold text-slate-200 mt-0.5">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered Since</p>
                    <p className="font-semibold text-slate-200 mt-0.5">May 2026</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Statistics Info */}
            <div className="glass-card rounded-[32px] p-6 border border-slate-800/50 flex flex-col gap-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Audits Analytics</h4>

              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Audits Completed</p>
                    <p className="text-2xl font-black mt-1 text-slate-200">{stats.total}</p>
                  </div>
                  <BarChart2 className="w-6 h-6 text-cyan-400" />
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Mean Credibility</p>
                    <p className="text-2xl font-black mt-1 text-slate-200">{stats.avg}%</p>
                  </div>
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Risky Flagged</p>
                    <p className="text-2xl font-black mt-1 text-slate-200">{stats.risky}</p>
                  </div>
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
