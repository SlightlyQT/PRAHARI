import React from 'react';
import { Zap, X, Send, Lock, CheckCircle2 } from 'lucide-react';

export default function BankHoldModal({ isOpen, onClose, alertResult, activeCase }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-xl glass-bento p-6 border border-blue-500/40 shadow-2xl space-y-5 text-slate-100 font-mono">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/40">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                AUTOMATED HOLD CONFIRMED
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Case #{alertResult?.complaint_id || activeCase?.complaint_id} Action Executed
            </h3>
          </div>
        </div>

        {/* Key Benchmark Metrics */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Response Time</div>
            <div className="text-lg font-extrabold text-emerald-400 mt-0.5">3.2<span className="text-[10px] text-emerald-300 ml-1">SEC</span></div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Industry Avg</div>
            <div className="text-lg font-extrabold text-slate-400 mt-0.5">4.5<span className="text-[10px] text-slate-500 ml-1">HRS</span></div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Time Saved</div>
            <div className="text-lg font-extrabold text-amber-400 mt-0.5">98.8%</div>
          </div>
        </div>

        {/* Dispatch Logs */}
        <div className="space-y-2 text-xs">
          <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            WEBHOOK & BROADCAST LOGS
          </div>

          <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-300 font-bold text-[11px]">
              <span className="flex items-center gap-1 text-blue-400">
                <Send className="w-3 h-3" />
                LEA Broadcast (SMS / Twilio)
              </span>
              <span className="text-emerald-400 text-[10px]">DELIVERED</span>
            </div>
            <p className="text-slate-300 text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800">
              🚨 CyberShield Alert: Fraud ₹{activeCase?.amount?.toLocaleString()} heading to {activeCase?.predicted_area}. ETA 24m! Intercept Squad Dispatched.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-300 font-bold text-[11px]">
              <span className="flex items-center gap-1 text-amber-400">
                <Lock className="w-3 h-3" />
                NPCI / Bank Lien Webhook
              </span>
              <span className="text-emerald-400 text-[10px]">LIEN HOLD ACTIVE</span>
            </div>
            <p className="text-slate-300 text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800">
              ⚡ EMERGENCY LIEN PLACED on mule accounts ({activeCase?.first_mule_account_id}). Freeze ID: FRZ-{activeCase?.complaint_id}
            </p>
          </div>
        </div>

        {/* Footer button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Acknowledge & Dismiss
          </button>
        </div>

      </div>
    </div>
  );
}
