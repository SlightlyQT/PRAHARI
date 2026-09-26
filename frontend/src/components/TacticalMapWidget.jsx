import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Radio, Layers, Zap } from 'lucide-react';

const createRadarMarker = (color, isPing = true) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        ${isPing ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${color}; opacity: 0.4; animation: ping 1.8s infinite cubic-bezier(0, 0, 0.2, 1);"></div>` : ''}
        <div style="width: 16px; height: 16px; border-radius: 50%; background: ${color}; border: 2px solid #ffffff; box-shadow: 0 0 15px ${color};"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const victimIcon = createRadarMarker('#3b82f6', false);
const cashoutIcon = createRadarMarker('#ef4444', true);
const atmIcon = createRadarMarker('#10b981', false);

export default function TacticalMapWidget({ predictionData, activeCase, onTriggerHold }) {
  const centerLat = activeCase?.predicted_zone?.lat || 28.6139;
  const centerLng = activeCase?.predicted_zone?.lng || 77.2090;

  const geoPath = predictionData?.geospatial_path || [
    { lat: 28.6280, lng: 77.2189, name: 'Victim Origin (Janpath)' },
    { lat: 28.6325, lng: 77.2200, name: 'Mule-1 (Barakhamba Rd)' },
    { lat: 28.6139, lng: 77.2090, name: 'Predicted Cashout (Connaught Place)' }
  ];

  const polylinePositions = geoPath.map(pt => [pt.lat, pt.lng]);
  const nearbyATMs = activeCase?.predicted_zone?.nearby_atms || [
    { name: "SBI ATM - Block C, CP", lat: 28.6145, lng: 77.2082, risk: "High" },
    { name: "HDFC ATM - Regal Building", lat: 28.6130, lng: 77.2101, risk: "Critical" },
    { name: "ICICI ATM - Palika Bazaar", lat: 28.6128, lng: 77.2078, risk: "High" }
  ];

  // 4 Hotspot clusters with animate-ping radar simulation
  const radarHotspots = [
    { name: activeCase?.predicted_area || "Connaught Place Hub", lat: centerLat, lng: centerLng, risk: "CRITICAL" },
    { name: "Barakhamba Commercial Zone", lat: centerLat + 0.012, lng: centerLng + 0.008, risk: "HIGH" },
    { name: "Janpath Corridor", lat: centerLat - 0.009, lng: centerLng - 0.006, risk: "HIGH" },
    { name: "Rajiv Chowk Metro Exit", lat: centerLat + 0.004, lng: centerLng - 0.005, risk: "CRITICAL" }
  ];

  return (
    <div className="w-full h-full flex flex-col glass-bento relative overflow-hidden">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-ef4444 text-red-500 animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider">TACTICAL GIS RADAR • DARK NODE</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-slate-400">
          <span>LAT: <strong className="text-white">{centerLat.toFixed(4)}</strong></span>
          <span>LNG: <strong className="text-white">{centerLng.toFixed(4)}</strong></span>
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
            4 HOTSPOTS PINGING
          </span>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="relative flex-1 w-full h-full">
        <MapContainer
          key={`${centerLat}-${centerLng}`}
          center={[centerLat, centerLng]}
          zoom={14}
          zoomControl={true}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', background: '#020617' }}
        >
          <TileLayer
            attribution='&copy; Esri World Dark Canvas'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Base/MapServer/tile/{z}/{y}/{x}"
          />

          {/* Glowing Red Risk Zone Circles */}
          <Circle
            center={[centerLat, centerLng]}
            radius={750}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '6, 6'
            }}
          />

          {/* Path Polyline */}
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: '#3b82f6',
              weight: 3,
              dashArray: '8, 8'
            }}
          />

          {/* 4 Radar Hotspot Ping Markers */}
          {radarHotspots.map((hs, idx) => (
            <Marker key={idx} position={[hs.lat, hs.lng]} icon={cashoutIcon}>
              <Popup>
                <div className="font-mono text-xs space-y-1">
                  <strong className="text-red-500 uppercase">{hs.risk} RADAR HOTSPOT</strong>
                  <div>{hs.name}</div>
                  <div className="text-slate-400 text-[10px]">Ping Velocity: 0.4s lag</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Victim Marker */}
          <Marker position={[geoPath[0].lat, geoPath[0].lng]} icon={victimIcon}>
            <Popup>
              <div className="font-mono text-xs">
                <strong className="text-blue-400">VICTIM ORIGIN</strong>
                <div>{geoPath[0].name}</div>
              </div>
            </Popup>
          </Marker>

          {/* Nearby ATMs */}
          {nearbyATMs.map((atm, i) => (
            <Marker key={i} position={[atm.lat, atm.lng]} icon={atmIcon}>
              <Popup>
                <div className="font-mono text-xs">
                  <strong className="text-emerald-400">{atm.name}</strong>
                  <div>Risk: <span className="text-red-400 font-bold">{atm.risk}</span></div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Quick Action Box */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 text-xs font-mono space-y-2 shadow-2xl max-w-[260px]">
          <div className="text-slate-400 flex items-center justify-between">
            <span>GOLDEN WINDOW:</span>
            <span className="text-amber-400 font-bold">24:00m</span>
          </div>
          <div className="text-slate-200 font-semibold truncate">
            {activeCase?.predicted_area || 'Connaught Place'}
          </div>
          <button
            onClick={onTriggerHold}
            className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>TRIGGER BANK HOLD</span>
          </button>
        </div>
      </div>

    </div>
  );
}
