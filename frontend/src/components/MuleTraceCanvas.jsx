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
      className={`p-4 rounded-2xl bg-white border transition-all duration-300 flex items-center gap-3.5 shadow-md hover:shadow-2xl min-w-[210px] ${
        isSelected
          ? 'border-blue-600 ring-4 ring-blue-500/20 scale-105 shadow-blue-500/20 z-30'
          : isActive
          ? 'border-slate-300 hover:border-blue-400 z-20'
          : 'border-slate-200 opacity-80 z-10'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-blue-600 !w-2.5 !h-2.5 !border-2 !border-white" />
      <Handle type="source" position={Position.Right} className="!bg-blue-600 !w-2.5 !h-2.5 !border-2 !border-white" />
      <Handle type="source" id="bottom" position={Position.Bottom} className="!bg-slate-400 !w-2 !h-2" />
      <Handle type="target" id="top" position={Position.Top} className="!bg-slate-400 !w-2 !h-2" />

      <div className={`p-2.5 rounded-xl flex items-center justify-center font-mono border ${data.badgeColor}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="text-left font-mono space-y-0.5 truncate">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          {data.stageLabel}
        </div>
        <div className="text-xs font-black text-slate-950 tracking-tight truncate">
          {data.title}
        </div>
        <div className="text-[11px] font-bold text-blue-700">
          {data.amount}
        </div>
      </div>

      {data.type === 'TARGET_ATM' && (
        <span className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-ping ml-auto"></span>
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
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
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
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
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
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
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
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
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
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
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
      style: { stroke: activeStep >= 1 ? '#2563EB' : '#CBD5E1', strokeWidth: 3 },
      labelStyle: { fill: '#1E40AF', fontWeight: 800, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
      labelBgStyle: { fill: '#EFF6FF', fillOpacity: 0.95, rx: 8, ry: 8, stroke: '#BFDBFE', strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: activeStep >= 1 ? '#2563EB' : '#CBD5E1' }
    },
    {
      id: 'e-m1-sub',
      source: 'mule1',
      sourceHandle: 'bottom',
      target: 'submule1',
      targetHandle: 'top',
      label: 'Split: ₹3,000 (2m lag)',
      animated: activeStep >= 1,
      style: { stroke: '#94A3B8', strokeWidth: 2, strokeDasharray: '4 4' },
      labelStyle: { fill: '#475569', fontWeight: 700, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
      labelBgStyle: { fill: '#F8FAFC', fillOpacity: 0.95, rx: 6, ry: 6, stroke: '#E2E8F0', strokeWidth: 1 }
    },
    {
      id: 'e-m1-m2',
      source: 'mule1',
      target: 'mule2',
      label: 'Splitter: ₹80,000 (8m lag)',
      animated: activeStep >= 2,
      style: { stroke: activeStep >= 2 ? '#D97706' : '#CBD5E1', strokeWidth: 3 },
      labelStyle: { fill: '#92400E', fontWeight: 800, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
      labelBgStyle: { fill: '#FFFBEB', fillOpacity: 0.95, rx: 8, ry: 8, stroke: '#FDE68A', strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: activeStep >= 2 ? '#D97706' : '#CBD5E1' }
    },
    {
      id: 'e-m2-cashout',
      source: 'mule2',
      target: 'cashout',
      label: 'INTERCEPT PATH (22m)',
      animated: activeStep >= 3,
      style: { stroke: activeStep >= 3 ? '#E11D48' : '#CBD5E1', strokeWidth: 3.5 },
      labelStyle: { fill: '#9F1239', fontWeight: 900, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
      labelBgStyle: { fill: '#FFF1F2', fillOpacity: 0.95, rx: 8, ry: 8, stroke: '#FECDD3', strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: activeStep >= 3 ? '#E11D48' : '#CBD5E1' }
    }
  ], [activeStep]);

  return (
    <section id="trace-engine" className="py-32 sm:py-40 relative overflow-hidden text-slate-900">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 35 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10"
      >
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-6 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 font-mono mb-3 shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
              GRAPH RECONSTRUCTION & MULTI-HOP TOPOLOGY
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Mule Account <span className="text-purple-600">Trace Canvas</span>
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl font-normal">
              Spacious multi-hop transaction reconstruction canvas mapping layering velocity, sub-mule diversions, and predicted ATM payouts.
            </p>
          </div>

          {/* Controls Bar (30% Blue Structure + 10% Purple Accent Button) */}
          <div className="mt-6 lg:mt-0 flex flex-wrap items-center gap-3 font-mono text-xs">
            {/* View Switcher */}
            <div className="p-1 rounded-2xl bg-white border border-blue-200 shadow-xs flex items-center gap-1">
              <button
                onClick={() => setViewMode('graph')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  viewMode === 'graph'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>2D TOPOLOGY GRAPH</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-950'
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
                  ? 'bg-amber-600 text-white shadow-amber-600/25'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'PAUSE TRACE' : 'ANIMATE GRAPH FLOW'}</span>
            </button>

            <button
              onClick={handleResetTrace}
              className="p-3 rounded-2xl bg-white border border-blue-200 text-slate-700 hover:bg-blue-50 transition-all cursor-pointer shadow-xs active:scale-98"
              title="Reset Trace"
            >
              <RotateCcw className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>

        {/* FULL-WIDTH GRAPH CANVAS (SOFT MUTED TECH OFF-WHITE #F8FAFC) */}
        <div className="bento-card-light p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 bg-[#F8FAFC] border border-blue-200/80">
          
          {/* Top Canvas Bar */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200/80 font-mono text-xs gap-3">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping"></span>
              <span className="text-slate-950 font-black">CASE DOSSIER: {activeCase?.complaint_id || 'NCRP-2026-00417'}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-semibold">
                {activeStep === totalSteps ? '● CHAIN FULLY RECONSTRUCTED' : `TRACING STEP ${activeStep} OF ${totalSteps} ACTIVE`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-black uppercase">
                NEO4J GRAPH DB
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black uppercase">
                5 GRAPH NODES • 4 TRANSACTION EDGES
              </span>
            </div>
          </div>

          {/* 2D GRAPH CANVAS AREA */}
          {viewMode === 'graph' ? (
            <div className="relative w-full h-[480px] bg-slate-50/70 border border-slate-200/90 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
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
                <Background color="#CBD5E1" gap={24} size={1} />
                <Controls className="!bg-white !border-slate-200 !text-slate-800 !shadow-md !rounded-xl" />
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
                    className={`p-6 rounded-2xl bg-white border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px] shadow-md hover:shadow-xl ${
                      isSelected
                        ? 'border-purple-600 ring-4 ring-purple-500/10 shadow-purple-500/10'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-extrabold border ${n.badgeColor}`}>
                        {n.stageLabel}
                      </span>
                      <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1 my-2 font-sans">
                      <div className="text-base font-black text-slate-950 tracking-tight">
                        {n.title}
                      </div>
                      <div className="text-xs font-mono text-slate-500 font-medium">
                        {n.bank}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Amount:</span>
                        <strong className="text-purple-700 font-bold">{n.amount}</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 text-[11px]">
                        <span>Lag:</span>
                        <span className="font-semibold text-slate-600">{n.lag}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stepper Footer Bar */}
          <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center space-x-3 text-slate-600">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Total Hop Latency: <strong className="text-slate-950 font-extrabold">22 Minutes</strong></span>
              <span className="text-slate-300">|</span>
              <span className="text-purple-700 font-bold">Golden Interception Window Open</span>
            </div>

            <button
              onClick={onProceedToMap}
              className="px-6 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold text-xs border border-blue-200 transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-98"
            >
              <span>EXPLORE SPATIAL ATM RADAR</span>
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </button>
          </div>

        </div>

        {/* BOTTOM 3-COLUMN BENTO WIDGETS GRID (60% White + 30% Blue Cards + 10% Purple Accent) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Selected Node Intelligence Inspector */}
          <div className="bento-card-light p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between font-mono text-xs border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2 text-slate-950 font-black">
                <Info className="w-4 h-4 text-blue-600" />
                <span>NODE INSPECTOR</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${selectedNode.badgeColor}`}>
                {selectedNode.stageLabel}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">ACCOUNT / ID:</span>
                <span className="text-slate-950 font-black">{selectedNode.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">BANK GATEWAY:</span>
                <span className="text-blue-700 font-bold">{selectedNode.bank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">IFSC CODE:</span>
                <span className="text-slate-900 font-bold">{selectedNode.ifsc}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">NODE LOCATION:</span>
                <span className="text-slate-900 font-bold">{selectedNode.city}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">RISK CLASSIFICATION:</span>
                <span className="text-purple-700 font-extrabold text-[11px]">{selectedNode.risk}</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Mule Risk Evaluation AI Dial (Pulsing Purple Glow) */}
          <div className="bento-card-light purple-pulse-glow p-6 shadow-xl space-y-4 bg-white">
            <div className="flex items-center justify-between font-mono text-xs border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2 text-slate-950 font-black">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>MULE RISK EVALUATION</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black">
                AI MODEL v2.4
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-4xl font-black font-mono text-purple-600 tracking-tight">
                  {animatedRisk}%
                </div>
                <div className="text-xs font-bold text-blue-700 uppercase font-mono tracking-wider mt-0.5">
                  HIGH FRAUD CONFIDENCE
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col items-center justify-center text-purple-700 font-mono font-black shadow-sm">
                <span className="text-xs">CRIT</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${animatedRisk}%` }}
              ></div>
            </div>

            <div className="text-[11px] font-mono text-slate-500 space-y-1 pt-1">
              <div className="flex justify-between">
                <span>Transfer Velocity (40%):</span>
                <strong className="text-blue-700">HIGH (0m - 8m)</strong>
              </div>
              <div className="flex justify-between">
                <span>Mule Layer Depth (30%):</span>
                <strong className="text-purple-700">3 Hops + Sub-Split</strong>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Explainable AI & Bank Lien Action */}
          <div className="bento-card-light p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between font-mono text-xs border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2 text-slate-950 font-black">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <span>EXPLAINABLE AI RECOMMENDATION</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans font-normal">
              Fund flow pattern confirms rapid multi-layer layering strategy. Immediate bank lien hold on <strong>{activeCase?.first_mule_account_id || 'AC-2290'}</strong> is recommended to freeze remaining <strong>₹82,000</strong>.
            </p>

            <button
              onClick={() => setIsLienIssued(true)}
              disabled={isLienIssued}
              className={`w-full py-3.5 rounded-2xl font-mono text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 ${
                isLienIssued
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25'
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
