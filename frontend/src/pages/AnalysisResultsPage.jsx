import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Download, Printer, ShieldAlert, CheckCircle, 
  Trash2, AlertCircle, Share2, Sparkles, BookOpen, AlertOctagon 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CredibilityMeter from '../components/CredibilityMeter';
import EmotionRadar from '../components/EmotionRadar';
import TextHighlighter from '../components/TextHighlighter';
import SourceVerificationCard from '../components/SourceVerificationCard';
import api from '../utils/api';

const AnalysisResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      const res = await api.get(`/analysis/report/${id}`);
      setReport(res.data);
    } catch (err) {
      setError('Could not retrieve audit details. Report may not exist.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!report) return;
    const summaryText = `TRUTHLENS MEDIA INTEGRITY AUDIT REPORT
==========================================
Report ID: ${report.id}
Date: ${new Date(report.createdAt).toLocaleString()}
Domain Analyzed: ${report.sourceVerification.domain}
Source Trust Rating: ${report.sourceVerification.status}

CREDIBILITY METRICS:
--------------------
Overall Credibility Score: ${report.credibilityScore}/100
Misinformation Probability: ${report.fakeProbability}%
Clickbait Score: ${report.clickbaitScore}%
Toxicity Score: ${report.toxicityScore}%
Bias Severity: ${report.biasLevel} (Score: ${report.biasScore}%)
Sentiment Polarity: ${report.sentiment}
AI Generated Text Probability: ${report.aiGeneratedProbability}%

EMOTIONAL SPECTRUM:
-------------------
Anger: ${report.emotions.anger}%
Fear: ${report.emotions.fear}%
Joy: ${report.emotions.joy}%
Sadness: ${report.emotions.sadness}%

SUMMARY OF ARTICLE:
-------------------
${report.summary}

FLAGGED KEYWORDS:
-----------------
${report.keywords.join(', ')}

==========================================
End of Report. Audit generated via TruthLens NLP Microservice.`;

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `truthlens-report-${report.id.slice(-6)}.txt`;
    link.click();
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this analysis report from your history?')) {
      return;
    }
    try {
      await api.delete(`/analysis/report/${id}`);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete report.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        <p className="text-sm text-slate-400 mt-4">Compiling NLP audit results...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ShieldAlert className="w-12 h-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-200">{error || 'Report not found'}</h2>
          <Link to="/dashboard" className="text-sm font-bold text-cyan-400 flex items-center gap-1.5 mt-4">
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col print:bg-white print:text-black">
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="flex flex-1">
        <div className="print:hidden">
          <Sidebar />
        </div>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto print:p-0">
          
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-slate-800/40 pb-6 print:hidden">
            <div>
              <Link to="/dashboard" className="text-xs font-bold text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors mb-3">
                <ArrowLeft className="w-4 h-4" /> Back to Analyzer
              </Link>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 flex items-center gap-2">
                Audit Record <Sparkles className="w-6 h-6 text-cyan-400" />
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1">Audit hash ID: {report.id} • Created {new Date(report.createdAt).toLocaleString()}</p>
            </div>
            
            {/* Actions button group */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-300 transition-all flex items-center gap-1.5 text-xs font-bold"
                title="Download Summary Report"
              >
                <Download className="w-4 h-4" /> Summary
              </button>
              <button
                onClick={handlePrint}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-300 transition-all flex items-center gap-1.5 text-xs font-bold"
                title="Export PDF / Print"
              >
                <Printer className="w-4 h-4" /> Export PDF
              </button>
              <button
                onClick={handleDelete}
                className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 transition-all flex items-center gap-1.5 text-xs font-bold"
                title="Delete Report"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>

          {/* PRINT-ONLY HEADER */}
          <div className="hidden print:block mb-8">
            <h1 className="text-3xl font-extrabold text-black">TRUTHLENS MEDIA INTEGRITY REPORT</h1>
            <p className="text-sm text-gray-600 mt-2">Report ID: {report.id} | Generated on {new Date(report.createdAt).toLocaleString()}</p>
            <div className="border-t-2 border-black my-4"></div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2 Columns: NLP textual reasoning */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Summary Card */}
              <div className="glass-card rounded-[32px] p-6 border border-slate-800/40 print:border-black print:bg-white print:text-black">
                <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest flex items-center gap-1.5 print:text-black">
                  <BookOpen className="w-4 h-4 text-cyan-400 print:text-black" /> AI Executive Summary
                </h3>
                <p className="text-sm md:text-base text-slate-300 dark:text-slate-400 leading-relaxed font-light print:text-black">
                  {report.summary || 'Summary could not be generated for this input.'}
                </p>
              </div>

              {/* Text Highlighter component (Explainable highlights) */}
              <div className="print:text-black">
                <TextHighlighter text={report.content} phrases={report.manipulativePhrases} />
              </div>

              {/* Keywords Chip Grid */}
              <div className="glass-card rounded-[28px] p-6 border border-slate-800/40 print:hidden">
                <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest">Linguistic Keyword Markers</h3>
                <div className="flex flex-wrap gap-2">
                  {report.keywords && report.keywords.length > 0 ? (
                    report.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 font-medium pl-1">No keywords extracted.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Interactive meters and stats */}
            <div className="flex flex-col gap-8">
              
              {/* Credibility Dial */}
              <CredibilityMeter score={report.credibilityScore} />

              {/* Domain reputation verification card */}
              <SourceVerificationCard source={report.sourceVerification} />

              {/* Radar Chart */}
              <div className="h-[310px]">
                <EmotionRadar emotions={report.emotions} />
              </div>

              {/* Manipulation mini progress bars */}
              <div className="glass-card rounded-[32px] p-6 border border-slate-800/40 print:border-black print:bg-white print:text-black">
                <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest print:text-black">Manipulation Indices</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Misinformation Probability", score: report.fakeProbability, color: "bg-rose-500" },
                    { label: "Partisan Bias Intensity", score: report.biasScore, color: "bg-amber-500" },
                    { label: "Clickbait Patterns Score", score: report.clickbaitScore, color: "bg-yellow-500" },
                    { label: "Toxicity / Aggressiveness", score: report.toxicityScore, color: "bg-red-500" },
                    { label: "AI Generated Likelihood", score: report.aiGeneratedProbability, color: "bg-cyan-500" }
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-400 print:text-black">
                        <span>{bar.label}</span>
                        <span>{bar.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden print:border print:border-gray-400">
                        <div
                          className={`h-full ${bar.color} rounded-full`}
                          style={{ width: `${bar.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalysisResultsPage;
