import React from 'react';
import { Shield, Sparkles, Brain, Cpu, MessageSquare, Code, CheckCircle, Lightbulb } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-4xl mx-auto w-full overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              About Platform <Sparkles className="w-5 h-5 text-cyan-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">Linguistic mechanics, project goals, and cognitive safety standards.</p>
          </div>

          <div className="flex flex-col gap-8">
            {/* Mission Statement */}
            <div className="glass-card rounded-[32px] p-6 md:p-8 border border-slate-800/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
              <h2 className="text-lg font-bold text-slate-100 mb-3">Auditing Cognitive Risks in Modern Media</h2>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                TruthLens is created as a final-year major engineering project to defend individuals and organizations from malicious media manipulation. Today's disinformation relies heavily on cognitive exploits: triggering high-arousal negative emotions (fear-mongering), exaggerating simple events (sensationalism), using derogatory labeling (ad hominem), and leveraging structural clickbait patterns. TruthLens detects these patterns to restore objective media literacy.
              </p>
            </div>

            {/* Linguistic Engine Details */}
            <div className="glass-card rounded-[32px] p-6 md:p-8 border border-slate-800/40">
              <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" /> NLP Pipeline Mechanics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Sentiment & Subjectivity",
                    desc: "Uses TextBlob metrics. Polarity determines positive/negative tone, while Subjectivity assesses whether statements represent hard facts or personal opinions."
                  },
                  {
                    title: "Linguistic Bias Index",
                    desc: "Analyzes presence of polarizing adverbs ('clearly', 'obviously'), hedging words, and extreme assertions that bypass traditional source citation rules."
                  },
                  {
                    title: "Emotional Spectrum Analysis",
                    desc: "Calculates frequency of emotion-triggering nouns and verbs against a curated lexicon of Anger, Fear, Joy, and Sadness word associations."
                  },
                  {
                    title: "AI Generation Classifier",
                    desc: "Evaluates sentence burstiness (standard deviation of sentence length) and lexical diversity. Human writing has high variability, whereas AI is highly uniform."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/60">
                    <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chrome Extension details */}
            <div className="glass-card rounded-[32px] p-6 md:p-8 border border-slate-800/40 flex flex-col md:flex-row gap-6 items-center">
              <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <Code className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                  Chrome Extension Architecture Concept <Lightbulb className="w-4 h-4 text-cyan-400" />
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  By exposing standard REST APIs for user authentication and news audits, developers can build a web extension. The extension grabs browser text selections or active tab URLs, forwards them to the Spring Boot gateway endpoint (`/api/analysis/analyze`), and renders the JSON metadata within an overlay on social networks like Twitter/X or Facebook.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutPage;
