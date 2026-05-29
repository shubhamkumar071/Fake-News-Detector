import React, { useState, useEffect } from 'react';
import { 
  Users, Library, ShieldCheck, Activity, Plus, Trash2, 
  AlertCircle, ShieldAlert, Sparkles, ScrollText, CheckCircle 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, sources, users, logs
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [sources, setSources] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Source form states
  const [domain, setDomain] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('TRUSTED');
  const [category, setCategory] = useState('Mainstream');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'analytics') {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data);
      } else if (activeTab === 'sources') {
        const res = await api.get('/sources');
        setSources(res.data);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } else if (activeTab === 'logs') {
        const res = await api.get('/admin/logs');
        setLogs(res.data);
      }
    } catch (err) {
      setError('Failed to retrieve administrative records. Check access level.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSource = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!domain || !name) {
      setError('Domain and Publisher Name are required.');
      return;
    }

    try {
      const res = await api.post('/admin/sources', {
        domain,
        name,
        status,
        category,
        description
      });
      setSources([res.data, ...sources]);
      setSuccess(`Source ${domain} added successfully.`);
      // Clear inputs
      setDomain('');
      setName('');
      setDescription('');
    } catch (err) {
      setError('Could not register domain. Source might already exist.');
    }
  };

  const handleDeleteSource = async (id) => {
    if (!window.confirm('Remove this domain record from registry?')) return;
    setError('');
    try {
      await api.delete(`/admin/sources/${id}`);
      setSources(sources.filter(s => s.id !== id));
      setSuccess('Source record deleted.');
    } catch (err) {
      setError('Could not delete domain.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Permanently delete this user account and lock access?')) return;
    setError('');
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      setSuccess('User account successfully terminated.');
    } catch (err) {
      setError('Could not delete user account.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 flex items-center gap-2">
              Security Operations Center <Sparkles className="w-6 h-6 text-purple-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Audit logs, modify source indices, and evaluate platform usage telemetry.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-8">
            {[
              { id: 'analytics', label: 'System Analytics', icon: Activity },
              { id: 'sources', label: 'Sources Registry', icon: Library },
              { id: 'users', label: 'Auditor Accounts', icon: Users },
              { id: 'logs', label: 'Admin Logs', icon: ScrollText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSuccess(''); setError(''); }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/5'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {success}
            </div>
          )}

          {/* Tab Content Rendering */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
            </div>
          ) : (
            <>
              {/* Analytics tab */}
              {activeTab === 'analytics' && analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Accounts Active", value: analytics.totalUsers, desc: `${analytics.regularUsers} Auditors / ${analytics.adminUsers} Admins` },
                    { label: "Total Audits Completed", value: analytics.totalReports, desc: "Platform scan histories" },
                    { label: "Credibility Average", value: `${analytics.avgCredibilityScore}%`, desc: "Mean facts-to-opinion rating" },
                    { label: "Risky Anomalies Found", value: analytics.fakeReportsDetected, desc: "Scans flagged < 50% credibility" }
                  ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[28px] glass-card border border-slate-800/40">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                      <h3 className="text-3xl font-extrabold mt-2 text-slate-200">{stat.value}</h3>
                      <p className="text-[10px] text-slate-500 mt-2">{stat.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Sources Registry Tab */}
              {activeTab === 'sources' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                  
                  {/* Registry creation form */}
                  <div className="glass-card rounded-[32px] p-6 border border-slate-800/50 flex flex-col gap-5">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-purple-400" /> Index New Publisher
                    </h3>
                    <form onSubmit={handleAddSource} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Domain</label>
                        <input
                          type="text"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          placeholder="e.g. dailytruth.com"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500/60"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Publisher Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Daily Truth Network"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500/60"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Reputation Status</label>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
                          >
                            <option value="TRUSTED">TRUSTED</option>
                            <option value="UNTRUSTED">UNTRUSTED</option>
                            <option value="BIASED">BIASED</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Category</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
                          >
                            <option value="Mainstream">Mainstream</option>
                            <option value="Satire">Satire</option>
                            <option value="Conspiracy">Conspiracy</option>
                            <option value="State-Media">State-Media</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Description / Notes</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Log remarks on publisher ideological leanings or histories of retraction..."
                          rows={3}
                          className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/60"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full mt-2 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black uppercase tracking-wider text-xs shadow-lg transition-colors"
                      >
                        Register Domain
                      </button>
                    </form>
                  </div>

                  {/* Sources List */}
                  <div className="xl:col-span-2 glass-card rounded-[32px] p-6 border border-slate-800/50 flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Indexed Publisher Base</h3>
                    {sources.length === 0 ? (
                      <p className="text-xs text-slate-500 py-8 text-center font-medium">No domain records indexed yet.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {sources.map((src) => {
                          let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                          if (src.status === 'UNTRUSTED') {
                            badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                          } else if (src.status === 'BIASED') {
                            badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                          }
                          
                          return (
                            <div
                              key={src.id}
                              className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800/60 flex items-center justify-between gap-4"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-black text-slate-200">{src.name}</h4>
                                  <span className="text-[9px] font-mono text-slate-500">({src.domain})</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{src.description}</p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${badgeColor}`}>
                                  {src.status}
                                </span>
                                <button
                                  onClick={() => handleDeleteSource(src.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                  title="Delete Source"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User Accounts Tab */}
              {activeTab === 'users' && (
                <div className="glass-card rounded-[32px] p-6 border border-slate-800/50 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Active Auditor Credentials</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4">Username</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Security Role</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-900/10 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-200">{u.username}</td>
                            <td className="py-3.5 px-4">{u.email}</td>
                            <td className="py-3.5 px-4">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                                u.role === 'ROLE_ADMIN' ? 'bg-purple-500/25 text-purple-300' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {u.role !== 'ROLE_ADMIN' && (
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                  title="Delete User Account"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Admin Logs Tab */}
              {activeTab === 'logs' && (
                <div className="glass-card rounded-[32px] p-6 border border-slate-800/50 flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Administrative Activity History</h3>
                  {logs.length === 0 ? (
                    <p className="text-xs text-slate-500 py-8 text-center font-medium">No actions logged yet.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {logs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-800/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <span className="font-bold text-slate-300">[{log.action}]</span>{' '}
                            <span className="text-slate-400 font-light">{log.details}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[9px] text-slate-500 shrink-0">
                            <span>Admin: {log.adminId}</span>
                            <span>•</span>
                            <span>{new Date(log.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
