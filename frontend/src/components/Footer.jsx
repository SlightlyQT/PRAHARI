import React from 'react';
import { Shield, Lock, Activity, FileText, Cpu, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/27 bg-[#0a1119] pt-24 pb-12 text-slate-400 font-mono text-xs relative z-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Brand & Safety Net Top Banner (Expanded Layout Margins) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-12 border-b border-cyan-500/24 gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-cyan-500/8 text-cyan-400 border border-cyan-500/30 shadow-xs">
              <Shield className="w-5.5 h-5.5 text-cyan-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div>
              <div className="font-black text-slate-50 text-xl font-sans tracking-tight">
                P.R.A.H.A.R.I. <span className="text-emerald-400">Engine</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Predictive Cybercrime Interception Engine • SIH 2026 PS ID: 26184
              </div>
            </div>
          </div>

          {/* Persona Safety Net Badges (10% Purple Accent) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
              SIH 2026 GRAND FINALE EDITION
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/8 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              I4C / MHA COMPLIANT
            </span>
          </div>
        </div>

        {/* 4-Column Structural Array (Strict 2-Level Hierarchy & 2-Column Grid Inside Each Category) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 font-sans my-12">
          
          {/* Column 1: Platform Engines */}
          <div className="space-y-4 font-mono">
            {/* Level 1: Category Header */}
            <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2 pb-2.5 border-b border-cyan-500/24">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>PLATFORM ENGINES</span>
            </h3>
            
            {/* Level 2: Strict Two-Column Grid per Item (Left-Aligned Title, Right-Aligned Fixed Boundary Badge) */}
            <ul className="space-y-4 text-xs">
              <li>
                <a href="#trace-engine" className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300 hover:text-emerald-400 transition-colors group">
                  <span className="font-semibold truncate">Neo4j Mule Graph</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 uppercase text-right">
                    FAST
                  </span>
                </a>
              </li>
              <li>
                <a href="#spatial-map" className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300 hover:text-emerald-400 transition-colors group">
                  <span className="font-semibold truncate">DBSCAN Spatial Radar</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/14 text-emerald-300 border border-emerald-400/50 uppercase text-right">
                    3D MAP
                  </span>
                </a>
              </li>
              <li>
                <a href="#hero" className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300 hover:text-emerald-400 transition-colors group">
                  <span className="font-semibold truncate">Golden Window Counter</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-cyan-500/8 text-cyan-300 border border-cyan-500/30 uppercase text-right">
                    24M ETA
                  </span>
                </a>
              </li>
              <li>
                <a href="#trace-engine" className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300 hover:text-emerald-400 transition-colors group">
                  <span className="font-semibold truncate">Explainable AI Dossier</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 uppercase text-right">
                    99.4%
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: LEA Integrations */}
          <div className="space-y-4 font-mono">
            {/* Level 1: Category Header */}
            <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2 pb-2.5 border-b border-cyan-500/24">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>LEA INTEGRATIONS</span>
            </h3>

            {/* Level 2: Strict Two-Column Grid per Item */}
            <ul className="space-y-4 text-xs">
              <li>
                <a href="#live-matrix" className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300 hover:text-cyan-400 transition-colors group">
                  <span className="font-semibold truncate">NCRP 1930 Ingestion</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-cyan-500/8 text-cyan-300 border border-cyan-500/30 uppercase text-right">
                    LIVE
                  </span>
                </a>
              </li>
              <li>
                <a href="#trace-engine" className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300 hover:text-cyan-400 transition-colors group">
                  <span className="font-semibold truncate">NPCI Bank Lien Hold</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 uppercase text-right">
                    AUTO
                  </span>
                </a>
              </li>
              <li>
                <a href="#spatial-map" className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300 hover:text-cyan-400 transition-colors group">
                  <span className="font-semibold truncate">Cyber Squad Patrol</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-cyan-500/8 text-cyan-300 border border-cyan-500/30 uppercase text-right">
                    GPS HUB
                  </span>
                </a>
              </li>
              <li>
                <a href="#hero" className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300 hover:text-cyan-400 transition-colors group">
                  <span className="font-semibold truncate">Automated Account Freeze</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 uppercase text-right">
                    INSTANT
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Compliance & Acts */}
          <div className="space-y-4 font-mono">
            {/* Level 1: Category Header */}
            <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2 pb-2.5 border-b border-cyan-500/24">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>COMPLIANCE & ACTS</span>
            </h3>

            {/* Level 2: Strict Two-Column Grid per Item */}
            <ul className="space-y-4 text-xs">
              <li className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300">
                <span className="font-semibold truncate">Indian IT Act 2000</span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 uppercase text-right">
                  SEC 66D
                </span>
              </li>
              <li className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300">
                <span className="font-semibold truncate">MHA Cyber Safety</span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-cyan-500/8 text-cyan-300 border border-cyan-500/30 uppercase text-right">
                  MHA 1930
                </span>
              </li>
              <li className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300">
                <span className="font-semibold truncate">RBI Financial Circular</span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-cyan-500/8 text-cyan-300 border border-cyan-500/30 uppercase text-right">
                  RBI SLA
                </span>
              </li>
              <li className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300">
                <span className="font-semibold truncate">Cert-In Immutable Log</span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 uppercase text-right">
                  CERT-IN
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance */}
          <div className="space-y-4 font-mono">
            {/* Level 1: Category Header */}
            <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2 pb-2.5 border-b border-cyan-500/24">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>GOVERNANCE</span>
            </h3>

            {/* Level 2: Strict Two-Column Grid per Item */}
            <ul className="space-y-4 text-xs">
              <li>
                <a href="#architecture" className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300 hover:text-emerald-400 transition-colors group">
                  <span className="font-semibold truncate">System Architecture</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 uppercase text-right">
                    MANUAL
                  </span>
                </a>
              </li>
              <li>
                <a href="#live-matrix" className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300 hover:text-emerald-400 transition-colors group">
                  <span className="font-semibold truncate">Incident Matrix Log</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-cyan-500/8 text-cyan-300 border border-cyan-500/30 uppercase text-right">
                    MATRIX
                  </span>
                </a>
              </li>
              <li>
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300">
                  <span className="font-semibold truncate">Cyber Crime Centre</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-cyan-500/8 text-cyan-300 border border-cyan-500/30 uppercase text-right">
                    I4C HUB
                  </span>
                </div>
              </li>
              <li>
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-1 text-slate-300">
                  <span className="font-semibold truncate">Ministry of Home Affairs</span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/8 text-emerald-400 border border-emerald-500/30 uppercase text-right">
                    MHA GOV
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Horizontal Sub-Footer Strip (Expanded Padding & Margin framing bottom cleanly) */}
        <div className="pt-12 mt-16 border-t border-cyan-500/24 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[11px] text-slate-400">
          <div>
            © 2026 P.R.A.H.A.R.I. Engine • Built for Smart India Hackathon 2026 • All Rights Reserved.
          </div>

          {/* Legal Proximity Links Pinned Right */}
          <div className="flex flex-wrap items-center gap-4">
            <a href="#hero" className="hover:text-emerald-400 transition-colors">Terms of Interception</a>
            <span>•</span>
            <a href="#hero" className="hover:text-emerald-400 transition-colors">LEA Data Security</a>
            <span>•</span>
            <a href="#hero" className="hover:text-emerald-400 transition-colors">NPCI Gateway SLA</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
