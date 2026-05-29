import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/10 dark:border-slate-800/40 bg-white/5 dark:bg-slate-950/20 backdrop-blur-md py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          <span className="text-sm font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            TRUTHLENS
          </span>
        </div>
        <p className="text-xs text-slate-500 text-center md:text-right">
          &copy; {new Date().getFullYear()} TruthLens. Designed for media literacy and cognitive security. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
