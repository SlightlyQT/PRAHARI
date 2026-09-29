import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Compass, Navigation, Eye, Radio, Layers, Zap, Clock, ShieldAlert,
  MapPin, Lock, RotateCcw, AlertTriangle, ArrowRight, Activity, Cpu, ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Multi-hop Trace Datasets mapped to real GPS coordinates across India
const TRACE_CASES = {
  'LOCAL_ATM': {
    id: 'LOCAL_ATM',
    title: 'Connaught Place ATM Cashout Threat Zone',
    center: [77.2167, 28.6315], // Real Connaught Place Center [Lng, Lat]
    zoom: 15.8,
    pitch: 62,
    bearing: -20,
    nodes: [
      {
        id: 'node-v',
        code: '👤',
        label: 'Victim (Janpath SBI)',
        bank: 'State Bank of India',
        city: 'Delhi (Janpath)',
        lng: 77.2189,
        lat: 28.6280,
        amount: '₹85,000',
        status: 'DISBURSED',
        color: '#22D3EE'
      },
      {
        id: 'node-m1',
        code: '🏦',
        label: 'Mule 1 (Barakhamba ICICI)',
        bank: 'ICICI Bank',
        city: 'Delhi (Barakhamba Road)',
        lng: 77.2215,
        lat: 28.6315,
        amount: '₹82,000',
        status: 'HOLD APPLIED',
        color: '#06B6D4'
      },
      {
        id: 'node-m2',
        code: '☕',
        label: 'Mule 2 (CP Circle HDFC)',
        bank: 'HDFC Bank',
        city: 'Delhi (Connaught Place Radial)',
        lng: 77.2177,
        lat: 28.6328,
        amount: '₹80,000',
        status: 'MONITORED',
        color: '#D97706'
      },
      {
        id: 'node-target',
        code: '🏧',
        label: 'TARGET ATM (Regal Hub)',
        bank: 'Automated Gateway ATM',
        city: 'CP Outer Circle (Regal Building)',
        lng: 77.2148,
        lat: 28.6312,
        amount: '₹80,000 CASHOUT',
        status: 'IMMINENT THREAT',
        color: '#E11D48',
        isTarget: true
      },
      {
        id: 'node-squad',
        code: '🚚',
        label: 'Patrol Squad 4 (CP)',
        bank: 'Delhi Cyber Patrol Squad',
        city: 'Janpath / Tolstoy Marg',
        lng: 77.2135,
        lat: 28.6285,
        amount: 'PROXIMITY: 0.4km',
        status: 'EN ROUTE',
        color: '#10B981',
        isSquad: true
      }
    ]
  },
  'PAN_INDIA': {
    id: 'PAN_INDIA',
    title: 'Pan-India Multi-State Cyber Fund Trace',
    center: [78.9629, 22.5937], // Center of India
    zoom: 5.2,
    pitch: 58,
    bearing: -15,
    nodes: [
      {
        id: 'node-v-india',
        code: '👤',
        label: 'Victim Origin (SBI Janpath)',
        bank: 'State Bank of India',
        city: 'New Delhi',
        lng: 77.2189,
        lat: 28.6280,
        amount: '₹5,40,000',
        status: 'DISBURSED',
        color: '#22D3EE'
      },
      {
        id: 'node-jmt-india',
        code: '⚠️',
        label: 'Tier-1 Mule (Axis Jamtara)',
        bank: 'Axis Bank Cyber Hub',
        city: 'Jamtara (Jharkhand)',
        lng: 86.8020,
        lat: 23.9627,
        amount: '₹3,80,000',
        status: 'HOLD APPLIED',
        color: '#F59E0B'
      },
      {
        id: 'node-kol-india',
        code: '🏦',
        label: 'Tier-2 Mule (HDFC Saltlake)',
        bank: 'HDFC Bank',
        city: 'Kolkata (West Bengal)',
        lng: 88.3639,
        lat: 22.5726,
        amount: '₹2,10,000',
        status: 'MONITORED',
        color: '#F97316'
      },
      {
        id: 'node-blr-india',
        code: '🎯',
        label: 'Target Withdrawal ATM',
        bank: 'ICICI Automated Hub',
        city: 'Bengaluru (Karnataka)',
        lng: 77.5946,
        lat: 12.9716,
        amount: '₹1,60,000',
        status: 'IMMINENT CASHOUT',
        color: '#F43F5E',
        isTarget: true
      }
    ]
  }
};

