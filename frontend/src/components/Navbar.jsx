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
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-blue-200/60 rounded-2xl shadow-xl px-4 sm:px-6 py-2 flex items-center justify-between pointer-events-auto min-h-[58px] gap-4 backdrop-saturate-150">
          
          {/* Brand Logo (Far Left) */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-600/20 shadow-xs">
              <Shield className="w-4.5 h-4.5 text-blue-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-black tracking-tight text-sm sm:text-base text-slate-950 uppercase font-sans">
                P.R.A.H.A.R.I.
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-bold tracking-wider rounded-md bg-purple-50 text-purple-700 border border-purple-200 uppercase">
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
                  ? 'bg-purple-50 text-purple-700 border border-purple-300/80 shadow-xs font-black'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50/50 border border-transparent font-medium'
              }`;

              if (item.id === 'architecture') {
                return (
                  <Link
                    key={item.id}
                    to="/trace"
                    className={baseClasses}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
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
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>

                  {item.badge && (
                    <span className={`px-1 py-0.2 text-[8px] font-bold rounded shrink-0 ${isActive ? 'bg-purple-200 text-purple-800' : 'bg-blue-100 text-blue-700'}`}>
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
              className="group relative px-4 sm:px-5 h-[42px] rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-600/25 active:scale-95 cursor-pointer flex items-center gap-1.5 overflow-hidden shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 -translate-x-full z-0"></div>
              <Zap className="w-3.5 h-3.5 fill-white relative z-10" />
              <span className="relative z-10 hidden sm:inline">SIMULATE INTERCEPT</span>
              <span className="relative z-10 sm:hidden">INTERCEPT</span>
              <ChevronRight className="w-3.5 h-3.5 relative z-10" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Strict 3-to-5 Rule & Min 44x44 Touch Target) */}
      <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-blue-200 shadow-2xl p-2 font-mono">
        <div className="flex items-center justify-around max-w-md mx-auto pb-safe-bottom">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            const baseClassesMobile = `flex flex-col items-center justify-center min-w-[50px] min-h-[50px] px-1 py-1 rounded-xl transition-all ${
              isActive
                ? 'text-purple-700 font-extrabold bg-purple-50 border border-purple-200'
                : 'text-slate-500 font-medium hover:text-blue-600'
            }`;

            if (item.id === 'architecture') {
              return (
                <Link
                  key={item.id}
                  to="/trace"
                  className={baseClassesMobile}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600 stroke-[2.5]' : 'text-slate-500 stroke-[1.75]'}`} />
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
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600 stroke-[2.5]' : 'text-slate-500 stroke-[1.75]'}`} />
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
