import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@mui/material';
import { LightMode, DarkMode, Speed, Security, Analytics, ChevronRight } from '@mui/icons-material';
import { toggleTheme } from '../store/slices/uiSlice';
import SEO from '../components/seo/SEO';

const Landing = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.ui.mode);

  return (
    <>
      <SEO title="Meta Glasses Reviews | The Future of Feedback" description="A premium dashboard for managing your Meta Glasses reviews and users." />
      
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] transition-colors relative overflow-hidden flex flex-col">
        
        {/* Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/20 dark:bg-indigo-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob z-0"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-pink-500/20 dark:bg-pink-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 z-0"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[45rem] h-[45rem] bg-blue-500/20 dark:bg-blue-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000 z-0"></div>

        {/* Navbar */}
        <header className="w-full glass border-b border-slate-200/50 dark:border-slate-800/50 z-50 sticky top-0">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-xl font-extrabold text-white">M</span>
              </div>
              <span className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">Meta Glasses</span>
            </div>
            
            <div className="flex items-center gap-4">
              <IconButton 
                onClick={() => dispatch(toggleTheme())}
                className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {mode === 'dark' ? <LightMode className="text-amber-400" /> : <DarkMode className="text-indigo-600" />}
              </IconButton>
              
              <Link to="/login" className="hidden sm:block text-slate-600 dark:text-slate-300 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-4 py-2">
                Sign In
              </Link>
              
              <Link to="/register" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-6 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-8 animate-fade-in-up">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              v2.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8">
              Manage reviews with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                unprecedented clarity.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              The ultimate command center for Meta Glasses feedback. Analyze sentiments, manage users, and secure your data all from one beautiful dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] transition-all hover:shadow-[0_12px_24px_-6px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2 group">
                Start Free Trial
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold text-lg shadow-sm transition-all flex items-center justify-center">
                Access Dashboard
              </Link>
            </div>
          </div>
        </main>

        {/* Features Grid */}
        <section className="relative z-10 w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-y border-slate-200/50 dark:border-slate-800/50 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Enterprise-grade capabilities</h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Everything you need to scale your feedback operations.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass p-8 rounded-3xl border border-white/40 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-6">
                  <Analytics className="text-indigo-600 dark:text-indigo-400" fontSize="large" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Deep Analytics</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Extract actionable insights from raw review data using our advanced sentiment analysis engine.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass p-8 rounded-3xl border border-white/40 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-6">
                  <Security className="text-emerald-600 dark:text-emerald-400" fontSize="large" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Bank-grade Security</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Protect sensitive user information with end-to-end encryption and mandatory 2FA protocols.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass p-8 rounded-3xl border border-white/40 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center mb-6">
                  <Speed className="text-pink-600 dark:text-pink-400" fontSize="large" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Lightning Fast</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Built on a modern React/Vite stack ensuring zero lag and instantaneous data retrieval.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 w-full py-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
          <p>© {new Date().getFullYear()} Meta Glasses Reviews. All rights reserved.</p>
        </footer>
        
      </div>
    </>
  );
};

export default Landing;
