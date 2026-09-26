import React from 'react';
import { Database, Network, Map, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function SystemArchitecture() {
  const steps = [
    {
      num: "01",
      title: "NCRP 1930 Ingestion",
      icon: Database,
      color: "text-blue-700 bg-blue-50 border-blue-200",
      desc: "Instant parsing of victim complaints from the National Cybercrime Reporting Portal, extracting UPI transaction IDs, account numbers, and timestamps."
    },
    {
      num: "02",
      title: "Multi-Hop Graph Traversal",
      icon: Network,
      color: "text-purple-700 bg-purple-50 border-purple-200",
      desc: "Sub-second graph query execution tracing funds across Layer-1, Layer-2, and Layer-3 mule accounts to unmask hidden syndicate hubs."
    },
    {
      num: "03",
      title: "Spatial Risk & ATM Model",
      icon: Map,
      color: "text-blue-700 bg-blue-50 border-blue-200",
      desc: "DBSCAN spatial clustering combined with transfer velocity vectors to forecast the exact ATM commercial hub where criminals will liquidate cash."
    },
    {
      num: "04",
      title: "Automated Lien & Patrol Alert",
      icon: ShieldCheck,
      color: "text-purple-700 bg-purple-50 border-purple-200",
      desc: "Automated API webhooks dispatching emergency lien holds to partner banks while broadcasting geofenced alerts to nearby Cyber Cell patrol units."
    }
  ];

  return (
    <section id="architecture" className="py-24 relative overflow-hidden bg-[#F8FAFC] text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header (Perfectly Centered & Aligned to 4-Column Grid) */}
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-16 space-y-3 font-sans">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 font-mono shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>END-TO-END PIPELINE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight text-center">
            How P.R.A.H.A.R.I. <span className="text-purple-600">Stops Fraud in Minutes</span>
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl text-center leading-relaxed">
            A 4-stage automated pipeline designed for Indian Law Enforcement Agencies (LEAs) and NPCI financial gateways.
          </p>
        </div>

        {/* Bento Grid (60% Dominant White Surface + 30% Blue Borders + 10% Purple Accents) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-blue-100 hover:border-purple-400 transition-all hover:-translate-y-1 flex flex-col justify-between group shadow-md hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold text-slate-400">STEP {s.num}</span>
                    <div className={`p-3 rounded-2xl border ${s.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors font-sans">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-light">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>LATENCY: &lt; 500MS</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
