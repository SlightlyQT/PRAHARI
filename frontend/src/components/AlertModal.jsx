import React from 'react';
import { Zap, X, Send, Lock } from 'lucide-react';

export default function AlertModal({ isOpen, onClose, alertResult, activeCase }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Alert Modal"
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header (60% White Surface + 30% Blue Frame + 10% Purple Accent) */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
            <Zap className="w-6 h-6 fill-purple-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-purple-700 uppercase tracking-widest">
                INTERCEPTION DISPATCH EXECUTED
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-mono font-bold border border-purple-200">
                SUCCESS
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-950 mt-0.5">
              Case #{alertResult?.complaint_id || activeCase?.complaint_id} Action Summary
            </h3>
          </div>
        </div>

        {/* Metric Callouts */}
        <div className="grid grid-cols-3 gap-3 font-mono text-center">
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200">
            <div className="text-xs text-slate-500">Response Time</div>
            <div className="text-2xl font-extrabold text-purple-600 mt-1">3.2<span className="text-xs text-purple-500 ml-1">SEC</span></div>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200">
            <div className="text-xs text-slate-500">Industry Standard</div>
            <div className="text-2xl font-extrabold text-slate-400 mt-1">4.5<span className="text-xs text-slate-400 ml-1">HRS</span></div>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200">
            <div className="text-xs text-slate-500">Time Saved</div>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">98.8%</div>
          </div>
        </div>

        {/* Broadcast Logs */}
        <div className="space-y-3 font-mono text-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            AUTOMATED DISPATCH LOGS
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/40 border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between text-slate-800 font-bold">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Send className="w-3.5 h-3.5 text-purple-600" />
                LEA Broadcast (SMS / Police Network)
              </span>
              <span className="text-purple-700 text-[10px] bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">DELIVERED</span>
            </div>
            <p className="text-slate-700 bg-white p-3 rounded-xl border border-blue-200/80 leading-relaxed">
              🚨 P.R.A.H.A.R.I. ALERT: Fraud ₹{activeCase?.amount?.toLocaleString()} moving to {activeCase?.predicted_area}. ETA 24 mins! Intercept Patrol Dispatched to Connaught Place Hub.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/40 border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between text-slate-800 font-bold">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                NPCI / Partner Bank Lien Webhook
              </span>
              <span className="text-purple-700 text-[10px] bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">LIEN PLACED</span>
            </div>
            <p className="text-slate-700 bg-white p-3 rounded-xl border border-blue-200/80 leading-relaxed">
              ⚡ EMERGENCY LIEN HOLD PLACED on mule accounts ({activeCase?.first_mule_account_id}). Account Freeze ID: FRZ-{activeCase?.complaint_id}
            </p>
          </div>
        </div>

        {/* Footer Action (10% Purple Accent) */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-all cursor-pointer font-mono shadow-md shadow-purple-600/25 uppercase"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
