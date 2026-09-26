import React from 'react';
import { Shield, Zap, Activity, Radio, Lock } from 'lucide-react';

export default function BentoHeader({ complaints = [], selectedComplaintId, onSelectComplaint, onTriggerHold }) {
  return (
    <header className="w-full h-14 px-4 glass-bento flex items-center justify-between z-30 shrink-0 border-slate-800/80">
      
      {/* Brand & System Status */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
          <Shield className="w-4 h-4 text-blue-400" />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-extrabold tracking-wider text-base text-white font-mono">
            CyberShield AI <span className="text-blue-400 font-sans text-xs">P.R.A.H.A.R.I.</span>
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            SYSTEM ACTIVE
          </span>
        </div>
      </div>

      {/* Center Ticker / Metrics */}
      <div className="hidden md:flex items-center space-x-6 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span>Ingestion: <strong className="text-white">NCRP 1930 Live</strong></span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Hotspots: <strong className="text-emerald-400">4 Monitored</strong></span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Avg Intercept: <strong className="text-amber-400">&lt; 3.5 min</strong></span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Case Dropdown */}
        <select
          aria-label="Select Complaint Case"
          value={selectedComplaintId}
          onChange={(e) => onSelectComplaint(e.target.value)}
          className="bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-mono cursor-pointer"
        >
          {complaints.map((c) => (
            <option key={c.complaint_id} value={c.complaint_id} className="bg-slate-950 text-slate-200">
              {c.complaint_id} ({c.victim_city})
            </option>
          ))}
        </select>

        {/* Action Button */}
        <button
          onClick={onTriggerHold}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center gap-1.5 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>Trigger Bank Hold</span>
        </button>
      </div>

    </header>
  );
}
