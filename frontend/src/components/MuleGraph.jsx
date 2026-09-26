import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';

const StarChartNode = ({ data }) => {
  const isVictim = data.type === 'VICTIM';
  const isCashout = data.type === 'CASHOUT';

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Left} className="w-1.5 h-1.5 !bg-red-500" />
      
      <div className="flex flex-col items-center">
        <div
          className={`rounded-full transition-all duration-300 ${
            isCashout
              ? 'w-6 h-6 bg-red-600 ring-4 ring-red-500/40 shadow-lg shadow-red-500/80 animate-pulse'
              : isVictim
              ? 'w-4 h-4 bg-slate-100 ring-2 ring-white/40'
              : 'w-3.5 h-3.5 bg-slate-400'
          }`}
        ></div>

        <div className="mt-2 text-center">
          <span className="esri-label text-[9px] block text-slate-400">
            {isVictim ? 'VICTIM' : isCashout ? 'CASHOUT' : 'MULE'}
          </span>
          <span className="text-xs font-mono text-slate-100 block font-medium">
            {data.id.split(' ')[0]}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-1.5 h-1.5 !bg-red-500" />

      {isCashout && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 p-3 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-left space-y-1 shadow-2xl z-50">
          <span className="esri-label text-red-400 text-[10px]">
            PREDICTED TERMINAL NODE
          </span>
          <div className="text-xs font-mono text-slate-100 font-bold">
            {data.id}
          </div>
          <p className="text-[11px] text-slate-400 font-light">
            22 MIN AFTER LAST TRANSFER • {data.loc_name}
          </p>
        </div>
      )}
    </div>
  );
};

const nodeTypes = { starChartNode: StarChartNode };

export default function MuleGraph({ graphData, onProceedToMap, activeComplaintId }) {
  if (!graphData) return null;

  const { nodes, edges } = graphData;

  const flowNodes = useMemo(() => {
    return nodes.map((n, index) => {
      const xPos = 80 + index * 270;
      const yPos = 140;
      return {
        id: n.id,
        type: 'starChartNode',
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
      style: { stroke: '#EF4444', strokeWidth: 1.5, opacity: 0.8 },
      labelStyle: { fill: '#94A3B8', fontWeight: 400, fontSize: 10, fontFamily: 'Inter, sans-serif' },
      labelBgStyle: { fill: '#0A0C10', fillOpacity: 0.8, rx: 4, ry: 4 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#EF4444',
        width: 12,
        height: 12
      }
    }));
  }, [edges]);

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden">
      {/* Floating Top Header */}
      <div className="relative z-20 pt-32 px-12 max-w-[1700px] mx-auto w-full flex items-center justify-between">
        <div>
          <span className="esri-label text-red-500">SUSPECT NETWORK TRAIL</span>
          <h2 className="text-xl font-light text-slate-100 mt-1">
            Multi-Hop Mule Chain Analysis
          </h2>
        </div>

        <button
          onClick={onProceedToMap}
          className="text-xs font-mono text-white hover:text-red-400 transition-colors uppercase flex items-center gap-2 cursor-pointer"
        >
          <span>VIEW RISK FORECAST MAP</span>
          <span>→</span>
        </button>
      </div>

      {/* React Flow Canvas */}
      <div className="relative z-20 flex-1 max-w-[1700px] w-full mx-auto px-12 py-8 flex items-center justify-center">
        <div className="w-full h-[450px] relative">
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Background color="#1E293B" gap={30} size={1} />
            <Controls className="bg-[#0A0C10] border-white/10 text-white" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
