import React from 'react';
import { ShieldAlert, Zap, Clock, AlertOctagon, ChevronRight, Lock } from 'lucide-react';

export default function AlertFeedWidget({ complaints = [], selectedComplaintId, onSelectComplaint, onTriggerHold }) {
  return (
    <div className="w-full h-full flex flex-col glass-bento overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span className="font-bold text-white uppercase">PREDICTIVE ALERT FEED (XAI)</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30 text-[10px]">
          {complaints.length} ACTIVE ALERTS
        </span>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">
        {complaints.map((c) => {
          const isSelected = c.complaint_id === selectedComplaintId;
          const riskScore = c.predicted_risk_score ? Math.round(c.predicted_risk_score * 100) : 84;
          const isHighRisk = riskScore >= 80;

          return (
            <div
              key={c.complaint_id}
              onClick={() => onSelectComplaint(c.complaint_id)}
              className={`p-3.5 rounded-xl transition-all cursor-pointer space-y-2.5 ${
                isHighRisk ? 'high-risk-alert-glow bg-slate-900/90' : 'glass-bento bg-slate-900/50'
              } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            >
              {/* Top Card Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isHighRisk && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>}
                  <span className="font-bold text-white text-xs">{c.complaint_id}</span>
                  <span className="text-slate-400 text-[10px]">({c.victim_city})</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isHighRisk ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  RISK: {riskScore}%
                </span>
              </div>

              {/* Middle Info */}
              <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Fraud Type:</span>
                  <span className="text-white font-semibold">{c.fraud_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stolen Amount:</span>
                  <span className="text-emerald-400 font-bold">₹{c.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target ATM:</span>
                  <span className="text-amber-400 font-semibold truncate max-w-[140px]">{c.predicted_area}</span>
                </div>
              </div>

              {/* Bottom ETA & Action */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>ETA: <strong className="text-white">24:00 mins</strong></span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComplaint(c.complaint_id);
                    onTriggerHold();
                  }}
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Lock className="w-3 h-3 text-amber-300" />
                  <span>Bank Hold</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
