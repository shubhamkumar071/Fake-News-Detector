import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldAlert as WarningShield, HelpCircle } from 'lucide-react';

const SourceVerificationCard = ({ source = { domain: 'N/A', status: 'UNKNOWN', description: '' } }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'TRUSTED':
        return {
          icon: ShieldCheck,
          color: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20',
          label: 'Trusted Publisher',
          tagColor: 'bg-emerald-500 text-slate-950',
        };
      case 'UNTRUSTED':
        return {
          icon: ShieldAlert,
          color: 'text-rose-400 bg-rose-950/30 border-rose-500/20',
          label: 'Unreliable / Conspiracy Source',
          tagColor: 'bg-rose-500 text-slate-950',
        };
      case 'BIASED':
        return {
          icon: WarningShield,
          color: 'text-amber-400 bg-amber-950/30 border-amber-500/20',
          label: 'Highly Partisan Source',
          tagColor: 'bg-amber-500 text-slate-950',
        };
      case 'UNKNOWN':
      default:
        return {
          icon: HelpCircle,
          color: 'text-slate-400 bg-slate-800/30 border-slate-700/20',
          label: 'Unlisted Publisher',
          tagColor: 'bg-slate-700 text-slate-300',
        };
    }
  };

  const config = getStatusConfig(source.status);
  const Icon = config.icon;

  return (
    <div className={`p-5 rounded-3xl border flex items-start gap-4 transition-all ${config.color}`}>
      <div className="p-3 rounded-2xl bg-black/20">
        <Icon className="w-6 h-6 stroke-[2]" />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold font-mono tracking-wider text-slate-300">
            DOMAIN: {source.domain}
          </span>
          <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${config.tagColor}`}>
            {source.status}
          </span>
        </div>
        <h4 className="text-sm font-extrabold mt-1 text-slate-100">{config.label}</h4>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {source.description}
        </p>
      </div>
    </div>
  );
};

export default SourceVerificationCard;
