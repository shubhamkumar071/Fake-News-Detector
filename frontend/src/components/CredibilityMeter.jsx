import React from 'react';
import { motion } from 'framer-motion';

const CredibilityMeter = ({ score = 50 }) => {
  // Determine color and status label based on score
  let color = 'stroke-emerald-500';
  let textColor = 'text-emerald-400';
  let glowColor = 'shadow-emerald-500/20';
  let label = 'VERIFIED';
  let desc = 'This article exhibits high facts-to-opinion integrity with minor bias.';

  if (score < 40) {
    color = 'stroke-rose-500';
    textColor = 'text-rose-400';
    glowColor = 'shadow-rose-500/20';
    label = 'MANIPULATIVE / FAKE';
    desc = 'Highly likely to contain false assertions, emotional framing, or deceptive sources.';
  } else if (score < 70) {
    color = 'stroke-amber-500';
    textColor = 'text-amber-400';
    glowColor = 'shadow-amber-500/20';
    label = 'UNVERIFIED / BIASED';
    desc = 'Exercise caution. Contains polarizing writing style or unsubstantiated arguments.';
  }

  // Circle parameters
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-3xl relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-full blur-2xl"></div>

      <div className="relative flex items-center justify-center">
        {/* SVG Circle meter */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.15)]"
        >
          {/* Base Gray circle */}
          <circle
            className="stroke-slate-700/30 dark:stroke-slate-800/40"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <motion.circle
            className={`${color} transition-all duration-1000 ease-out`}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
          />
        </svg>
        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight">{score}</span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">INDEX</span>
        </div>
      </div>

      <div className="text-center mt-6">
        <span className={`text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full bg-slate-900/40 dark:bg-black/30 border border-slate-700/50 ${textColor}`}>
          {label}
        </span>
        <p className="text-xs text-slate-400 mt-3 max-w-[240px] leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default CredibilityMeter;
