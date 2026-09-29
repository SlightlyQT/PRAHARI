import React from 'react';
import { Zap, X, Send, Lock } from 'lucide-react';

export default function AlertModal({ isOpen, onClose, alertResult, activeCase }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-2xl bg-[#0a1119] rounded-3xl p-6 sm:p-8 border border-cyan-500/12 shadow-2xl space-y-6 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Alert Modal"
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#111c28] border border-cyan-500/12 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header (60% White Surface + 30% Blue Frame + 10% Purple Accent) */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-500/8 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-6 h-6 fill-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                INTERCEPTION DISPATCH EXECUTED
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/8 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                SUCCESS
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-50 mt-0.5">
              Case #{alertResult?.complaint_id || activeCase?.complaint_id} Action Summary
            </h3>
          </div>
        </div>

        {/* Metric Callouts */}
        <div className="grid grid-cols-3 gap-3 font-mono text-center">
          <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/30">
            <div className="text-xs text-slate-400">Response Time</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">3.2<span className="text-xs text-emerald-400 ml-1">SEC</span></div>
          </div>
          <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/30">
            <div className="text-xs text-slate-400">Industry Standard</div>
            <div className="text-2xl font-extrabold text-slate-500 mt-1">4.5<span className="text-xs text-slate-500 ml-1">HRS</span></div>
          </div>
          <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/30">
            <div className="text-xs text-slate-400">Time Saved</div>
            <div className="text-2xl font-extrabold text-cyan-400 mt-1">98.8%</div>
          </div>
        </div>

        {/* Broadcast Logs */}
        <div className="space-y-3 font-mono text-xs">
          <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
            AUTOMATED DISPATCH LOGS
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/24 space-y-2">
            <div className="flex items-center justify-between text-slate-200 font-bold">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                LEA Broadcast (SMS / Police Network)
              </span>
              <span className="text-emerald-400 text-[10px] bg-emerald-500/8 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">DELIVERED</span>
            </div>
            <p className="text-slate-300 bg-[#0a1119] p-3 rounded-xl border border-cyan-500/24 leading-relaxed">
              🚨 P.R.A.H.A.R.I. ALERT: Fraud ₹{activeCase?.amount?.toLocaleString()} moving to {activeCase?.predicted_area}. ETA 24 mins! Intercept Patrol Dispatched to Connaught Place Hub.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/24 space-y-2">
            <div className="flex items-center justify-between text-slate-200 font-bold">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                NPCI / Partner Bank Lien Webhook
              </span>
              <span className="text-emerald-400 text-[10px] bg-emerald-500/8 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">LIEN PLACED</span>
            </div>
            <p className="text-slate-300 bg-[#0a1119] p-3 rounded-xl border border-cyan-500/24 leading-relaxed">
              ⚡ EMERGENCY LIEN HOLD PLACED on mule accounts ({activeCase?.first_mule_account_id}). Account Freeze ID: FRZ-{activeCase?.complaint_id}
            </p>
          </div>
        </div>

        {/* Footer Action (10% Purple Accent) */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs transition-all cursor-pointer font-mono shadow-md shadow-emerald-500/25 uppercase"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
