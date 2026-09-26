import React, { useState, useEffect } from 'react';
import { Terminal, Shield, AlertTriangle, User, MapPin, Clock, Zap, ChevronRight, Activity, Cpu } from 'lucide-react';

export default function IntelligenceSidebar({
  activeCase,
  predictionData,
  graphData,
  scrubStep,
  setScrubStep,
  activeView,
  setActiveView
}) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!activeCase) return;
    const initialLogs = [
      `[SYS_INIT] PRAHARI Engine v2.0 initialized. Pipeline ready.`,
      `[NCRP_INGEST] Complaint ${activeCase.complaint_id} ingested. Amount: ₹${activeCase.amount.toLocaleString('en-IN')}`,
      `[GNN_EMBED] Running multi-hop Graph Neural Network on Mule Node ${activeCase.first_mule_account_id}...`,
      `[GEO_FUSION] Spatial clustering calculated. Hotspot predicted at ${activeCase.predicted_area}.`,
      `[RISK_SCORE] Calculated Risk: ${Math.round((activeCase.predicted_risk_score || 0.85) * 100)}%. Interception ETA: ${predictionData?.golden_window_eta_min || 18} mins.`
    ];
    setLogs(initialLogs);
  }, [activeCase, predictionData]);

  if (!activeCase) return null;

  const totalSteps = graphData?.nodes?.length || 4;

  return (
    <aside className="w-full lg:w-[380px] shrink-0 space-y-4">
      {/* Active Victim Dossier Card */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                DOSSIER #{activeCase.complaint_id}
              </span>
              <h3 className="font-bold text-sm text-white truncate max-w-[180px]">
                {activeCase.victim_name} ({activeCase.victim_city})
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-mono">Defrauded</span>
            <div className="font-mono font-extrabold text-red-400 text-sm">
              ₹{activeCase.amount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-0.5">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Fraud Vector
            </span>
            <p className="font-semibold text-slate-200 truncate">{activeCase.fraud_type}</p>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-0.5">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              ETA Window
            </span>
            <p className="font-semibold text-amber-400">{predictionData?.golden_window_eta_min || 20} Mins</p>
          </div>
        </div>
      </div>

      {/* Interactive Step Scrubber Timeline */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            TIMELINE STEP SCRUBBER
          </span>
          <span className="text-slate-400 font-bold">
            Hop {scrubStep + 1} / {totalSteps}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={scrubStep}
          onChange={(e) => setScrubStep(parseInt(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span className={scrubStep === 0 ? 'text-cyan-400 font-bold' : ''}>Victim</span>
          <span className={scrubStep === 1 ? 'text-cyan-400 font-bold' : ''}>Mule 1</span>
          <span className={scrubStep === 2 ? 'text-cyan-400 font-bold' : ''}>Mule 2</span>
          <span className={scrubStep === totalSteps - 1 ? 'text-red-400 font-bold' : ''}>Cashout</span>
        </div>
      </div>

      {/* Live CLI Terminal Output Stream */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            CLI TELEMETRY STREAM
          </span>
          <span className="text-[10px] text-slate-500">LIVE LOGS</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 font-mono text-[11px] text-emerald-400/90 h-36 overflow-y-auto space-y-1.5 scrollbar-none">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              <span className="text-slate-600 mr-2">&gt;</span>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Intercept Action Button */}
      <button
        onClick={() => setActiveView('alert')}
        className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
      >
        <Shield className="w-4 h-4" />
        <span>Slam Lock Intercept Warrant</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </aside>
  );
}
