import React, { useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import {
  Zap, Play, Pause, RotateCcw, ShieldAlert, AlertTriangle, ArrowRight,
  Building2, CreditCard, MapPin, Cpu, Clock, CheckCircle2,
  Lock, Network, Layers, GitCommit, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

// Custom ReactFlow Porcelain Node Component
const MuleNodeCard = ({ data }) => {
  const Icon = data.icon;
  const isSelected = data.isSelected;
  const isActive = data.isActive;

  return (
    <div
      onClick={() => data.onSelect(data.id)}
      className={`p-4 rounded-2xl bg-[#0a1119] border transition-all duration-300 flex items-center gap-3.5 shadow-md hover:shadow-2xl min-w-[210px] ${
        isSelected
          ? 'border-cyan-400 ring-4 ring-cyan-400/20 scale-105 shadow-cyan-500/20 z-30'
          : isActive
          ? 'border-cyan-500/20 hover:border-cyan-400 z-20'
          : 'border-cyan-500/12 opacity-80 z-10'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-cyan-400 !w-2.5 !h-2.5 !border-2 !border-white/10" />
      <Handle type="source" position={Position.Right} className="!bg-cyan-400 !w-2.5 !h-2.5 !border-2 !border-white/10" />
      <Handle type="source" id="bottom" position={Position.Bottom} className="!bg-slate-400 !w-2 !h-2" />
      <Handle type="target" id="top" position={Position.Top} className="!bg-slate-400 !w-2 !h-2" />

      <div className={`p-2.5 rounded-xl flex items-center justify-center font-mono border ${data.badgeColor}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="text-left font-mono space-y-0.5 truncate">
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          {data.stageLabel}
        </div>
        <div className="text-xs font-black text-slate-50 tracking-tight truncate">
          {data.title}
        </div>
        <div className="text-[11px] font-bold text-cyan-400">
          {data.amount}
        </div>
      </div>

      {data.type === 'TARGET_ATM' && (
        <span className="w-3.5 h-3.5 rounded-full bg-rose-400 animate-ping ml-auto"></span>
      )}
    </div>
  );
};

const nodeTypes = { muleNode: MuleNodeCard };

export default function MuleTraceCanvas({ graphData, activeCase, onProceedToMap }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState('mule1');
  const [viewMode, setViewMode] = useState('graph'); // 'graph' | 'cards'
  const [animatedRisk, setAnimatedRisk] = useState(15);
  const [isLienIssued, setIsLienIssued] = useState(false);

  const totalSteps = 3;
  const targetRisk = activeCase?.predicted_zone?.risk_score
    ? Math.round(activeCase.predicted_zone.risk_score * 100)
    : 84;

  // Animation timeline loop
  useEffect(() => {
    let timer;
    if (isPlaying) {
      if (activeStep < totalSteps) {
        timer = setTimeout(() => {
          setActiveStep(prev => prev + 1);
        }, 1300);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, totalSteps]);

  // Risk animation count-up
  useEffect(() => {
    if (activeStep === 0) {
      setAnimatedRisk(15);
    } else {
      const stepFactor = activeStep / totalSteps;
      const currentVal = Math.round(15 + (targetRisk - 15) * stepFactor);
      setAnimatedRisk(currentVal);
    }
  }, [activeStep, totalSteps, targetRisk]);

  const handleStartTrace = () => {
    setActiveStep(0);
    setIsPlaying(true);
    setIsLienIssued(false);
  };

  const handleResetTrace = () => {
    setActiveStep(0);
    setIsPlaying(false);
    setSelectedNodeId('victim');
    setIsLienIssued(false);
  };

  // Node Raw Data
  const rawNodes = [
    {
      id: 'victim',
      type: 'VICTIM',
      stepIdx: 0,
      stageLabel: 'VICTIM ORIGIN',
      title: activeCase?.victim_name || 'R. Sharma',
      bank: 'State Bank of India',
      accNo: 'AC-884190',
      city: activeCase?.victim_city || 'New Delhi',
      amount: `₹${activeCase?.amount?.toLocaleString() || '85,000'}`,
      badgeColor: 'bg-cyan-500/8 text-cyan-400 border-cyan-500/30',
      icon: Building2,
      lag: '0m (Origin)',
      risk: 'LOW RISK (VICTIM)',
      ifsc: 'SBIN0000691',
      ip: '103.24.12.89',
      position: { x: 40, y: 150 }
    },
    {
      id: 'mule1',
      type: 'MULE_L1',
      stepIdx: 1,
      stageLabel: 'MULE LAYER 1',
      title: activeCase?.first_mule_account_id || 'AC-2290',
      bank: 'ICICI Bank Gateway',
      accNo: 'AC-229044',
      city: 'Delhi East Node',
      amount: '₹82,000',
      badgeColor: 'bg-cyan-500/8 text-cyan-400 border-cyan-500/30',
      icon: CreditCard,
      lag: '+ 0m lag',
      risk: 'HIGH MULE PROBABILITY (94%)',
      ifsc: 'ICIC0001092',
      ip: '45.112.88.14',
      position: { x: 330, y: 60 }
    },
    {
      id: 'submule1',
      type: 'SUB_MULE',
      stepIdx: 1,
      stageLabel: 'DIVERSION BRANCH',
      title: 'AC-9912 (Axis)',
      bank: 'Axis Bank Sub-Branch',
      accNo: 'AC-991204',
      city: 'Noida Hub',
      amount: '₹3,000',
      badgeColor: 'bg-[#111c28] text-slate-300 border-cyan-500/12',
      icon: GitCommit,
      lag: '+ 2m lag',
      risk: 'SECONDARY SPLITTER',
      ifsc: 'UTIB0000412',
      ip: '103.88.19.04',
      position: { x: 330, y: 260 }
    },
    {
      id: 'mule2',
      type: 'MULE_L2',
      stepIdx: 2,
      stageLabel: 'MULE LAYER 2',
      title: 'AC-7715 (HDFC)',
      bank: 'HDFC Bank Node',
      accNo: 'AC-771509',
      city: 'Barakhamba Node',
      amount: '₹80,000',
      badgeColor: 'bg-amber-500/8 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      lag: '+ 8m lag',
      risk: 'CRITICAL MULE SPLITTER (91%)',
      ifsc: 'HDFC0000240',
      ip: '182.74.55.90',
      position: { x: 630, y: 150 }
    },
    {
      id: 'cashout',
      type: 'TARGET_ATM',
      stepIdx: 3,
      stageLabel: 'PREDICTED CASHOUT',
      title: activeCase?.predicted_area || 'ATM Hub CP',
      bank: 'Regal Building ATM Hub',
      accNo: 'ATM-CP-902',
      city: 'Connaught Place',
      amount: 'TARGET CASHOUT',
      badgeColor: 'bg-rose-500/8 text-rose-400 border-rose-500/30',
      icon: MapPin,
      lag: 'ETA 24 mins',
      risk: 'IMMINENT CASHOUT HOTSPOT',
      ifsc: 'ATM-HUB-902',
      ip: '14.139.60.11',
      position: { x: 920, y: 150 }
    }
  ];

  const selectedNode = rawNodes.find(n => n.id === selectedNodeId) || rawNodes[1];

  // Convert to ReactFlow Nodes
  const flowNodes = useMemo(() => {
    return rawNodes.map(n => ({
      id: n.id,
      type: 'muleNode',
      position: n.position,
      data: {
        ...n,
        isSelected: selectedNodeId === n.id,
        isActive: activeStep >= n.stepIdx,
        onSelect: (id) => setSelectedNodeId(id)
      }
    }));
  }, [rawNodes, selectedNodeId, activeStep]);

  // ReactFlow Edges with Dynamic Labels & Colors
  const flowEdges = useMemo(() => [
    {
      id: 'e-v-m1',
      source: 'victim',
      target: 'mule1',
      label: 'Transfer: ₹82,000 (0m lag)',
      animated: activeStep >= 1,
      style: { stroke: activeStep >= 1 ? '#22D3EE' : '#1E293B', strokeWidth: 3 },
      labelStyle: { fill: '#67E8F9', fontWeight: 800, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
      labelBgStyle: { fill: '#05080D', fillOpacity: 0.95, rx: 8, ry: 8, stroke: '#155E75', strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: activeStep >= 1 ? '#22D3EE' : '#1E293B' }
    },
    {
      id: 'e-m1-sub',
      source: 'mule1',
      sourceHandle: 'bottom',
      target: 'submule1',
      targetHandle: 'top',
      label: 'Split: ₹3,000 (2m lag)',
      animated: activeStep >= 1,
      style: { stroke: '#475569', strokeWidth: 2, strokeDasharray: '4 4' },
      labelStyle: { fill: '#94A3B8', fontWeight: 700, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
      labelBgStyle: { fill: '#05080D', fillOpacity: 0.95, rx: 6, ry: 6, stroke: '#334155', strokeWidth: 1 }
    },
    {
      id: 'e-m1-m2',
      source: 'mule1',
      target: 'mule2',
      label: 'Splitter: ₹80,000 (8m lag)',
      animated: activeStep >= 2,
      style: { stroke: activeStep >= 2 ? '#F59E0B' : '#1E293B', strokeWidth: 3 },
      labelStyle: { fill: '#FCD34D', fontWeight: 800, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
      labelBgStyle: { fill: '#05080D', fillOpacity: 0.95, rx: 8, ry: 8, stroke: '#92400E', strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: activeStep >= 2 ? '#F59E0B' : '#1E293B' }
    },
    {
      id: 'e-m2-cashout',
      source: 'mule2',
      target: 'cashout',
      label: 'INTERCEPT PATH (22m)',
      animated: activeStep >= 3,
      style: { stroke: activeStep >= 3 ? '#F43F5E' : '#1E293B', strokeWidth: 3.5 },
      labelStyle: { fill: '#FDA4AF', fontWeight: 900, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
      labelBgStyle: { fill: '#05080D', fillOpacity: 0.95, rx: 8, ry: 8, stroke: '#9F1239', strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: activeStep >= 3 ? '#F43F5E' : '#1E293B' }
    }
  ], [activeStep]);

  return (
    <section id="trace-engine" className="py-32 sm:py-40 relative overflow-hidden text-slate-100">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 35 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10"
      >
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-6 border-b border-cyan-500/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/8 border border-cyan-500/30 text-xs font-semibold text-cyan-300 font-mono mb-3 shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              GRAPH RECONSTRUCTION & MULTI-HOP TOPOLOGY
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-50 tracking-tight">
              Mule Account <span className="text-emerald-400">Trace Canvas</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl font-normal">
              Spacious multi-hop transaction reconstruction canvas mapping layering velocity, sub-mule diversions, and predicted ATM payouts.
            </p>
          </div>

          {/* Controls Bar (30% Blue Structure + 10% Purple Accent Button) */}
          <div className="mt-6 lg:mt-0 flex flex-wrap items-center gap-3 font-mono text-xs">
            {/* View Switcher */}
            <div className="p-1 rounded-2xl bg-[#0a1119] border border-cyan-500/30 shadow-xs flex items-center gap-1">
              <button
                onClick={() => setViewMode('graph')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  viewMode === 'graph'
                    ? 'bg-cyan-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-50'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>2D TOPOLOGY GRAPH</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-cyan-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>DOSSIER CARDS</span>
              </button>
            </div>

            {/* Animation Controls (10% Purple Accent CTA) */}
            <button
              onClick={isPlaying ? () => setIsPlaying(false) : handleStartTrace}
              className={`px-5 py-3 rounded-2xl font-extrabold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-98 ${
                isPlaying
                  ? 'bg-amber-400 text-white shadow-amber-500/25'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/25'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'PAUSE TRACE' : 'ANIMATE GRAPH FLOW'}</span>
            </button>

            <button
              onClick={handleResetTrace}
              className="p-3 rounded-2xl bg-[#0a1119] border border-cyan-500/30 text-slate-300 hover:bg-cyan-500/8 transition-all cursor-pointer shadow-xs active:scale-98"
              title="Reset Trace"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* FULL-WIDTH GRAPH CANVAS (DARK OPS CANVAS) */}
        <div className="bento-card-light p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 bg-[#05080d] border border-cyan-500/24">
          
          {/* Top Canvas Bar */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-cyan-500/10 font-mono text-xs gap-3">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-50 font-black">CASE DOSSIER: {activeCase?.complaint_id || 'NCRP-2026-00417'}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400 font-semibold">
                {activeStep === totalSteps ? '● CHAIN FULLY RECONSTRUCTED' : `TRACING STEP ${activeStep} OF ${totalSteps} ACTIVE`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/8 text-cyan-300 border border-cyan-500/30 text-[10px] font-black uppercase">
                NEO4J GRAPH DB
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                5 GRAPH NODES • 4 TRANSACTION EDGES
              </span>
            </div>
          </div>

          {/* 2D GRAPH CANVAS AREA */}
          {viewMode === 'graph' ? (
            <div className="relative w-full h-[480px] bg-[#0d1621]/70 border border-cyan-500/11 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
              <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                attributionPosition="bottom-right"
                nodesDraggable={true}
                nodesConnectable={false}
                zoomOnScroll={false}
                panOnScroll={false}
                preventScrolling={false}
              >
                <Background color="#164E63" gap={24} size={1} />
                <Controls className="!bg-[#0a1119] !border-cyan-500/12 !text-slate-200 !shadow-md !rounded-xl" />
              </ReactFlow>
            </div>
          ) : (
            /* DOSSIER CARD VIEW MODE */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
              {rawNodes.filter(n => n.type !== 'SUB_MULE').map((n) => {
                const Icon = n.icon;
                const isSelected = selectedNodeId === n.id;

                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    className={`p-6 rounded-2xl bg-[#0a1119] border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px] shadow-md hover:shadow-xl ${
                      isSelected
                        ? 'border-emerald-400 ring-4 ring-emerald-400/10 shadow-emerald-500/10'
                        : 'border-cyan-500/12'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-extrabold border ${n.badgeColor}`}>
                        {n.stageLabel}
                      </span>
                      <div className="p-2 rounded-xl bg-cyan-500/8 border border-cyan-500/30 text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1 my-2 font-sans">
                      <div className="text-base font-black text-slate-50 tracking-tight">
                        {n.title}
                      </div>
                      <div className="text-xs font-mono text-slate-400 font-medium">
                        {n.bank}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Amount:</span>
                        <strong className="text-emerald-400 font-bold">{n.amount}</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-500 text-[11px]">
                        <span>Lag:</span>
                        <span className="font-semibold text-slate-400">{n.lag}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stepper Footer Bar */}
          <div className="pt-4 border-t border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center space-x-3 text-slate-400">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Total Hop Latency: <strong className="text-slate-50 font-extrabold">22 Minutes</strong></span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-400 font-bold">Golden Interception Window Open</span>
            </div>

            <button
              onClick={onProceedToMap}
              className="px-6 py-3 rounded-2xl bg-cyan-500/8 hover:bg-cyan-500/14 text-cyan-300 font-extrabold text-xs border border-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-98"
            >
              <span>EXPLORE SPATIAL ATM RADAR</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

        </div>

        {/* BOTTOM 3-COLUMN BENTO WIDGETS GRID (60% White + 30% Blue Cards + 10% Purple Accent) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Selected Node Intelligence Inspector */}
          <div className="bento-card-light p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between font-mono text-xs border-b border-cyan-500/10 pb-3">
              <div className="flex items-center gap-2 text-slate-50 font-black">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>NODE INSPECTOR</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${selectedNode.badgeColor}`}>
                {selectedNode.stageLabel}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">ACCOUNT / ID:</span>
                <span className="text-slate-50 font-black">{selectedNode.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">BANK GATEWAY:</span>
                <span className="text-cyan-400 font-bold">{selectedNode.bank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">IFSC CODE:</span>
                <span className="text-slate-100 font-bold">{selectedNode.ifsc}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">NODE LOCATION:</span>
                <span className="text-slate-100 font-bold">{selectedNode.city}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-slate-400">RISK CLASSIFICATION:</span>
                <span className="text-emerald-400 font-extrabold text-[11px]">{selectedNode.risk}</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Mule Risk Evaluation AI Dial (Pulsing Purple Glow) */}
          <div className="bento-card-light purple-pulse-glow p-6 shadow-xl space-y-4 bg-[#0a1119]">
            <div className="flex items-center justify-between font-mono text-xs border-b border-cyan-500/10 pb-3">
              <div className="flex items-center gap-2 text-slate-50 font-black">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>MULE RISK EVALUATION</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 text-[10px] font-black">
                AI MODEL v2.4
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-4xl font-black font-mono text-emerald-400 tracking-tight">
                  {animatedRisk}%
                </div>
                <div className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider mt-0.5">
                  HIGH FRAUD CONFIDENCE
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/8 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-400 font-mono font-black shadow-sm">
                <span className="text-xs">CRIT</span>
              </div>
            </div>

            <div className="w-full bg-[#111c28] rounded-full h-2.5 overflow-hidden border border-cyan-500/12">
              <div
                className="bg-gradient-to-r from-cyan-400 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${animatedRisk}%` }}
              ></div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 space-y-1 pt-1">
              <div className="flex justify-between">
                <span>Transfer Velocity (40%):</span>
                <strong className="text-cyan-400">HIGH (0m - 8m)</strong>
              </div>
              <div className="flex justify-between">
                <span>Mule Layer Depth (30%):</span>
                <strong className="text-emerald-400">3 Hops + Sub-Split</strong>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Explainable AI & Bank Lien Action */}
          <div className="bento-card-light p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between font-mono text-xs border-b border-cyan-500/10 pb-3">
              <div className="flex items-center gap-2 text-slate-50 font-black">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>EXPLAINABLE AI RECOMMENDATION</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans font-normal">
              Fund flow pattern confirms rapid multi-layer layering strategy. Immediate bank lien hold on <strong>{activeCase?.first_mule_account_id || 'AC-2290'}</strong> is recommended to freeze remaining <strong>₹82,000</strong>.
            </p>

            <button
              onClick={() => setIsLienIssued(true)}
              disabled={isLienIssued}
              className={`w-full py-3.5 rounded-2xl font-mono text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 ${
                isLienIssued
                  ? 'bg-emerald-400 text-slate-950 cursor-default'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/25'
              }`}
            >
              {isLienIssued ? (
                <>
                  <CheckCircle2 className="w-4 h-4 fill-white" />
                  <span>EMERGENCY LIEN ISSUED</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 fill-white" />
                  <span>ISSUE AUTOMATED BANK LIEN</span>
                </>
              )}
            </button>
          </div>

        </div>

      </motion.div>
    </section>
  );
}
