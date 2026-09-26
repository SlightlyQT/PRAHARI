import React from 'react';
import { ShieldCheck, Zap, Smartphone, Building2, Clock, Lock, CheckCircle2, RotateCcw } from 'lucide-react';

export default function InterceptionControlView({ alertResult, onReset, activeCase }) {
  if (!alertResult) {
    return (
      <div className="glass-card p-12 rounded-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-cyan-950 flex items-center justify-center mx-auto text-cyan-400 animate-spin">
          <Zap className="w-6 h-6" />
        </div>
        <p className="text-slate-300">Dispatching LEA Interception Orders & Bank Lien Holds...</p>
      </div>
    );
  }

  const { alert_id, timestamp, messages, metrics } = alertResult;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Animated Interception Lock Card */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-emerald-500/80 neon-border-cyan relative overflow-hidden animate-alert-pop">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 animate-bounce">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold px-2.5 py-0.5 rounded">
                  LOCKDOWN ISSUED • {alert_id}
                </span>
                <span className="text-xs text-slate-400 font-mono">{timestamp}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                Interception Warrant & Bank Lien Freeze Fired!
              </h2>
              <p className="text-sm text-slate-300 mt-0.5">
                Automated dispatches sent to <span className="text-cyan-300 font-semibold">{activeCase?.victim_city || 'City'} Cyber Cell</span> and banking core API gateways.
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Test Another Complaint</span>
          </button>
        </div>
      </div>

      {/* Speed Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-blue-900/50 space-y-1">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            P.R.A.H.A.R.I. Response Time
          </span>
          <div className="text-3xl font-extrabold font-mono text-cyan-300">
            {metrics.prahari_response_time_min} Minutes
          </div>
          <p className="text-[11px] text-slate-400">Automated multi-hop prediction & alert</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            Industry Manual Triage Avg
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-400">
            {metrics.industry_avg_response_time_hours} Hours
          </div>
          <p className="text-[11px] text-slate-400">Standard manual triage delay</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/50 space-y-1 bg-emerald-950/20">
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Golden Window Status
          </span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {metrics.time_saved_percentage} FASTER
          </div>
          <p className="text-[11px] text-emerald-300/80 font-bold uppercase">
            ✓ {metrics.golden_window_status}
          </p>
        </div>
      </div>

      {/* Dispatch Transmission Logs */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          <span>Dispatched Alert Channels & Webhook Payload Audit</span>
        </h3>

        <div className="space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-300 font-mono flex items-center gap-1.5">
                  {index === 0 ? <Smartphone className="w-4 h-4 text-amber-400" /> : <Building2 className="w-4 h-4 text-emerald-400" />}
                  {msg.channel}
                </span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  ✓ {msg.status}
                </span>
              </div>

              <div className="text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                {msg.content}
              </div>

              <div className="text-[11px] text-slate-400">
                Recipient: <span className="font-mono text-slate-300">{msg.recipient}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
