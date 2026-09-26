import React from 'react';
import { Folder, GitBranch, MapPin, AlertCircle } from 'lucide-react';

export default function ComplaintIntake({
  selectedStep,
  setStep,
  selectedComplaintId,
  onSelectComplaint
}) {
  const bottomNavItems = [
    {
      step: 1,
      icon: Folder,
      title: "HURRICANE INTEL / INTAKE",
      desc: "Select active NCRP complaint dossier to begin live tracing across bank nodes."
    },
    {
      step: 2,
      icon: GitBranch,
      title: "MULE NETWORK TRAIL",
      desc: "Multi-hop mule account transaction chain visualized as star chart."
    },
    {
      step: 3,
      icon: MapPin,
      title: "SPATIAL RISK FORECAST",
      desc: "Predicted cash-out zone with dynamic confidence score and ATM radius."
    },
    {
      step: 4,
      icon: AlertCircle,
      title: "INTERCEPT DISPATCH ORDER",
      desc: "Real-time automated dispatches to Cyber Cell patrol units and bank lien APIs."
    }
  ];

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden">
      {/* Center-Left Pinned Hero Callout (Exact Esri 34% Callout Style) */}
      <div className="relative z-20 max-w-xl px-12 pt-36 space-y-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="text-red-500 text-xl">📢</span>
          <span className="esri-label text-slate-300">
            ACTIVE COMPLAINTS IN PAST 24 HOURS
          </span>
        </div>

        {/* Hero Number - Light 200 weight */}
        <div className="hero-number-esri text-8xl md:text-[110px]">
          8,214
        </div>

        <p className="esri-label text-slate-400 font-normal">
          PERCENT HIGHER • NCRP 1930 HELPLINE INGESTION
        </p>

        <div className="pt-4">
          <button
            onClick={() => setStep(2)}
            className="text-xs font-mono tracking-widest text-white hover:text-red-400 transition-colors uppercase flex items-center gap-2 cursor-pointer"
          >
            <span>START TRACING DOSSIER #{selectedComplaintId}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Bottom 4-Item Navigation Strip (Exact Match to coolmaps.esri.com) */}
      <div className="relative z-20 px-12 pb-8 pt-6 bottom-scrim border-t border-white/10 pointer-events-auto">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedStep === item.step;

            return (
              <div
                key={item.step}
                onClick={() => setStep(item.step)}
                className={`group cursor-pointer space-y-2 transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3 text-slate-100">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-slate-400 group-hover:text-red-500'} transition-colors`} />
                  <span className="font-bold text-xs tracking-wider text-slate-100 uppercase">
                    {item.title}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