// Generate curved Bezier coordinates for high elevated 3D arcs (matching reference image)
function generateCurvedArc(startLngLat, endLngLat, pointsCount = 50) {
  const [startLng, startLat] = startLngLat;
  const [endLng, endLat] = endLngLat;

  const midLng = (startLng + endLng) / 2;
  const midLat = (startLat + endLat) / 2;
  
  const dx = endLng - startLng;
  const dy = endLat - startLat;

  // Offset control point for high parabolic 3D arc effect
  const curvature = 0.35;
  const controlLng = midLng - dy * curvature;
  const controlLat = midLat + dx * curvature;

  const points = [];
  for (let i = 0; i <= pointsCount; i++) {
    const t = i / pointsCount;
    const lng = (1 - t) * (1 - t) * startLng + 2 * (1 - t) * t * controlLng + t * t * endLng;
    const lat = (1 - t) * (1 - t) * startLat + 2 * (1 - t) * t * controlLat + t * t * endLat;
    points.push([lng, lat]);
  }
  return points;
}

export default function TacticalRadarMap({ predictionData, activeCase, onDispatchAlert }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const [scopeMode, setScopeMode] = useState('LOCAL_ATM'); // 'LOCAL_ATM' | 'PAN_INDIA'
  const [mapStyle, setMapStyle] = useState('cyber_dark'); // 'vector_light' | 'cyber_dark' | 'satellite'
  const [is3D, setIs3D] = useState(true);
  const [activeNodeDossier, setActiveNodeDossier] = useState(null);
  const [frozenAccounts, setFrozenAccounts] = useState({});
  const DEFAULT_MAPBOX_TOKEN = '';
  const [mapboxToken, setMapboxToken] = useState(import.meta.env?.VITE_MAPBOX_TOKEN || DEFAULT_MAPBOX_TOKEN);
  const [mapplsKey, setMapplsKey] = useState(import.meta.env?.VITE_MAPPLS_STATIC_KEY || '');


  const currentCase = useMemo(() => {
    if (activeCase && activeCase.chain && activeCase.chain.length > 0) {
      const isPanIndia = scopeMode === 'PAN_INDIA';
      const nodes = [];
      const chain = activeCase.chain;
      
      const defaultColors = ['#22D3EE', '#F59E0B', '#F59E0B', '#F43F5E'];
      const defaultCodes = ['👤', '⚠️', '🏦', '🎯'];
      const defaultLabels = ['Victim Origin', 'Tier-1 Mule', 'Tier-2 Mule', 'Target ATM'];
      
      chain.forEach((c, idx) => {
        const isTarget = idx === chain.length - 1;
        const acctStr = typeof c.account === 'string' ? c.account.split(' ')[0] : 'Unknown';
        const locName = c.loc?.name || 'Unknown Hub';
        const cLng = c.loc?.lng || 77.2;
        const cLat = c.loc?.lat || 28.6;
        const amountStr = c.amount ? c.amount.toLocaleString('en-IN') : '0';

        nodes.push({
          id: `node-${idx}-${activeCase.complaint_id || 'unknown'}`,
          code: defaultCodes[idx] || '⚠️',
          label: `${defaultLabels[idx] || 'Mule'} (${acctStr})`,
          bank: locName,
          city: activeCase.victim_city || 'Unknown City',
          lng: cLng,
          lat: cLat,
          amount: `₹${amountStr}`,
          status: isTarget ? 'CASH-OUT IMMINENT' : (idx === 0 ? 'DISBURSED' : 'HOLD APPLIED'),
          color: defaultColors[idx] || '#F59E0B',
          isTarget: isTarget
        });
      });
      
      const targetNode = nodes[nodes.length - 1];
      const victimNode = nodes[0];
      
      // Calculate dynamic center
      const centerLng = isPanIndia ? (victimNode.lng + targetNode.lng) / 2 : targetNode.lng;
      const centerLat = isPanIndia ? (victimNode.lat + targetNode.lat) / 2 : targetNode.lat;
      
      // Dynamic zoom logic: if nodes are very close (same city), zoom in a bit more even for PAN_INDIA
      const latDiff = Math.abs(victimNode.lat - targetNode.lat);
      const panIndiaZoom = latDiff < 1.0 ? 9.5 : 5.2;

      return {
        id: activeCase.complaint_id || 'dynamic_case',
        title: isPanIndia ? `Fund Trace: ${activeCase.complaint_id || 'Active Case'}` : `Local Action Radius`,
        center: [centerLng || 77.2, centerLat || 28.6],
        zoom: isPanIndia ? panIndiaZoom : 13.5,
        pitch: isPanIndia ? 58 : 65,
        bearing: isPanIndia ? -15 : -30,
        nodes: nodes
      };
    }
    return TRACE_CASES[scopeMode];
  }, [activeCase, scopeMode]);
  // Tile sources mapping (Bulletproof public ESRI/Carto endpoints with 0 CORS blocking)
  const tileUrls = {
    vector_light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    cyber_dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  // Toggle Freeze state for an account node
  const handleToggleFreeze = (nodeId) => {
    setFrozenAccounts(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Initialize MapLibre GL 3D Isometric Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let mapStyleObj;
    let attributionText = '© OpenStreetMap / CARTO / ESRI | PRAHARI Engine';
    const activeToken = mapboxToken || DEFAULT_MAPBOX_TOKEN;

    if (activeToken && activeToken.startsWith('pk.')) {
      // Mapbox HD 512px Tile Endpoint (100% reliable across WebGL map renderers)
      const styleId = mapStyle === 'vector_light' ? 'light-v11' : mapStyle === 'satellite' ? 'satellite-v9' : 'dark-v11';
      const mapboxTileUrl = `https://api.mapbox.com/styles/v1/mapbox/${styleId}/tiles/512/{z}/{x}/{y}@2x?access_token=${activeToken}`;
      attributionText = '© Mapbox | PRAHARI Engine';
      mapStyleObj = {
        version: 8,
        sources: {
          'mapbox-tiles': {
            type: 'raster',
            tiles: [mapboxTileUrl],
            tileSize: 512,
            attribution: attributionText
          }
        },
        layers: [
          {
            id: 'mapbox-basemap',
            type: 'raster',
            source: 'mapbox-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      };
    } else if (mapplsKey && mapplsKey.length > 5) {
      // MapmyIndia / Mappls Vector Tiles Endpoint
      attributionText = '© MapmyIndia Mappls | PRAHARI Engine';
      mapStyleObj = {
        version: 8,
        sources: {
          'mappls-tiles': {
            type: 'raster',
            tiles: [tileUrls[mapStyle]],
            tileSize: 256,
            maxzoom: mapStyle === 'satellite' ? 19 : 16, // ESRI Canvas tiles stop at z16; MapLibre overzooms beyond that
            attribution: attributionText
          }
        },
        layers: [
          {
            id: 'mappls-basemap',
            type: 'raster',
            source: 'mappls-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      };
    } else {
      // Free High-Definition Vector Raster Basemap
      mapStyleObj = {
        version: 8,
        sources: {
          'basemap-tiles': {
            type: 'raster',
            tiles: [tileUrls[mapStyle]],
            tileSize: 256,
            maxzoom: mapStyle === 'satellite' ? 19 : 16, // ESRI Canvas tiles stop at z16; MapLibre overzooms beyond that
            attribution: attributionText
          }
        },
        layers: [
          {
            id: 'basemap-layer',
            type: 'raster',
            source: 'basemap-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      };
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyleObj,
      center: currentCase.center,
      zoom: currentCase.zoom,
      pitch: is3D ? currentCase.pitch : 0,
      bearing: is3D ? currentCase.bearing : 0,
      antialias: true,
      cooperativeGestures: true
    });

    mapRef.current = map;

    // Render 3D Isometric Features
    map.on('load', () => {
      // 3D Extruded Building Layer (Mapbox Vector Source)
      try {
        if (map.getSource('composite') && !map.getLayer('3d-buildings')) {
          map.addLayer({
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 13,
            paint: {
              'fill-extrusion-color': mapStyle === 'vector_light' ? '#CBD5E1' : '#1E293B',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.65
            }
          });
        }
      } catch (err) {
        console.log('3D Buildings layer optional:', err);
      }

      // 1. Render Ground Route Line (Green Road Polyline matching reference image)
      const traceNodes = currentCase.nodes.filter(n => !n.isSquad);
      const groundCoordinates = traceNodes.map(n => [n.lng, n.lat]);

      map.addSource('ground-route-src', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: groundCoordinates
          }
        }
      });

      // Green Road Trajectory Path
      map.addLayer({
        id: 'ground-route-layer',
        type: 'line',
        source: 'ground-route-src',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#34D399', // Vibrant Green (matching reference image)
          'line-width': 5,
          'line-opacity': 0.85
        }
      });

      // 2. Render High Elevated 3D Curved Arcs (Blue/Cyan Arcs matching reference image)
      for (let i = 0; i < traceNodes.length - 1; i++) {
        const start = [traceNodes[i].lng, traceNodes[i].lat];
        const end = [traceNodes[i + 1].lng, traceNodes[i + 1].lat];
        const arcCoordinates = generateCurvedArc(start, end);

        const sourceId = `arc-src-${i}`;
        const layerId = `arc-layer-${i}`;

        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: arcCoordinates
            }
          }
        });

        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#22D3EE', // Curved Arc Blue (matching reference image)
            'line-width': 4,
            'line-dasharray': [3, 1.5]
          }
        });
      }

      // 3. Add 3D Teardrop Pins matching Reference Image (Teardrop pin + inner icon)
      currentCase.nodes.forEach((node) => {
        const isFrozen = frozenAccounts[node.id];
        const nodeColor = isFrozen ? '#10B981' : node.color;

        const el = document.createElement('div');
        el.className = 'isometric-3d-teardrop-marker';
        el.style.cssText = `
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.3));
          transition: transform 0.2s ease;
        `;

        el.innerHTML = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${node.isTarget ? '42px' : '36px'};
            height: ${node.isTarget ? '42px' : '36px'};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: ${nodeColor};
            border: 2px solid #05080D;
            box-shadow: 0 0 18px ${nodeColor};
          ">
            <div style="
              transform: rotate(45deg);
              color: #FFFFFF;
              font-size: ${node.isTarget ? '16px' : '14px'};
              font-weight: 900;
            ">
              ${node.code}
            </div>
          </div>
          <div style="
            margin-top: 4px;
            background: rgba(5, 8, 13, 0.92);
            color: #E2E8F0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 12px;
            border: 1px solid ${nodeColor};
            white-space: nowrap;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            pointer-events: none;
          ">
            ${isFrozen ? '🔒 FROZEN' : node.label}
          </div>
        `;

        el.addEventListener('click', () => {
          setActiveNodeDossier(node);
        });

        new maplibregl.Marker({ element: el })
          .setLngLat([node.lng, node.lat])
          .addTo(map);
      });
    });

    return () => {
      map.remove();
    };
  }, [scopeMode, mapStyle, is3D, frozenAccounts, mapboxToken]);

  // Camera Adjustment Controls
  const handleToggle3D = () => {
    const next3D = !is3D;
    setIs3D(next3D);
    if (mapRef.current) {
      mapRef.current.easeTo({
        pitch: next3D ? currentCase.pitch : 0,
        bearing: next3D ? currentCase.bearing : 0,
        duration: 1000
      });
    }
  };

  const handleResetCamera = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: currentCase.center,
        zoom: currentCase.zoom,
        pitch: is3D ? currentCase.pitch : 0,
        bearing: is3D ? currentCase.bearing : 0,
        duration: 1200
      });
    }
  };

  return (
    <section id="spatial-map" className="py-32 sm:py-40 relative overflow-hidden bg-[#05080d] text-slate-100 selection:bg-cyan-400">
      <div id="india-3d-trace"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 35 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10"
      >
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-6 border-b border-cyan-500/11">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/8 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 mb-3 shadow-sm uppercase">
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              3D ISOMETRIC VECTOR TRACE MAP
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight font-sans">
              Geospatial 3D Radar <span className="text-emerald-400">& Route Engine</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl font-sans">
              Isometric 3D vector map matching reference design. Combines street-level ground route polylines, 3D curved parabolic arcs, and 3D teardrop markers across India.
            </p>
          </div>

          {/* Scope Mode Switcher & Controls (30% Blue Structure) */}
          <div className="mt-6 lg:mt-0 flex flex-wrap items-center gap-3 font-mono text-xs">
            
            {/* Scope Mode (Pan-India vs Local ATM) */}
            <div className="p-1 rounded-2xl bg-[#0a1119] border border-cyan-500/30 shadow-sm flex items-center gap-1">
              <button
                onClick={() => setScopeMode('LOCAL_ATM')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  scopeMode === 'LOCAL_ATM'
                    ? 'bg-cyan-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-50'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>LOCAL ATM ZONE (CP)</span>
              </button>

              <button
                onClick={() => setScopeMode('PAN_INDIA')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  scopeMode === 'PAN_INDIA'
                    ? 'bg-cyan-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>PAN-INDIA TRACE</span>
              </button>
            </div>

            {/* 3D Tilt Toggle */}
            <button
              onClick={handleToggle3D}
              className={`px-3.5 py-2 rounded-2xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                is3D
                  ? 'bg-emerald-500/8 border-emerald-400/50 text-emerald-400 shadow-sm'
                  : 'bg-[#0a1119] border-cyan-500/30 text-slate-400 hover:text-slate-50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{is3D ? '3D ISOMETRIC 62° ON' : '2D FLAT VIEW'}</span>
            </button>

            {/* Reset Camera */}
            <button
              onClick={handleResetCamera}
              className="p-2.5 rounded-2xl bg-[#0a1119] border border-cyan-500/30 text-slate-400 hover:text-slate-50 transition-colors cursor-pointer shadow-sm"
              title="Reset 3D Camera"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Main Map & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main 3D WebGL Map Container (60% Dominant White Surface) */}
          <div className="lg:col-span-8 rounded-3xl border border-cyan-500/24 bg-[#0a1119] overflow-hidden shadow-2xl relative min-h-[400px] lg:min-h-[600px] group">
            
            {/* Top Left Live HUD Badge */}
            <div className="absolute top-4 left-4 z-20 bg-[#0a1119]/95 text-slate-100 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-cyan-500/30 font-mono text-xs flex items-center gap-3 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>ISOMETRIC 3D TARGET: <strong className="text-emerald-400 font-bold">{currentCase.title}</strong></span>
            </div>

            {/* Top Right Map Style Buttons */}
            <div className="absolute top-4 right-4 z-20 bg-[#0a1119]/95 text-slate-100 backdrop-blur-xl p-1 rounded-2xl border border-cyan-500/30 font-mono text-xs flex items-center gap-1 shadow-lg">
              <button
                onClick={() => setMapStyle('vector_light')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  mapStyle === 'vector_light' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-slate-50'
                }`}
              >
                LIGHT VECTOR
              </button>
              <button
                onClick={() => setMapStyle('cyber_dark')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  mapStyle === 'cyber_dark' ? 'bg-slate-950 text-white' : 'text-slate-400 hover:text-slate-50'
                }`}
              >
                CYBER DARK
              </button>
              <button
                onClick={() => setMapStyle('satellite')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  mapStyle === 'satellite' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-slate-50'
                }`}
              >
                SATELLITE
              </button>
            </div>

            {/* MapLibre GL 3D Map Container */}
            <div ref={mapContainerRef} className="w-full h-[400px] sm:h-[500px] lg:h-[600px] cursor-grab active:cursor-grabbing" />

            {/* 3D Dossier Floating Popup Card */}
            <AnimatePresence>
              {activeNodeDossier && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-80 z-30 bg-[#0a1119]/95 border border-cyan-500/30 p-4 rounded-3xl shadow-2xl backdrop-blur-2xl space-y-3 font-mono text-xs"
                >
                  <div className="flex items-center justify-between border-b border-cyan-500/12 pb-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">3D NODE DOSSIER</span>
                    <button
                      onClick={() => setActiveNodeDossier(null)}
                      className="text-slate-500 hover:text-slate-50 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div>
                    <strong className="text-slate-50 font-sans text-sm block">{activeNodeDossier.label}</strong>
                    <span className="text-cyan-400 text-[11px] font-bold">{activeNodeDossier.bank}</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Location:</span>
                      <span className="text-slate-50 font-bold">{activeNodeDossier.city}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Fund Volume:</span>
                      <span className="text-emerald-400 font-extrabold">{activeNodeDossier.amount}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Status:</span>
                      <span className="text-emerald-400 font-bold">{activeNodeDossier.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleFreeze(activeNodeDossier.id)}
                    className={`w-full py-2.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                      frozenAccounts[activeNodeDossier.id]
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/25'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{frozenAccounts[activeNodeDossier.id] ? 'ACCOUNT FROZEN' : 'FREEZE ACCOUNT'}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Left Hint */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block">
              <span className="px-3 py-1.5 rounded-xl bg-[#0a1119]/90 border border-cyan-500/30 text-[11px] font-mono text-slate-400 shadow-md">
                💡 Drag to Pan • Two Fingers to Pan on Mobile • Right Click / Ctrl+Drag to Rotate 3D Camera • Click Node for Dossier
              </span>
            </div>
          </div>

          {/* Right Action Sidebar (30% Blue Structure + 10% Purple CTA) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Golden Window Countdown Card (Pulsing Purple Glow) */}
            <div className="p-6 rounded-3xl bg-[#0a1119] border border-cyan-500/30 shadow-xl space-y-5 purple-pulse-glow">
              <div className="flex items-center justify-between font-mono text-xs text-emerald-400 font-bold">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                  GOLDEN WINDOW COUNTDOWN
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                  INTERCEPT CRITICAL
                </span>
              </div>

              {/* Digital Screen */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center shadow-inner space-y-1">
                <div className="text-5xl font-black font-mono text-emerald-400 tracking-tight">
                  24:00
                </div>
                <div className="text-[11px] text-slate-500 font-mono font-medium">
                  MINUTES TO PHYSICAL CASHOUT LIQUIDATION
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0d1621] border border-cyan-500/15 text-xs space-y-2.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>TARGET ATM HUB:</span>
                  <strong className="text-slate-50 truncate max-w-[150px]">{currentCase.nodes.find(n => n.isTarget)?.label || 'Regal ATM'}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>NEAREST PATROL:</span>
                  <strong className="text-emerald-400">Cyber Squad 4 (1.2 km)</strong>
                </div>
              </div>

              <button
                onClick={onDispatchAlert}
                className="w-full py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black font-mono text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>DISPATCH CYBER CELL & BANK LIEN</span>
              </button>
            </div>

            {/* Account Hops List */}
            <div className="p-6 rounded-3xl bg-[#0a1119] border border-cyan-500/30 shadow-md space-y-4 font-mono text-xs">
              <div className="font-extrabold text-slate-50 flex items-center justify-between border-b border-cyan-500/12 pb-3">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  3D TRACE HOPS OVERLAY
                </span>
                <span className="text-emerald-400 text-[10px] font-bold">LIVE HOPS</span>
              </div>

              <div className="space-y-3">
                {currentCase.nodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setActiveNodeDossier(node)}
                    className="p-3.5 rounded-2xl bg-[#0d1621] border border-cyan-500/15 hover:border-emerald-400 transition-all cursor-pointer flex items-center justify-between gap-3 w-full min-w-0 overflow-hidden"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-50 flex items-center gap-2 truncate">
                        <span className="text-sm shrink-0">{node.code}</span>
                        <span className="truncate">{node.label}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{node.city}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-emerald-400 font-bold whitespace-nowrap">{node.amount}</div>
                      <div className="text-[9px] text-slate-400 whitespace-nowrap">{frozenAccounts[node.id] ? 'FROZEN' : node.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </motion.div>

    </section>
  );
}
