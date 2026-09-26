import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import { Cpu, ArrowRight, AlertOctagon, ShieldAlert } from 'lucide-react';

const AccountNode = ({ data }) => {
  const isVictim = data.type === 'VICTIM';
  const isCashout = data.type === 'CASHOUT';

  return (
    <div
      className={`p-4 rounded-2xl border min-w-[220px] shadow-2xl transition-all duration-300 ${
        isVictim
          ? 'bg-slate-900 border-blue-500/80 text-blue-200'
          : isCashout
          ? 'bg-red-950/95 border-2 border-red-500 text-red-100 neon-border-red animate-pulse'
          : 'bg-slate-900 border-slate-700 text-slate-200'
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-cyan-400" />
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono ${
            isVictim
              ? 'bg-blue-950 text-blue-400 border border-blue-800'
              : isCashout
              ? 'bg-red-900 text-red-100 font-extrabold uppercase animate-bounce'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {isVictim ? 'VICTIM ACCOUNT' : isCashout ? '🚨 PREDICTED CASH-OUT' : 'SUSPECT MULE'}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">{data.bank}</span>
      </div>

      <div className="font-bold text-sm text-white font-mono truncate">{data.label}</div>
      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
        <span>📍 {data.loc_name}</span>
      </div>

      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-cyan-400" />
    </div>
  );
};

const nodeTypes = { accountNode: AccountNode };

export default function ForceGraphView({ graphData, onProceed, activeCase }) {
  if (!graphData) return null;

  const { nodes, edges, chain_length } = graphData;

  const flowNodes = useMemo(() => {
    return nodes.map((n, index) => {
      const xPos = 60 + index * 270;
      const yPos = index % 2 === 0 ? 110 : 180;
      return {
        id: n.id,
        type: 'accountNode',
        position: { x: xPos, y: yPos },
        data: n
      };
    });
  }, [nodes]);

  const flowEdges = useMemo(() => {
    return edges.map((e) => ({
      id: e.id,
      source: e.from,
      target: e.to,
      label: e.label,
      animated: true,
      style: { stroke: '#06B6D4', strokeWidth: 3.5 },
      labelStyle: { fill: '#F8FAFC', fontWeight: 700, fontSize: 11, fontFamily: 'monospace' },
      labelBgStyle: { fill: '#0F172A', fillOpacity: 0.9, rx: 6, ry: 6 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#06B6D4',
        width: 18,
        height: 18
      }
    }));
  }, [edges]);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-950/80 rounded-xl border border-cyan-800/60 text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Mule Network Graph Particle Canvas</h2>
              <span className="text-xs bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded border border-cyan-800">
                {activeCase?.complaint_id}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Interactive Graph Neural Network multi-hop node cluster with transfer particle streams.
            </p>
          </div>
        </div>

        <button
          onClick={onProceed}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Open Tactical Radar Map (View 3)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden relative" style={{ height: '460px' }}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#1E293B" gap={24} size={1} />
          <Controls className="bg-slate-900 border-slate-800 text-slate-200" />
        </ReactFlow>
      </div>
    </div>
  );
}
