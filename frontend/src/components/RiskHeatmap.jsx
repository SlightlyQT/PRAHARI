import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

function MapAutoCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

const createCustomIcon = (type) => {
  const isCashout = type === 'predicted_cashout';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        ${isCashout ? '<div class="breath-ring-element" style="left: -53px; top: -53px;"></div>' : ''}
        <div style="width: 14px; height: 14px; border-radius: 50%; background: ${isCashout ? '#EF4444' : '#94A3B8'}; border: 2px solid #0A0C10;"></div>
      </div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

export default function RiskHeatmap({ predictionData, onDispatchAlert, activeComplaintId }) {
  const [countScore, setCountScore] = useState(0);

  const { predicted_zone, risk_evaluation } = predictionData || {
    predicted_zone: { lat: 28.6139, lng: 77.2090, area: "Connaught Place, Delhi" },
    risk_evaluation: { risk_score: 0.83 }
  };

  const targetScore = Math.round((risk_evaluation?.risk_score || 0.83) * 100);
  const centerCoords = [predicted_zone.lat, predicted_zone.lng];

  useEffect(() => {
    setCountScore(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= targetScore) {
        setCountScore(targetScore);
        clearInterval(interval);
      } else {
        setCountScore(current);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [targetScore]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Esri World Imagery Satellite Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={centerCoords}
          zoom={14}
          zoomControl={false}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#0A0C10' }}
        >
          <MapAutoCenter center={centerCoords} />

          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}/{x}"
          />

          <Circle
            center={centerCoords}
            radius={800}
            pathOptions={{
              color: '#EF4444',
              fillColor: '#EF4444',
              fillOpacity: 0.15,
              weight: 1
            }}
          />

          <Marker position={centerCoords} icon={createCustomIcon('predicted_cashout')} />
        </MapContainer>

        {/* Scrim Overlay */}
        <div className="absolute inset-0 top-scrim"></div>
        <div className="absolute inset-0 bottom-scrim"></div>
        <div className="absolute inset-0 vignette-scrim"></div>
      </div>

      {/* Floating Esri Callout (83% Hero Moment) */}
      <div className="absolute top-36 left-12 md:left-24 z-20 pointer-events-none max-w-md space-y-2">
        <svg width="180" height="40" className="overflow-visible">
          <path
            d="M 0 40 L 40 0 L 180 0"
            fill="none"
            stroke="#EF4444"
            strokeWidth="1.5"
            className="animated-connector-line"
          />
        </svg>

        <span className="esri-label text-slate-400 block tracking-[0.25em]">
          PREDICTED CASH-OUT ZONE
        </span>

        {/* Hero Number - Ultra Light 200 Weight */}
        <div className="hero-number-esri text-8xl md:text-[110px]">
          {countScore}%
        </div>

        <p className="esri-label text-slate-200">
          CONFIDENCE • {predicted_zone.area.toUpperCase()}
        </p>
      </div>

      {/* Action Button */}
      <div className="absolute bottom-12 right-12 z-20 pointer-events-auto">
        <button
          onClick={onDispatchAlert}
          className="text-xs font-mono tracking-widest text-white hover:text-red-400 transition-colors uppercase flex items-center gap-2 cursor-pointer bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10"
        >
          <span>ISSUE INTERCEPT ORDER</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
