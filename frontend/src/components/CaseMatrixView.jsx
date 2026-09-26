import React from 'react';
import { Layers, ArrowRight, ShieldAlert, CreditCard, CornerDownRight, Zap } from 'lucide-react';

export default function CaseMatrixView({ graphData, onProceed, activeCase }) {
  if (!graphData) return null;

  const { nodes, edges, chain_length } = graphData;

  return (
    <div className="space-y-5">
      {/* Top Matrix Header */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-950/80 rounded-xl border border-cyan-800/60 text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Visual Case Matrix & Money Velocity Flow</h2>
              <span className="text-xs bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-mono">
                {activeCase?.complaint_id}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Multi-hop transfer breakdown across {chain_length} accounts with transfer velocity lag metrics.
            </p>
          </div>
        </div>

        <button
          onClick={onProceed}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Explore Force Network Graph (View 2)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Flow Matrix Cards */}
      <div className="space-y-4">
        {edges.map((edge, idx) => {
          const srcNode = nodes.find(n => n.id === edge.from);
          const dstNode = nodes.find(n => n.id === edge.to);
          const isFinal = idx === edges.length - 1;

          return (
            <div
              key={edge.id}
              className={`glass-card p-5 rounded-2xl border transition-all duration-300 ${
                isFinal ? 'border-red-500/60 neon-border-red bg-red-950/20' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Source Node */}
                <div className="flex items-center gap-3 w-full lg:w-1/3">
                  <div className={`p-3 rounded-xl font-bold text-xs font-mono shrink-0 ${
                    idx === 0 ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}>
                    {idx === 0 ? 'ORIGIN' : `MULE ${idx}`}
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 font-mono block">{srcNode?.bank || 'Bank'}</span>
                    <h4 className="font-bold text-white text-sm truncate">{edge.from}</h4>
                    <span className="text-xs text-slate-400">📍 {srcNode?.loc_name}</span>
                  </div>
                </div>

                {/* Transfer Arrow & Delay Meter */}
                <div className="flex flex-col items-center justify-center w-full lg:w-1/3 space-y-1">
                  <div className="flex items-center justify-between w-full text-xs font-mono">
                    <span className="text-emerald-400 font-bold">{edge.amount}</span>
                    <span className="text-amber-400 font-bold">{edge.delay_min} min lag</span>
                  </div>
                  
                  {/* Animated Velocity Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 relative">
                    <div
                      className={`h-full rounded-full animate-pulse ${
                        isFinal ? 'bg-gradient-to-r from-amber-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      }`}
                      style={{ width: `${Math.max(20, 100 - edge.delay_min * 2)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Destination Node */}
                <div className="flex items-center gap-3 w-full lg:w-1/3 justify-end text-right">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 font-mono block">{dstNode?.bank || 'Bank'}</span>
                    <h4 className={`font-bold text-sm truncate ${isFinal ? 'text-red-400 font-extrabold' : 'text-white'}`}>
                      {edge.to}
                    </h4>
                    <span className="text-xs text-slate-400">📍 {dstNode?.loc_name}</span>
                  </div>
                  <div className={`p-3 rounded-xl font-bold text-xs font-mono shrink-0 ${
                    isFinal ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}>
                    {isFinal ? 'CASHOUT' : `MULE ${idx + 1}`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
