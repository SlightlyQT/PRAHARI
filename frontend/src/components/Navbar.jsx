import React, { useState, useEffect } from 'react';
import { Shield, Zap, ChevronRight, LayoutGrid, Cpu, MapPin, Network, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({
  onSimulateIntercept
}) {
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'hero';
  });

  // Dynamic Scroll & Router Hash Synchronization (Fixes Route vs Visual State Mismatch)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setActiveSection(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    // IntersectionObserver to auto-sync active navigation pill as user scrolls
    const sections = ['hero', 'trace-engine', 'spatial-map', 'architecture', 'live-matrix'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -50% 0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      observer.disconnect();
    };
  }, []);

  const navItems = [
    { id: 'hero', label: 'OVERVIEW', icon: LayoutGrid },
    { id: 'trace-engine', label: 'TRACE ENGINE', icon: Network },
    { id: 'spatial-map', label: '3D SPATIAL RADAR', icon: MapPin, badge: '3D' },
    { id: 'architecture', label: 'PIPELINE ARCH', icon: Cpu },
    { id: 'live-matrix', label: 'NCRP MATRIX', icon: Activity }
  ];

  return (
    <>
      {/* Unified Global Navigation Bar Header (z-[1000] Immersive Glassmorphism Protection) */}
      <header className="fixed top-0 left-0 right-0 z-[1000] w-full pt-3 px-4 sm:px-8 pointer-events-none font-mono">
        <div className="max-w-7xl mx-auto bg-[#0a1119]/80 backdrop-blur-xl border border-cyan-500/18 rounded-2xl shadow-xl px-4 sm:px-6 py-2 flex items-center justify-between pointer-events-auto min-h-[58px] gap-4 backdrop-saturate-150">
          
          {/* Brand Logo (Far Left) */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 shadow-xs">
              <Shield className="w-4.5 h-4.5 text-cyan-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-black tracking-tight text-sm sm:text-base text-slate-50 uppercase font-sans">
                P.R.A.H.A.R.I.
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-bold tracking-wider rounded-md bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 uppercase">
                SIH 2026
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Clean Spacing, Fixed min-width, Dynamic State Sync) */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-4 mx-auto">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              
              const baseClasses = `px-3 py-2 rounded-xl flex items-center justify-center gap-2 transition-all text-xs font-bold cursor-pointer shrink-0 min-w-[135px] min-h-[40px] ${
                isActive
                  ? 'bg-emerald-500/8 text-emerald-400 border border-emerald-400/40 shadow-xs font-black'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5 border border-transparent font-medium'
              }`;

              if (item.id === 'architecture') {
                return (
                  <Link
                    key={item.id}
                    to="/trace"
                    className={baseClasses}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              }

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={baseClasses}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>

                  {item.badge && (
                    <span className={`px-1 py-0.2 text-[8px] font-bold rounded shrink-0 ${isActive ? 'bg-emerald-500/22 text-emerald-300' : 'bg-cyan-500/14 text-cyan-400'}`}>
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Far Right Action Deck: Single High-Impact Filled CTA Button */}
          <div className="flex items-center space-x-3 shrink-0 ml-auto lg:ml-0">
            <button
              onClick={onSimulateIntercept}
              className="group relative px-4 sm:px-5 h-[42px] rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/25 active:scale-95 cursor-pointer flex items-center gap-1.5 overflow-hidden shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-[#0a1119]/20 to-emerald-400/5 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 -translate-x-full z-0"></div>
              <Zap className="w-3.5 h-3.5 fill-white relative z-10" />
              <span className="relative z-10 hidden sm:inline">SIMULATE INTERCEPT</span>
              <span className="relative z-10 sm:hidden">INTERCEPT</span>
              <ChevronRight className="w-3.5 h-3.5 relative z-10" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Strict 3-to-5 Rule & Min 44x44 Touch Target) */}
      <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a1119]/95 backdrop-blur-xl border-t border-cyan-500/30 shadow-2xl p-2 font-mono">
        <div className="flex items-center justify-around max-w-md mx-auto pb-safe-bottom">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            const baseClassesMobile = `flex flex-col items-center justify-center min-w-[50px] min-h-[50px] px-1 py-1 rounded-xl transition-all ${
              isActive
                ? 'text-emerald-400 font-extrabold bg-emerald-500/8 border border-emerald-500/30'
                : 'text-slate-400 font-medium hover:text-cyan-400'
            }`;

            if (item.id === 'architecture') {
              return (
                <Link
                  key={item.id}
                  to="/trace"
                  className={baseClassesMobile}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400 stroke-[2.5]' : 'text-slate-400 stroke-[1.75]'}`} />
                  <span className="text-[9px] mt-0.5 tracking-tight uppercase truncate max-w-[64px]">
                    {item.label.split(' ')[0]}
                  </span>
                </Link>
              );
            }

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={baseClassesMobile}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400 stroke-[2.5]' : 'text-slate-400 stroke-[1.75]'}`} />
                <span className="text-[9px] mt-0.5 tracking-tight uppercase truncate max-w-[64px]">
                  {item.label.split(' ')[0]}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
