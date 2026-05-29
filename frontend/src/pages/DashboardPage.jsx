import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileText, Link2, UploadCloud, Mic, MicOff, Play, ShieldAlert, 
  Search, Calendar, ChevronRight, FileSpreadsheet, Activity, Sparkles, BarChart2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('text'); // text, link, file
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, avg: 0, risky: 0 });

  // Web Speech API for voice to text
  let recognition = null;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/analysis/history');
      setHistory(res.data);
      computeStats(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const computeStats = (data) => {
    if (!data || data.length === 0) return;
    const total = data.length;
    const sum = data.reduce((acc, curr) => acc + curr.credibilityScore, 0);
    const avg = Math.round(sum / total);
    const risky = data.filter(r => r.credibilityScore < 45).length;
    setStats({ total, avg, risky });
  };

  // Toggle speech recognition
  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome/Edge.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setText((prev) => prev + (prev ? ' ' : '') + transcript);
      };
      recognition.onerror = (e) => {
        console.error('Speech error:', e);
        setIsRecording(false);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      alert('Only .txt and .md files are supported for instant content reading.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target.result);
      setActiveTab('text');
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    const contentToAnalyze = text.trim();

    if (!contentToAnalyze) {
      setError('Please provide some text to audit.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/analysis/analyze', {
        text: contentToAnalyze,
        url: url.trim() || null
      });
      // Navigate to results page
      navigate(`/report/${response.data.id}`);
    } catch (err) {
      setError('Failed to analyze. Spring Boot backend or Python microservice may be offline.');
    } finally {
      setLoading(false);
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
                Analyzer Control Room <Sparkles className="w-6 h-6 text-cyan-400" />
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Audit news statements, analyze URLs, or upload files for cognitive analysis.</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-3xl glass-card border border-slate-800/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Media Audits</span>
                <h3 className="text-3xl font-extrabold mt-1 text-slate-100">{stats.total}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-slate-800/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Average Credibility</span>
                <h3 className="text-3xl font-extrabold mt-1 text-slate-100">{stats.avg}%</h3>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <BarChart2 className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-slate-800/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risky Outliers Flags</span>
                <h3 className="text-3xl font-extrabold mt-1 text-slate-100">{stats.risky}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            
            {/* Input card */}
            <div className="xl:col-span-2 glass-card rounded-[32px] p-6 md:p-8 border border-slate-800/50">
              
              {/* Tab Toggles */}
              <div className="flex gap-2 p-1 bg-slate-900/60 dark:bg-black/30 border border-slate-800/80 rounded-2xl mb-6 max-w-sm">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'text' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Text
                </button>
                <button
                  onClick={() => setActiveTab('link')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'link' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Link2 className="w-4 h-4" /> Link/URL
                </button>
                <button
                  onClick={() => setActiveTab('file')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'file' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" /> Upload
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> {error}
                </div>
              )}

              {/* Tabs Content */}
              <form onSubmit={handleAnalyze} className="flex flex-col gap-6">
                
                {activeTab === 'text' && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Statement or Article Content</label>
                      <button
                        type="button"
                        onClick={toggleRecording}
                        className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
                          isRecording 
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        {isRecording ? 'Listening...' : 'Dictate'}
                      </button>
                    </div>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                      placeholder="Paste the news statement, social media post, or entire article content here to audit..."
                      rows={8}
                      className="w-full p-4 rounded-2xl bg-slate-900/40 dark:bg-black/20 border border-slate-800/80 text-sm md:text-base text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 transition-all font-light leading-relaxed"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 px-1 font-mono">
                      <span>Min 10 words recommended</span>
                      <span>{text.split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                  </div>
                )}

                {activeTab === 'link' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Article / Website URL</label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example-news-site.com/breaking-article"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/40 dark:bg-black/20 border border-slate-800/80 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Associated Content</label>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        placeholder="Paste matching summary or text from the link for NLP engine scanning..."
                        rows={5}
                        className="w-full p-4 rounded-2xl bg-slate-900/40 dark:bg-black/20 border border-slate-800/80 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 transition-all font-light"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'file' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Attach File</label>
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`w-full p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${
                          dragActive
                            ? 'border-cyan-400 bg-cyan-950/15'
                            : 'border-slate-800 bg-slate-900/20 hover:border-slate-700/60'
                        }`}
                      >
                        <UploadCloud className="w-8 h-8 text-slate-500" />
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-300">Drag and drop file here, or click to upload</p>
                          <p className="text-[10px] text-slate-500 mt-1">Accepts standard .txt or .md formats only</p>
                        </div>
                        <input
                          type="file"
                          accept=".txt,.md"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-input"
                        />
                        <label
                          htmlFor="file-upload-input"
                          className="text-xs font-bold text-slate-950 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                        >
                          Select File
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black tracking-wider uppercase hover:brightness-110 shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing Model Metrics...' : (
                    <>
                      Execute Cognitive Audit <Play className="w-4 h-4 fill-current" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Recent audits panel */}
            <div className="glass-card rounded-[32px] p-6 border border-slate-800/50 flex flex-col h-[520px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Recent Logs</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-full text-slate-400 font-mono">
                  {filteredHistory.length} files
                </span>
              </div>

              {/* Search bar */}
              <div className="relative mb-4">
                <Search className="absolute inset-y-0 left-0 pl-3 w-4.5 h-4.5 my-auto text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter audits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/60 dark:bg-black/30 border border-slate-800/80 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all"
                />
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                {filteredHistory.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <FileSpreadsheet className="w-8 h-8 text-slate-700 mb-2" />
                    <p className="text-xs text-slate-500 font-medium">No analyses saved yet.</p>
                  </div>
                ) : (
                  filteredHistory.map((item) => {
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
                        className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-800/60 hover:bg-slate-800/30 hover:border-slate-700/50 flex items-center justify-between gap-3 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-200 truncate">{item.title}</h4>
                          <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                            <Calendar className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded-lg border flex items-center gap-0.5 shrink-0 ${badgeColor}`}>
                          {item.credibilityScore} <span className="text-[8px] font-mono opacity-60">CR</span>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
