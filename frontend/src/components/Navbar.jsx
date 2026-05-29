import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, User, Sun, Moon, Menu, X, Settings } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#030712';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f9fafb';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-card dark:bg-slate-950/45 bg-white/70 border-b border-slate-200/20 dark:border-slate-800/40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
          <Shield className="w-8 h-8 text-cyan-400 stroke-[2]" />
          <span>TRUTHLENS</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Home</Link>
          {user && (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Dashboard</Link>
              <Link to="/history" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">History</Link>
              {user.role === 'ROLE_ADMIN' && (
                <Link to="/admin" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                  <Settings className="w-4 h-4" /> Admin Panel
                </Link>
              )}
            </>
          )}
          <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">About</Link>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-slate-100 transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
              <Link to="/profile" className="flex items-center gap-2 text-slate-300 hover:text-slate-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-sm font-semibold">{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors px-3 py-1.5 rounded-lg">
                Log In
              </Link>
              <Link to="/register" className="text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:brightness-110 px-4 py-2 rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-400 hover:text-slate-100"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 p-4 glass-card rounded-xl border border-slate-700/40 flex flex-col gap-3">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 py-1.5 font-medium">Home</Link>
          {user && (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 py-1.5 font-medium">Dashboard</Link>
              <Link to="/history" onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 py-1.5 font-medium">History</Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 py-1.5 font-medium">My Profile</Link>
              {user.role === 'ROLE_ADMIN' && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-purple-400 hover:text-purple-300 py-1.5 font-medium">Admin Panel</Link>
              )}
            </>
          )}
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 py-1.5 font-medium">About</Link>
          
          <div className="h-[1px] bg-slate-800 my-1"></div>

          {user ? (
            <button
              onClick={() => { setIsMenuOpen(false); handleLogout(); }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-semibold"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-center py-2 rounded-lg border border-slate-700 text-slate-300 font-semibold">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-center py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
