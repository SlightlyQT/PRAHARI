import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Activity, MapPin, FastForward, Terminal, ArrowRight, ShieldAlert, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TRACE_DATA = {
  "NCRP-2026-00417": {
    id: "NCRP-2026-00417",
    name: "R. Sharma",
    type: "UPI Phishing",
    amount: "₹85,000",
    city: "Delhi",
    hops: 2,
    center: [28.6139, 77.2090],
    zoom: 11,
    trace: [
      { time: 500, log: "Complaint received — NCRP-2026-00417 · ₹85,000 · UPI Phishing Scam", action: "start" },
      { time: 1500, log: "Extracting first-hop account from complaint → AC-2290" },
      { time: 2500, log: "Cross-checking I4C Suspect Registry... AC-2290 matches known mule pattern" },
      { time: 3500, log: "● Node added: AC-2290 (Noida Mule-1)", action: "mule1" },
      { time: 4800, log: "Requesting transaction log for AC-2290..." },
      { time: 6000, log: "Outgoing transfer found: AC-2290 → AC-7715 · ₹82,000 · +8 min" },
      { time: 7000, log: "● Node added: AC-7715 (Old Delhi Mule-2)  → edge drawn", action: "mule2" },
      { time: 8200, log: "Extracting features: transfer_velocity=HIGH, atm_density=HIGH, tod=peak" },
      { time: 9500, log: "Running GNN hop-prediction on current chain (2 hops observed)..." },
      { time: 11000, log: "GNN: 72% structural match to historical cash-out chains → predicting terminal node" },
      { time: 12000, log: "● Node added: CASH-OUT (predicted, unconfirmed)", action: "cashout" },
      { time: 13500, log: "Running XGBoost geospatial ranking on candidate withdrawal zones..." },
      { time: 14800, log: "Top zone: Connaught Place, Delhi — density score high" },
      { time: 16000, log: "Fusion layer → final confidence: 83%, ETA: 40 min", action: "predict" },
      { time: 16800, log: "✅ Prediction ready", action: "done" }
    ],
    nodes: {
      start: { label: "Victim", sub: "R. Sharma (Delhi)", type: 'source', pos: [28.6139, 77.2090] },
      mule1: { label: "AC-2290", sub: "Mule-1 (Noida)", type: 'mule', heat: 40, pos: [28.5355, 77.3910] },
      mule2: { label: "AC-7715", sub: "Mule-2 (Old Delhi)", type: 'mule', heat: 75, pos: [28.6505, 77.2303] },
      cashout: { label: "CASH-OUT", sub: "Predicted Target (CP)", type: 'target', heat: 100, pos: [28.6315, 77.2167] }
    },
    prediction: { area: "Connaught Place, Delhi", conf: 83 }
  },
  "NCRP-2026-00418": {
    id: "NCRP-2026-00418",
    name: "P. Iyer",
    type: "Investment Scam",
    amount: "₹1,50,000",
    city: "Mumbai",
    hops: 1,
    center: [19.0176, 72.8562],
    zoom: 12,
    trace: [
      { time: 500, log: "Complaint received — NCRP-2026-00418 · ₹1,50,000 · Investment Scam", action: "start" },
      { time: 1500, log: "Extracting first-hop account → AC-9910" },
      { time: 2500, log: "● Node added: AC-9910 (Mule-1)", action: "mule1" },
      { time: 3800, log: "Feature check: transfer_velocity=VERY HIGH (funds moved in 6 min)" },
      { time: 5000, log: "GNN: single-hop pattern — 91% match to 'fast cash-out' fraud signature" },
      { time: 6200, log: "● Node added: CASH-OUT (predicted)", action: "cashout" },
      { time: 7500, log: "XGBoost: top zone → Andheri East, Mumbai" },
      { time: 8800, log: "Fusion → confidence: 91%, ETA: 18 min", action: "predict" },
      { time: 9500, log: "✅ Prediction ready", action: "done" }
    ],
    nodes: {
      start: { label: "Victim", sub: "P. Iyer (S. Mumbai)", type: 'source', pos: [18.9220, 72.8347] },
      mule1: { label: "AC-9910", sub: "Mule-1 (Dadar)", type: 'mule', heat: 85, pos: [19.0176, 72.8562] },
      cashout: { label: "CASH-OUT", sub: "Target (Andheri)", type: 'target', heat: 100, pos: [19.1136, 72.8697] }
    },
    prediction: { area: "Andheri East, Mumbai", conf: 91 }
  },
  "NCRP-2026-00419": {
    id: "NCRP-2026-00419",
    name: "K. Venkatesh",
    type: "Loan App Extortion",
    amount: "₹2,30,000",
    city: "Bengaluru",
    hops: 3,
    center: [12.9716, 77.5946],
    zoom: 11,
    trace: [
      { time: 500, log: "Complaint received — NCRP-2026-00419 · ₹2,30,000 · Instant Loan App Extortion", action: "start" },
      { time: 1500, log: "Extracting first-hop account → AC-4412" },
      { time: 2500, log: "● Node added: AC-4412 (Hebbal)", action: "mule1" },
      { time: 4000, log: "Outgoing transfer found: AC-4412 → AC-5581 · ₹2,15,000 · +11 min" },
      { time: 5200, log: "● Node added: AC-5581 (Koramangala) → edge drawn", action: "mule2" },
      { time: 6800, log: "Outgoing transfer found: AC-5581 → AC-6023 · ₹2,05,000 · +19 min" },
      { time: 8000, log: "● Node added: AC-6023 (HSR Layout) → edge drawn", action: "mule3" },
      { time: 9500, log: "Feature check: multi-hop layering pattern detected" },
      { time: 11000, log: "GNN: 3-hop chain — 88% match to organized mule-network signature" },
      { time: 12500, log: "● Node added: CASH-OUT (predicted)", action: "cashout" },
      { time: 14000, log: "XGBoost: top zone → Electronic City, Bengaluru" },
      { time: 15500, log: "Fusion → confidence: 88%, ETA: 55 min", action: "predict" },
      { time: 16500, log: "✅ Prediction ready", action: "done" }
    ],
    nodes: {
      start: { label: "Victim", sub: "K. Venkatesh", type: 'source', pos: [12.9716, 77.5946] },
      mule1: { label: "AC-4412", sub: "Hebbal", type: 'mule', heat: 30, pos: [13.0298, 77.5925] },
      mule2: { label: "AC-5581", sub: "Koramangala", type: 'mule', heat: 60, pos: [12.9352, 77.6245] },
      mule3: { label: "AC-6023", sub: "HSR Layout", type: 'mule', heat: 90, pos: [12.9141, 77.6308] },
      cashout: { label: "CASH-OUT", sub: "Electronic City", type: 'target', heat: 100, pos: [12.8452, 77.6602] }
    },
    prediction: { area: "Electronic City, Bengaluru", conf: 88 }
  }
};

