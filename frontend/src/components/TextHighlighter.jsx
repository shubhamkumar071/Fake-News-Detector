import React, { useState } from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

const TextHighlighter = ({ text = '', phrases = [] }) => {
  const [selectedPhrase, setSelectedPhrase] = useState(null);

  if (!text) return null;

  // Function to get color classes based on manipulation type
  const getHighlightColor = (type) => {
    switch (type) {
      case 'Fear-mongering':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30';
      case 'Sensationalism':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30';
      case 'Ad Hominem/Labeling':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      case 'Urgency/Clickbait':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 hover:bg-yellow-500/30';
      case 'Absolute Certainty (Bias)':
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30';
    }
  };

  // Re-order and filter overlapping spans (safety check)
  const sortedPhrases = [...phrases].sort((a, b) => a.startIndex - b.startIndex);
  
  const elements = [];
  let lastIndex = 0;

  sortedPhrases.forEach((phrase, idx) => {
    // Add text before the highlight
    if (phrase.startIndex > lastIndex) {
      elements.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex, phrase.startIndex)}
        </span>
      );
    }

    // Add the highlighted span
    const highlightClass = getHighlightColor(phrase.type);
    elements.push(
      <span
        key={`highlight-${idx}`}
        onClick={() => setSelectedPhrase(phrase)}
        className={`relative inline-block px-1 rounded border cursor-pointer font-medium transition-all ${highlightClass}`}
        title={`[${phrase.type}] Click to inspect AI reasoning`}
      >
        {text.slice(phrase.startIndex, phrase.endIndex)}
      </span>
    );

    lastIndex = phrase.endIndex;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(
      <span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
        <h3 className="text-sm font-bold text-slate-300 mb-4 tracking-wide uppercase flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-cyan-400" /> Explainable AI Highlights
        </h3>
        
        {/* Render text with highlights */}
        <div className="text-sm md:text-base leading-relaxed text-slate-300 whitespace-pre-wrap font-light p-4 rounded-2xl bg-slate-900/30 dark:bg-black/20 border border-slate-700/30">
          {phrases.length === 0 ? text : elements}
        </div>
      </div>

      {/* Selected/Hovered Explanation card */}
      {selectedPhrase ? (
        <div className="p-5 rounded-2xl bg-slate-900/50 dark:bg-slate-950/40 border border-cyan-500/30 shadow-lg glow-cyan transition-all">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/20">
                {selectedPhrase.type}
              </span>
              <h4 className="text-sm font-extrabold mt-2 text-slate-200">
                Flagged Term: "{selectedPhrase.phrase}"
              </h4>
            </div>
            <button
              onClick={() => setSelectedPhrase(null)}
              className="text-xs text-slate-500 hover:text-slate-200"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {selectedPhrase.explanation}
          </p>
        </div>
      ) : (
        phrases.length > 0 && (
          <div className="text-xs text-slate-500 dark:text-slate-600 flex items-center gap-1.5 px-2">
            <HelpCircle className="w-4 h-4" /> Click on highlighted words above to inspect explainable NLP reasoning.
          </div>
        )
      )}
    </div>
  );
};

export default TextHighlighter;
