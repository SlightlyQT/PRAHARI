import React, { useState } from 'react';
import { Zap, Play, RotateCcw, Building2, CreditCard, MapPin, AlertTriangle } from 'lucide-react';

export default function MuleNetworkWidget({ activeCase }) {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setActiveStep(0);
    setIsPlaying(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setActiveStep(step);
      if (step >= 3) {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 1000);
  };

  const handleReset = () => {
    setActiveStep(1);
    setIsPlaying(false);
  };

  return (
    <div className="w-full h-full flex flex-col glass-bento overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white uppercase">MULE NETWORK GRAPH TRAVERSAL</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>ANIMATE</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Nodes Canvas */}
      <div className="flex-1 my-3 relative flex items-center justify-between px-2">
        {/* Connection Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 120">
          <path
            d="M 50 60 Q 150 20 250 100 Q 320 40 370 60"
            fill="none"
            stroke={activeStep >= 1 ? "#3b82f6" : "#334155"}
            strokeWidth="2.5"
            className={activeStep >= 1 ? "laser-trace-line" : ""}
          />
        </svg>

        {/* Node 1: Victim */}
        <div className="z-10 p-2.5 rounded-xl bg-slate-900 border border-blue-500/60 font-mono text-[10px] space-y-1 shadow-md max-w-[90px]">
          <div className="text-blue-400 font-bold flex items-center gap-1">
            <Building2 className="w-3 h-3" /> VICTIM
          </div>
          <div className="text-white font-bold truncate">{activeCase?.victim_name || 'R. Sharma'}</div>
          <div className="text-emerald-400 font-bold">₹{activeCase?.amount?.toLocaleString()}</div>
        </div>

        {/* Node 2: Mule L1 */}
        <div className={`z-10 p-2.5 rounded-xl bg-slate-900 border font-mono text-[10px] space-y-1 shadow-md max-w-[100px] transition-all ${
          activeStep >= 1 ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-slate-800 opacity-60'
        }`}>
          <div className="text-amber-400 font-bold flex items-center gap-1">
            <CreditCard className="w-3 h-3" /> MULE L1
          </div>
          <div className="text-white font-bold truncate">{activeCase?.first_mule_account_id || 'AC-2290'}</div>
          <div className="text-amber-400">Layer-1 Hop</div>
        </div>

        {/* Node 3: Mule L2 */}
        <div className={`z-10 p-2.5 rounded-xl bg-slate-900 border font-mono text-[10px] space-y-1 shadow-md max-w-[100px] transition-all ${
          activeStep >= 2 ? 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'border-slate-800 opacity-60'
        }`}>
          <div className="text-rose-400 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> MULE L2
          </div>
          <div className="text-white font-bold truncate">AC-7715 (HDFC)</div>
          <div className="text-rose-400">8m Lag</div>
        </div>

        {/* Node 4: Cashout ATM */}
        <div className={`z-10 p-2.5 rounded-xl bg-slate-900 border font-mono text-[10px] space-y-1 shadow-md max-w-[100px] transition-all ${
          activeStep >= 3 ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-slate-800 opacity-60'
        }`}>
          <div className="text-red-400 font-bold flex items-center gap-1">
            <MapPin className="w-3 h-3" /> TARGET ATM
          </div>
          <div className="text-white font-bold truncate">{activeCase?.predicted_area || 'CP Hub'}</div>
          <div className="text-red-400 font-bold">HOTSPOT</div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px]">
        <span className="text-slate-400">Hop Velocity: <strong className="text-white">8 mins</strong></span>
        <span className="text-slate-400">Graph Depth: <strong className="text-amber-400">3 Hops</strong></span>
        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          RISK: 84%
        </span>
      </div>
    </div>
  );
}