const formatTime = (ms) => {
  const s = Math.floor(ms / 1000);
  const mss = ms % 1000;
  return `00:0${s}.${Math.floor(mss / 100)}`;
};

// Component to dynamically update map view based on selected case
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);

  // Fixes the "glitch" where map tiles don't load fully due to React flexbox layout resizing
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    const container = map.getContainer();
    observer.observe(container);
    
    return () => {
      observer.disconnect();
    };
  }, [map]);

  return null;
};

// Generates the EXACT HTML of the Swiggy-style Map Pin with a premium Cyber theme
const getCyberNodeIcon = (nodeData) => {
  const isTarget = nodeData.type === 'target';
  const isSource = nodeData.type === 'source';
  const heat = nodeData.heat || 0;
  
  let pinColor = 'text-slate-400';
  let radiusBg = 'bg-slate-500/20';
  let pulseBg = 'bg-slate-500/30';
  
  if (isSource) { 
    pinColor = 'text-blue-500'; radiusBg = 'bg-blue-500/20'; pulseBg = 'bg-blue-400/40'; 
  } else if (isTarget) { 
    pinColor = 'text-red-500'; radiusBg = 'bg-red-500/20'; pulseBg = 'bg-red-500/40'; 
  } else if (heat > 80) { 
    pinColor = 'text-orange-500'; radiusBg = 'bg-orange-500/20'; pulseBg = 'bg-orange-500/40'; 
  } else if (heat > 50) { 
    pinColor = 'text-yellow-500'; radiusBg = 'bg-yellow-500/20'; pulseBg = 'bg-yellow-500/40'; 
  }

  const html = `
    <div class="relative w-[80px] h-[80px] group">
      
      <!-- Translucent Area Radius (Centered exactly at 40,40) -->
      <div class="absolute top-[16px] left-[16px] w-[48px] h-[48px] ${radiusBg} rounded-full border border-white/5 backdrop-blur-[1px] shadow-inner transition-all duration-700"></div>
      ${isTarget ? `<div class="absolute top-[8px] left-[8px] w-[64px] h-[64px] ${pulseBg} rounded-full animate-ping opacity-75"></div>` : ''}

      <!-- The Map Pin (Bottom tip exactly at Y=40) -->
      <div class="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <svg viewBox="0 0 24 24" class="w-[32px] h-[32px] ${pinColor} transition-transform duration-300 group-hover:-translate-y-1" style="filter: drop-shadow(0px 6px 8px rgba(0,0,0,0.6));">
          <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
      
      <!-- Shadow Anchor Dot (Centered exactly at 40,40) -->
      <div class="absolute top-[38px] left-1/2 -translate-x-1/2 w-[12px] h-[4px] bg-black/80 rounded-[100%] blur-[1px]"></div>

      <!-- Floating Premium Tooltip -->
      <div class="absolute bottom-[76px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-50 transition-all duration-300 group-hover:bottom-[80px]">
        <div class="bg-[#0d1621] border border-slate-700/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-xl px-3 py-1.5 text-center whitespace-nowrap min-w-[120px]">
          <div class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">${nodeData.sub}</div>
          <div class="text-[11px] font-black text-white">${nodeData.label}</div>
          ${heat > 0 && !isTarget ? `<div class="text-[8px] font-bold ${pinColor} mt-1 tracking-wider bg-black/40 py-0.5 rounded border border-white/5">${heat}% RISK HEAT</div>` : ''}
          ${isTarget ? `<div class="text-[8px] font-bold text-red-500 mt-1 tracking-wider animate-pulse bg-red-950/30 py-0.5 rounded border border-red-900/50">PREDICTED TARGET</div>` : ''}
        </div>
        <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#0d1621]"></div>
      </div>

    </div>
  `;

  return L.divIcon({
    className: 'bg-transparent',
    html: html,
    iconSize: [80, 80],
    iconAnchor: [40, 40] // Center anchor so the pin sits exactly on the coordinate!
  });
};

