import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ChevronRight, FileSpreadsheet, Trash2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/history');
      setHistory(res.data);
    } catch (err) {
      setError('Could not retrieve audit history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this report from your archive?')) return;

    try {
      await api.delete(`/analysis/report/${id}`);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete report.');
    }
  };

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.url && item.url.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 flex items-center gap-2">
                Audit Archive <Sparkles className="w-6 h-6 text-cyan-400" />
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Review, filter, and export details of past credibility logs.</p>
            </div>
            
            {/* Search Filter input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute inset-y-0 left-0 pl-3 w-4.5 h-4.5 my-auto text-slate-500" />
              <input
                type="text"
                placeholder="Search statements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-800/80 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4" /> {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="glass-card rounded-[32px] p-12 text-center border border-slate-800/50 flex flex-col items-center justify-center">
              <FileSpreadsheet className="w-16 h-16 text-slate-700 mb-4" />
              <h3 className="text-lg font-bold text-slate-300">No logs found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[280px] leading-relaxed">
                {searchQuery ? 'Adjust your search queries.' : 'Deploy a new statement audit to populate details here.'}
              </p>
              {!searchQuery && (
                <Link to="/dashboard" className="mt-6 flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 px-4 py-2.5 rounded-xl transition-all">
                  Create First Audit <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistory.map((item) => {
                let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (item.credibilityScore < 40) {
                  badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                } else if (item.credibilityScore < 70) {
                  badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                }

                return (
                  <Link
                    key={item.id}
                    to={`/report/${item.id}`}
                    className="group glass-card rounded-3xl p-6 border border-slate-800/50 hover:border-cyan-500/20 flex flex-col justify-between h-[200px] transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5" /> {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <div className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${badgeColor}`}>
                          {item.credibilityScore} CR
                        </div>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-200 mt-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/50 pt-4 mt-4">
                      <span className="text-[10px] font-bold text-slate-500 truncate max-w-[150px]">
                        Domain: {item.sourceVerification.domain}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;
