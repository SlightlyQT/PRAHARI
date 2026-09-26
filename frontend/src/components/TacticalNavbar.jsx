import React, { useState, useEffect } from 'react';
import { Shield, Radio, Activity, Clock, Terminal, Volume2, VolumeX, Cpu, Layers } from 'lucide-react';

export default function TacticalNavbar({ activeView, setActiveView, selectedCaseId, onCaseChange, complaints }) {
  const [timeStr, setTimeStr] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const views = [
    { id: 'matrix', label: '1. Case Matrix', icon: Layers },
    { id: 'graph', label: '2. Network Graph', icon: Cpu },
    { id: 'map', label: '3. Tactical Radar Map', icon: Radio },
    { id: 'alert', label: '4. Interception Lock', icon: Shield }
  ];

  return (
    <header className="bg-[#070E1B] border-b border-[#1E293B] px-4 py-2.5 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Tactical Command Center Title & Case Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-300">
              <Shield className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-white tracking-wide font-mono">
                  P.R.A.H.A.R.I. <span className="text-cyan-400 text-xs font-normal">HUD v2.0</span>
                </h1>
                <span className="text-[10px] bg-red-950/80 text-red-400 font-bold border border-red-800/60 px-2 py-0.5 rounded uppercase font-mono">
                  ACTIVE INTERCEPTION
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Predictive Analytics • Cybercrime Hotspot Alert Engine
              </p>
            </div>
          </div>

          {/* Case Dossier Switcher Dropdown */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#0D192C] p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-mono text-[11px] px-2">CASE:</span>
            {complaints.map((c) => {
              const active = c.complaint_id === selectedCaseId;
              return (
                <button
                  key={c.complaint_id}
                  onClick={() => onCaseChange(c.complaint_id)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                    active
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {c.complaint_id.split('-').pop()} ({c.victim_city})
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: View Mode Tabs */}
        <div className="flex items-center bg-[#030712] p-1.5 rounded-xl border border-slate-800/80 shadow-inner">
          {views.map((v) => {
            const Icon = v.icon;
            const active = activeView === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-300 animate-pulse' : ''}`} />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Telemetry & Audio Toggle */}
        <div className="hidden xl:flex items-center gap-3 text-xs font-mono">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Toggle Visual Haptics"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <div className="flex items-center gap-2 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <Activity className="w-3.5 h-3.5" />
            <span>NCRP STREAM LIVE</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