export default function SystemArchitecture() {
  const [selectedCaseId, setSelectedCaseId] = useState("NCRP-2026-00417");
  const [isPlaying, setIsPlaying] = useState(false);
  const [traceLogs, setTraceLogs] = useState([]);
  const [activeNodes, setActiveNodes] = useState([]);
  const [activeEdges, setActiveEdges] = useState([]);
  const [showPrediction, setShowPrediction] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  const activeCase = TRACE_DATA[selectedCaseId];
  const [mapCenter, setMapCenter] = useState(activeCase.center);
  const [mapZoom, setMapZoom] = useState(activeCase.zoom);
  
  const timeoutsRef = useRef([]);
  const logEndRef = useRef(null);
  
  // Auto-scroll trace logs without scrolling the whole page window
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [traceLogs]);

  // Update map center automatically when case changes
  useEffect(() => {
    setMapCenter(activeCase.center);
    setMapZoom(activeCase.zoom);
  }, [selectedCaseId, activeCase.center, activeCase.zoom]);

  const clearPlayback = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setTraceLogs([]);
    setActiveNodes([]);
    setActiveEdges([]);
    setShowPrediction(false);
    setIsDone(false);
    setIsPlaying(false);
    setMapCenter(activeCase.center); // Reset camera on clear
    setMapZoom(activeCase.zoom);
  }, [activeCase.center, activeCase.zoom]);

  const handleSelectCase = (id) => {
    if (isPlaying) clearPlayback();
    setSelectedCaseId(id);
    clearPlayback();
  };

  const startPipeline = () => {
    clearPlayback();
    setIsPlaying(true);
    
    let currentNodes = [];
    let currentEdges = [];

    activeCase.trace.forEach((step) => {
      const t = setTimeout(() => {
        setTraceLogs(prev => [...prev, { time: formatTime(step.time), log: step.log }]);
        
        if (step.action) {
          if (step.action === 'predict') {
            setShowPrediction(true);
          } else if (step.action === 'done') {
            setIsDone(true);
            setIsPlaying(false);
          } else {
            const nodeData = activeCase.nodes[step.action];
            if (nodeData) {
              currentNodes = [...currentNodes, { id: step.action, ...nodeData }];
              
              // Cinematic auto-pan to the newly discovered location and zoom in tight
              setMapCenter(nodeData.pos);
              setMapZoom(16); // Tight tracking zoom
              
              if (currentNodes.length > 1) {
                const prevNode = currentNodes[currentNodes.length - 2];
                let stroke = '#3b82f6';
                if (nodeData.type === 'target') stroke = '#ef4444';
                else if (nodeData.heat > 80) stroke = '#f97316';
                else if (nodeData.heat > 50) stroke = '#eab308';
                
                currentEdges = [...currentEdges, {
                  positions: [prevNode.pos, nodeData.pos],
                  color: stroke
                }];
              }
              setActiveNodes([...currentNodes]);
              setActiveEdges([...currentEdges]);
            }
          }
        }
      }, step.time);
      timeoutsRef.current.push(t);
    });
  };

  const fastForward = () => {
    clearPlayback();
    
    let finalNodes = [];
    let finalEdges = [];
    
    ['start', 'mule1', 'mule2', 'mule3', 'cashout'].forEach(action => {
      const nodeData = activeCase.nodes[action];
      if (nodeData) {
        finalNodes.push({ id: action, ...nodeData });
        if (finalNodes.length > 1) {
          const prevNode = finalNodes[finalNodes.length - 2];
          let stroke = '#3b82f6';
          if (nodeData.type === 'target') stroke = '#ef4444';
          else if (nodeData.heat > 80) stroke = '#f97316';
          else if (nodeData.heat > 50) stroke = '#eab308';
          
          finalEdges.push({ positions: [prevNode.pos, nodeData.pos], color: stroke });
        }
      }
    });
    
    setActiveNodes(finalNodes);
    setActiveEdges(finalEdges);
    setShowPrediction(true);
    setIsDone(true);
    
    if (finalNodes.length > 0) {
      setMapCenter(finalNodes[finalNodes.length - 1].pos); // Pan to final target instantly
      setMapZoom(16); // Zoom in on target
    }
    
    const allLogs = activeCase.trace.map(step => ({ time: formatTime(step.time), log: step.log }));
    setTraceLogs(allLogs);
  };

  return (
    <div className="min-h-screen bg-[#05080d] text-slate-100 flex flex-col overflow-hidden">
      {/* Global CSS for the Map Tiles and Flowing Edges */}
      <style>{`
        /* Bulletproof dark map using native OSM tiles inverted */
        .tactical-map-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        
        /* Stop the white flash glitch */
        .leaflet-container {
          background-color: #090909 !important;
        }
        
        /* Animated Edge replacing the SVG Particle */
        .flowing-edge {
          stroke-dasharray: 8, 12;
          animation: flow 1s linear infinite;
        }
        
        @keyframes flow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-[#0a1119] border-b border-slate-800 p-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
            <ArrowRight size={16} className="rotate-180" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <section className="flex-1 py-6 px-4 md:px-8 flex flex-col min-h-0">
        <div className="max-w-[1600px] mx-auto w-full flex flex-col h-full gap-6">
          
          {/* Top Info Bar */}
          <div className="font-sans flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-md bg-rose-950/50 border border-rose-900/50 text-xs font-semibold text-rose-400 font-mono">
                <Navigation className="w-3.5 h-3.5" />
                <span>GEOSPATIAL TRACE LINK (REAL-WORLD MAP)</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                AI Geospatial <span className="text-rose-500">Node Mapper</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Real-world tracking representation on live geographic maps. The engine plots transaction nodes geographically to pinpoint physical cash-out extraction zones.
              </p>
            </div>
            
            <div className="flex items-center gap-3 self-start md:self-end shrink-0">
              <button 
                onClick={startPipeline}
                disabled={isPlaying}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-900/20 text-sm"
              >
                <Play size={16} fill="currentColor" />
                {isPlaying ? 'Tracing Routes...' : 'Commence Trace'}
              </button>
              <button
                onClick={fastForward}
                disabled={isDone}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111c28] border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg font-bold transition-all disabled:opacity-50 text-sm shadow-sm"
              >
                <FastForward size={16} />
                Insta-Resolve
              </button>
            </div>
          </div>

          {/* Main Grid Layout (Strict heights to prevent collapsing) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-[400px] pb-4">
            
            {/* Left Column: Complaint Selector */}
            <div className="md:col-span-3 flex flex-col gap-3 h-full bg-[#0a1119] rounded-xl border border-slate-800 p-3 overflow-y-auto">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono px-1 flex items-center gap-2">
                <Activity size={12} className="text-rose-500" />
                Live Incidents
              </h3>
              {Object.values(TRACE_DATA).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCase(c.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedCaseId === c.id 
                      ? 'bg-rose-950/20 border-rose-500/50 shadow-md shadow-rose-900/10' 
                      : 'bg-black border-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-[10px] font-mono font-bold text-slate-400">{c.id}</p>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black border ${c.hops === 1 ? 'border-yellow-900/50 text-yellow-500' : c.hops === 2 ? 'border-orange-900/50 text-orange-500' : 'border-rose-900/50 text-rose-500'}`}>
                      {c.hops} HOP{c.hops > 1 && 'S'}
                    </span>
                  </div>
                  <p className="font-bold text-slate-200 text-sm truncate">{c.type}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{c.amount} • {c.city}</p>
                </button>
              ))}
            </div>

            {/* Middle Column: REAL Leaflet Map */}
            <div className="md:col-span-6 bg-[#0a1119] border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col relative h-[500px] md:h-full z-0">
              
              <div className="p-3 border-b border-slate-800/80 bg-black/50 backdrop-blur-md z-[1000] flex justify-between items-center absolute top-0 left-0 right-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
                  <MapPin size={12} className="text-rose-500" />
                  Live Satellite Map Feed
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-[9px] font-mono text-slate-400 tracking-wider">
                    {isPlaying ? 'PLOTTING_COORDINATES' : isDone ? 'TRACE_COMPLETE' : 'STANDBY'}
                  </span>
                </div>
              </div>

              {/* The Map itself with absolute height to guarantee rendering */}
              <div className="w-full h-full absolute inset-0 pt-10 z-0">
                <MapContainer 
                  center={activeCase.center} 
                  zoom={activeCase.zoom} 
                  scrollWheelZoom={true}
                  className="w-full h-full bg-[#05080d]"
                  zoomControl={true}
                  style={{ width: '100%', height: '100%' }}
                >
                  {/* Using highly-reliable OSM tiles with a CSS invert to make them look like a tactical dark map */}
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                    className="tactical-map-tiles"
                  />
                  
                  <MapController center={mapCenter} zoom={activeCase.zoom} />

                  {/* Edges with CSS Animation to replace ReactFlow particle */}
                  {activeEdges.map((edge, idx) => (
                    <React.Fragment key={`edge-${idx}`}>
                      {/* Glow background line */}
                      <Polyline 
                        positions={edge.positions} 
                        pathOptions={{ 
                          color: edge.color, 
                          weight: 8,
                          opacity: 0.15,
                        }} 
                      />
                      {/* Animated dashed line */}
                      <Polyline 
                        positions={edge.positions} 
                        pathOptions={{ 
                          color: edge.color, 
                          weight: 3,
                          className: 'flowing-edge',
                          opacity: 0.9
                        }} 
                      />
                    </React.Fragment>
                  ))}

                  {/* Nodes injected as Raw HTML markers */}
                  {activeNodes.map((node) => (
                    <Marker 
                      key={node.id} 
                      position={node.pos} 
                      icon={getCyberNodeIcon(node)}
                    />
                  ))}
                </MapContainer>

                {/* Floating Prediction Overlay */}
                <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-1000 z-[1000] ${showPrediction ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                  <div className="bg-black/90 backdrop-blur-xl border border-red-900/50 rounded-xl p-3 shadow-[0_0_30px_rgba(225,29,72,0.3)] min-w-[260px] flex items-center gap-3">
                    <div className="bg-red-950/80 text-red-500 p-2 rounded border border-red-900/50 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-red-500 uppercase tracking-widest font-mono">Target Coordinates Acquired</div>
                      <p className="font-bold text-white text-sm leading-tight">{activeCase.prediction.area}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">AI Confidence: <span className="font-bold text-red-400">{activeCase.prediction.conf}%</span></p>
                    </div>
                  </div>
                </div>

                {/* Automated LEA Dispatch Alert - POLICE SIREN EFFECT */}
                <div className={`absolute top-20 right-4 transition-all duration-1000 delay-700 z-[1000] ${showPrediction ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                  <div className="bg-black/95 backdrop-blur-xl border-2 border-blue-900/60 rounded-xl p-3 shadow-[0_10px_40px_rgba(37,99,235,0.3)] flex items-center gap-4 relative overflow-hidden">
                    {/* Flashing Police Siren Background Effect */}
                    <div className="absolute inset-0 opacity-20 flex w-full">
                      <div className="w-1/2 h-full bg-blue-600 animate-[pulse_0.5s_ease-in-out_infinite]"></div>
                      <div className="w-1/2 h-full bg-red-600 animate-[pulse_0.5s_ease-in-out_infinite_0.25s]"></div>
                    </div>
                    
                    <div className="bg-blue-950/80 text-blue-500 p-2.5 rounded-lg border border-blue-900/50 shrink-0 relative z-10">
                      <ShieldAlert size={20} className="relative z-10" />
                      <div className="absolute inset-0 bg-blue-500/30 rounded-lg animate-ping"></div>
                    </div>
                    
                    <div className="relative z-10 pr-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">LEA Patrol Dispatched</div>
                      </div>
                      <p className="font-bold text-white text-[14px] leading-tight shadow-black drop-shadow-md">Police Unit Notified</p>
                      <p className="text-[11px] text-slate-300 mt-1 font-mono bg-black/60 px-2 py-0.5 rounded border border-white/10">Unit: <span className="text-emerald-400 font-bold">{activeCase.city} Cyber Cell</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Terminal Trace Log */}
            <div className="md:col-span-3 bg-black rounded-xl shadow-xl overflow-hidden flex flex-col h-full border border-slate-800">
              <div className="p-3 border-b border-slate-900 bg-[#05080d] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-slate-500" />
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider">server_log.txt</span>
                </div>
              </div>
              <div className="flex-1 p-3 overflow-y-auto font-mono text-[9px] sm:text-[11px] leading-relaxed space-y-2 text-slate-400 selection:bg-rose-900/30">
                {traceLogs.length === 0 && (
                  <div className="text-slate-700 italic">SYSTEM IDLE. AWAITING FEED...</div>
                )}
                {traceLogs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                    <span className={`${
                      log.log.includes('✅') ? 'text-emerald-400 font-bold' : 
                      log.log.includes('●') ? 'text-rose-400 font-semibold' : 
                      'text-slate-300'
                    }`}>
                      {log.log}
                    </span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
