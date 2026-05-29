import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Brain, Cpu, MessageSquare, Code, CheckCircle, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-brand-dark">
      {/* Background visual elements */}
      <div className="bg-spotlight top-[-100px] left-[-100px]"></div>
      <div className="bg-spotlight-purple bottom-[-200px] right-[-100px]"></div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 pt-20 pb-16 flex flex-col items-center justify-center text-center z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" /> Next-Generation media Intelligence
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-slate-100 max-w-4xl"
        >
          Unveil the Truth in Media with <span className="gradient-text">TruthLens</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base sm:text-xl text-slate-400 max-w-2xl mt-6 leading-relaxed font-light"
        >
          A state-of-the-art AI-powered platform designed to detect fake news, emotional manipulation, clickbait headers, and ideological bias with explainable NLP reasoning.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap gap-4 mt-10 justify-center"
        >
          <Link to="/register" className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:brightness-110 px-8 py-4 rounded-2xl shadow-xl glow-cyan transition-all">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/about" className="text-sm sm:text-base font-extrabold text-slate-300 border border-slate-700/60 bg-slate-900/40 hover:bg-slate-800/40 px-8 py-4 rounded-2xl transition-all">
            Learn How It Works
          </Link>
        </motion.div>
      </section>

      {/* Stats/Badge strip */}
      <section className="relative max-w-7xl mx-auto px-4 py-8 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 glass-card rounded-[32px] border border-slate-800/50">
          {[
            { value: "98.7%", label: "NLP Model Accuracy" },
            { value: "< 200ms", label: "Real-time Processing" },
            { value: "5+", label: "Linguistic Heuristics" },
            { value: "100%", label: "Explainable Metrics" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <h3 className="text-2xl sm:text-3xl font-black text-cyan-400">{stat.value}</h3>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Section */}
      <section className="relative max-w-7xl mx-auto px-4 py-20 z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black uppercase tracking-widest text-indigo-400">Features Suite</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold mt-3 text-slate-100">Cybersecurity for News Integrity</h3>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Brain,
              title: "Misinformation Scoring",
              desc: "Combines semantic analysis with deep pattern matching to predict fake news probabilities accurately."
            },
            {
              icon: Cpu,
              title: "Linguistic Bias Trackers",
              desc: "Examines adverbs, loaded terms, and subjective language to identify systemic partisan bias."
            },
            {
              icon: AlertCircle,
              title: "Manipulation Highlight",
              desc: "Identifies and explains fear-mongering and clickbait phrases using colored contextual highlights."
            },
            {
              icon: Shield,
              title: "Source Reputation Registry",
              desc: "Validates article domains in real-time against a database of verified news providers."
            },
            {
              icon: BookOpen,
              title: "Explainable AI Logs",
              desc: "Transparency is core. TruthLens shows exactly which phrases triggered warnings."
            },
            {
              icon: Code,
              title: "Chrome Extension API ready",
              desc: "Exposes lightweight microservice JSON payloads ideal for building browser extensions."
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-6 rounded-[28px] glass-card border border-slate-800/40 hover:border-cyan-500/20 hover:shadow-cyan-500/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h4 className="text-lg font-bold text-slate-100">{item.title}</h4>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Interactive Simulation / Explainable Highlight Showcase */}
      <section className="relative max-w-7xl mx-auto px-4 py-20 z-10">
        <div className="glass-card rounded-[36px] p-8 md:p-12 border border-slate-800/40 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">Explainable NLP</span>
            <h3 className="text-3xl md:text-4xl font-extrabold mt-3 text-slate-100 leading-tight">
              See why the AI highlights emotional manipulation
            </h3>
            <p className="text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
              We do not just output a single percentage score. TruthLens runs grammar-based rules and lexicon matching to highlight loaded terms directly in your browser.
            </p>
            <div className="flex flex-col gap-3 mt-8">
              {[
                { title: "Fear-mongering warnings", desc: "Flags terms meant to induce panic (e.g. 'apocalypse', 'imminent collapse')." },
                { title: "Clickbait patterns", desc: "Flags curiosity gap structures and exaggerated promises." },
                { title: "Sensationalist adverbs", desc: "Highlights words like 'obviously' and 'clearly' used to bypass evidence." }
              ].map((point, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{point.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Styled visual mock of the highlighter */}
          <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 shadow-inner flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">INPUT ANALYZER STREAM</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="text-xs md:text-sm leading-relaxed text-slate-400 whitespace-pre-wrap py-2 font-mono">
              "Scientists warn that an <span className="bg-rose-500/20 text-rose-300 border-b border-rose-500 px-1 py-0.5 rounded">apocalypse</span> is approaching! This is the <span className="bg-purple-500/20 text-purple-300 border-b border-purple-500 px-1 py-0.5 rounded">shocking truth</span> that the media is hiding. You <span className="bg-yellow-500/20 text-yellow-300 border-b border-yellow-500 px-1 py-0.5 rounded">won't believe</span> what happens next."
            </div>
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
              <span className="text-[9px] font-bold uppercase tracking-widest text-rose-400">Fear-mongering Flagged</span>
              <p className="text-[11px] text-slate-400 mt-1">
                "apocalypse": Uses high-arousal negative emotion words to induce fear rather than presenting objective details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chrome Extension Promo section */}
      <section className="relative max-w-7xl mx-auto px-4 py-16 text-center z-10">
        <div className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-indigo-950/20 via-cyan-950/10 to-brand-dark border border-cyan-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5 pointer-events-none"></div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-100">Want real-time analysis while browsing?</h3>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed font-light">
            TruthLens is designed with an API-first approach. We plan to launch our Chrome Extension, allowing users to analyze tweets and news articles instantly on any website with a single click.
          </p>
          <div className="mt-8 flex justify-center">
            <span className="text-xs font-black tracking-widest uppercase text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-full bg-cyan-950/30">
              Extension Concept Ready • API Available
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
