import React from 'react';
import { Zap, MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import CyberShield3D from './CyberShield3D';

export default function LandingHero({
  activeCase,
  complaints = [],
  selectedComplaintId,
  onSelectComplaint,
  onExploreTrace,
  onExploreMap
}) {
  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center pt-36 pb-24 overflow-hidden text-slate-900">
      
      {/* Background Soft Ambient Spotlights (Blue + Purple Accents) */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/10 blur-[180px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Main 2-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Core Value & Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Live Status Badge & Localized Complaint Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-mono text-blue-800 font-bold shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping"></span>
                <span className="tracking-wider uppercase">P.R.A.H.A.R.I. CYBER ENGINE v2.4</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600 font-medium">LIVE NCRP 1930 FEED</span>
              </div>

              {/* Localized Case Selector Dropdown */}
              {complaints.length > 0 && (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400 font-bold hidden sm:inline">DOSSIER:</span>
                  <select
                    aria-label="Select Complaint Case"
                    value={selectedComplaintId}
                    onChange={(e) => onSelectComplaint(e.target.value)}
                    className="bg-white text-slate-900 border border-blue-200 text-xs rounded-2xl px-3 py-2 focus:outline-none focus:border-purple-600 cursor-pointer font-bold shadow-xs"
                  >
                    {complaints.map((c) => (
                      <option key={c.complaint_id} value={c.complaint_id} className="bg-white text-slate-900">
                        {c.complaint_id} ({c.victim_city})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Main Impact Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] font-sans">
              Predictive AI that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-purple-600">
                intercepts ATM cashouts
              </span> <br />
              before fraud payout.
            </h1>

            {/* Sub-headline (Opened up margin-top to give typography breathing room) */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal mt-8 mb-8">
              Automated multi-hop mule graph reconstruction, spatial ATM cluster prediction, and automated bank lien dispatch engineered for Indian LEAs and NPCI financial gateways.
            </p>

            {/* Hero Action Buttons (Clear Visual Hierarchy - No Redundancy) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-mono text-xs pt-2">
              <button
                onClick={onExploreTrace}
                className="group relative px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-wider uppercase transition-all shadow-xl shadow-blue-600/25 flex items-center gap-2.5 cursor-pointer active:scale-98 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/25 to-blue-400/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 -translate-x-full z-0"></div>
                <Zap className="w-4 h-4 fill-white group-hover:scale-110 transition-transform relative z-10" />
                <span className="relative z-10">START INVESTIGATION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
              </button>

              <button
                onClick={onExploreMap}
                className="group px-6 py-4 rounded-2xl bg-white hover:bg-blue-50/50 text-blue-900 font-bold tracking-wider uppercase border border-blue-200 transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:shadow-md hover:border-blue-300 active:scale-98"
              >
                <MapPin className="w-4 h-4 text-blue-600 group-hover:-translate-y-0.5 transition-transform" />
                <span>SPATIAL ATM RADAR</span>
              </button>
            </div>

            {/* 4-Item Stats Bento Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80 font-mono">
              <div className="group p-4 rounded-2xl bg-white border border-blue-100 shadow-xs hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 space-y-1">
                <div className="text-xs text-slate-400 font-medium">FUNDS FROZEN</div>
                <div className="text-xl sm:text-2xl font-black text-slate-950">₹1.42 Cr+</div>
                <div className="text-[10px] text-purple-600 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 group-hover:animate-bounce" />
                  <span>+28% this week</span>
                </div>
              </div>

              <div className="group p-4 rounded-2xl bg-white border border-blue-100 shadow-xs hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 space-y-1">
                <div className="text-xs text-slate-400 font-medium">TRACE LATENCY</div>
                <div className="text-xl sm:text-2xl font-black text-slate-950">&lt; 3.2 Min</div>
                <div className="text-[10px] text-blue-600 font-bold">Sub-second graph</div>
              </div>

              <div className="group p-4 rounded-2xl bg-white border border-blue-100 shadow-xs hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 space-y-1">
                <div className="text-xs text-slate-400 font-medium">GRAPH ACCURACY</div>
                <div className="text-xl sm:text-2xl font-black text-purple-600 group-hover:text-purple-500 transition-colors">99.4%</div>
                <div className="text-[10px] text-slate-500 font-bold">Neo4j ML Model</div>
              </div>

              <div className="group p-4 rounded-2xl bg-white border border-blue-100 shadow-xs hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 space-y-1">
                <div className="text-xs text-slate-400 font-medium">MULE ACCOUNTS</div>
                <div className="text-xl sm:text-2xl font-black text-blue-600 group-hover:text-blue-500 transition-colors">12,400+</div>
                <div className="text-[10px] text-purple-600 font-bold">Flagged & Blocked</div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: 3D Holographic Interception Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block lg:col-span-5"
          >
            <CyberShield3D onExploreTrace={onExploreTrace} />
          </motion.div>

        </div>

      </div>
    </section>
  );
}
