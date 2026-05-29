import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, User, Info, Settings, ShieldAlert } from 'lucide-react';

const Sidebar = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user && user.role === 'ROLE_ADMIN';

  const links = [
    { to: '/dashboard', label: 'Analyzer Console', icon: LayoutDashboard },
    { to: '/history', label: 'Analysis History', icon: History },
    { to: '/profile', label: 'User Profile', icon: User },
    { to: '/about', label: 'About Platform', icon: Info },
  ];

  return (
    <aside className="w-64 hidden lg:flex flex-col h-[calc(100vh-65px)] sticky top-[65px] border-r border-slate-200/10 dark:border-slate-800/40 p-4 bg-white/5 dark:bg-slate-950/20 backdrop-blur-md">
      <div className="flex-1 flex flex-col gap-2 mt-4">
        <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Main Navigation</p>
        
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border-l-4 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}

        {isAdmin && (
          <div className="mt-6 pt-6 border-t border-slate-700/30">
            <p className="px-3 text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Security Controls
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-l-4 border-purple-500'
                    : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/20'
                }`
              }
            >
              <Settings className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Footer Branding Info */}
      <div className="p-3 bg-cyan-950/20 dark:bg-slate-900/40 border border-cyan-500/20 rounded-2xl flex flex-col gap-1 mt-auto">
        <span className="text-xs font-bold text-cyan-400">TruthLens Sec v1.0</span>
        <span className="text-[10px] text-slate-400 leading-normal">System active. Safeguarding news integrity using machine intelligence.</span>
      </div>
    </aside>
  );
};

export default Sidebar;
