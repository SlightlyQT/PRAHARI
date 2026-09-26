import React, { useState, useEffect } from 'react';
import { Shield, Zap, CheckCircle2, AlertOctagon, ArrowRight, Activity, Cpu } from 'lucide-react';

export default function AccountTracingModal({ activeCase, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "1. Victim Complaint Ingestion",
      detail: `NCRP Case ${activeCase?.complaint_id} ingested. Stolen amount: ₹${activeCase?.amount.toLocaleString('en-IN')}`,
      status: "COMPLETED",
      acc: activeCase?.chain?.[0]?.account || "AC-8841 (Victim)"
    },
    {
      title: "2. Layer-1 Mule Account Flagged",
      detail: `Velocity Spike Detected: Transfer to ${activeCase?.first_mule_account_id} with 0 min lag.`,
      status: "DETECTED",
      acc: activeCase?.first_mule_account_id || "AC-2290 (Mule-1)"
    },
    {
      title: "3. Multi-Hop GNN Link Analysis",
      detail: "Layer 2/3 evasion pattern identified across inter-bank networks.",
      status: "TRACED",
      acc: activeCase?.chain?.[1]?.to || "AC-7715 (Mule-2)"
    },
    {
      title: "4. Cash-Out Hotspot Forecasted",
      detail: `Withdrawal location predicted at ${activeCase?.predicted_area} with ${Math.round((activeCase?.predicted_risk_score || 0.85)*100)}% Confidence.`,
      status: "PREDICTED",
      acc: activeCase?.chain?.slice(-1)[0]?.to || "ATM-CP-902 (CASHOUT)"
    }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 700);
    const timer2 = setTimeout(() => setCurrentStep(2), 1400);
    const timer3 = setTimeout(() => setCurrentStep(3), 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="card-slate p-6 md:p-8 rounded-3xl max-w-xl w-full border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                REAL-TIME ACCOUNT TRACING ENGINE
              </span>
              <h3 className="text-lg font-bold text-white">
                Mule Network Chain Scan in Progress
              </h3>
            </div>
          </div>

          <span className="text-xs font-mono bg-amber-950/80 text-amber-400 border border-amber-800 px-2.5 py-1 rounded-full animate-pulse">
            LIVE TRACING
          </span>
        </div>

        {/* Live Step-by-Step Account Detection Stream */}
        <div className="space-y-3 font-mono text-xs">
          {steps.map((s, idx) => {
            const isDone = currentStep >= idx;
            const isCurrent = currentStep === idx;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl transition-all duration-500 border ${
                  isCurrent
                    ? 'bg-amber-950/30 border-amber-500/60 animate-account-trace'
                    : isDone
                    ? 'bg-slate-900/90 border-emerald-500/40 text-slate-200'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className={isDone ? 'text-amber-400' : 'text-slate-400'}>{s.title}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      isDone
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    {isDone ? s.status : 'PENDING'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans">{s.detail}</div>
                <div className="text-[11px] font-mono text-cyan-400 font-semibold mt-1">
                  Target: {s.acc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end gap-3">
          {currentStep >= 3 ? (
            <button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>View Interactive Network Graph & Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-center text-xs text-slate-400 font-mono py-2 w-full flex items-center justify-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400 animate-spin" />
              <span>GNN Link Prediction Computing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
