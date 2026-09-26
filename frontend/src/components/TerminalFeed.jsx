import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield } from 'lucide-react';

export default function TerminalFeed({ activeCase }) {
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);

  // Simulated live log generator
  useEffect(() => {
    const initialLogs = [
      `[SYS 10:14:02] Ingested dossier #${activeCase?.complaint_id || 'NCRP-2026-00417'} from NCRP 1930 Helpline API.`,
      `[PARSE 10:14:03] Extracted victim origin: ${activeCase?.victim_name || 'R. Sharma'} (${activeCase?.victim_city || 'Delhi'}).`,
      `[NEO4J 10:14:04] Executed Cypher graph traversal across multi-bank gateway nodes.`,
      `[GRAPH 10:14:04] Found 3-hop mule chain: ${activeCase?.first_mule_account_id || 'AC-2290 (ICICI)'} -> AC-7715 (HDFC).`,
      `[AI 10:14:05] Evaluated Explainable Risk Score: ${activeCase?.predicted_zone?.risk_score ? Math.round(activeCase.predicted_zone.risk_score * 100) : 84}% (CRITICAL).`,
      `[GIS 10:14:05] Forecasted physical cashout hotspot: ${activeCase?.predicted_area || 'Connaught Place Hub'}.`,
      `[PATROL 10:14:06] Nearest squad unit: ${activeCase?.victim_city || 'Delhi'} Cyber Cell Patrol Wing 4 (1.2 km).`
    ];
    setLogs(initialLogs);
  }, [activeCase]);

  // Periodic random background log emitter
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMs = Math.floor(Math.random() * 50) + 10;
      const templates = [
        `[NPCI ${new Date().toLocaleTimeString()}] Poll cycle cleared (${randomMs}ms latency). Zero packet loss.`,
        `[AI-MODEL ${new Date().toLocaleTimeString()}] DBSCAN clustering score updated: 0.89 confidence.`,
        `[SYS ${new Date().toLocaleTimeString()}] Heartbeat check OK. 14,280 ATM hotspot clusters active.`
      ];
      const newMsg = templates[Math.floor(Math.random() * templates.length)];
      setLogs(prev => [...prev.slice(-15), newMsg]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full overflow-hidden font-mono text-[11px]">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold shrink-0">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>LIVE INGESTION TERMINAL</span>
        </div>
        <span className="text-[10px] text-emerald-400">STREAMING</span>
      </div>

      <div
        ref={logContainerRef}
        className="p-3 overflow-y-auto space-y-1.5 text-slate-300 scrollbar-none bg-[#020617]/90 flex-1"
      >
        {logs.map((log, i) => (
          <div key={i} className="leading-tight break-all">
            <span className={
              log.includes('CRITICAL') || log.includes('AI') ? 'text-amber-400 font-bold' :
              log.includes('NEO4J') || log.includes('GRAPH') ? 'text-blue-400 font-bold' :
              log.includes('PATROL') || log.includes('NPCI') ? 'text-emerald-400' : 'text-slate-400'
            }>
              {log}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
