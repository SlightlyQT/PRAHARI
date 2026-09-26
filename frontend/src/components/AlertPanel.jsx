import React, { useState, useEffect } from 'react';

export default function AlertPanel({ alertResult, onReset, activeCase }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(194);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      {/* Centered Quiet Transmission Text */}
      <div className="relative z-20 text-center space-y-4 max-w-lg px-8">
        <span className="esri-label text-red-500 tracking-[0.25em]">
          ALERT DISPATCHED
        </span>

        <h2 className="text-3xl md:text-4xl font-light text-slate-100 tracking-tight">
          {activeCase?.victim_city || 'City'} Cyber Cell • Banking Fraud Desk
        </h2>

        <div className="pt-2">
          <p className="esri-label text-slate-400 font-mono tracking-widest">
            RESPONSE INITIATED — {formatTimer(elapsedSeconds)} ELAPSED
          </p>
        </div>

        <div className="pt-8">
          <button
            onClick={onReset}
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer border-b border-slate-700 hover:border-white pb-1"
          >
            ← TRACE ANOTHER DOSSIER
          </button>
        </div>
      </div>
    </div>
  );
}
