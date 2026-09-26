import React, { useState } from 'react';
import { Database, Search, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IncidentMatrix({ complaints = [], selectedComplaintId, onSelectComplaint }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.complaint_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.victim_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.victim_city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'ALL' || c.victim_city.toUpperCase() === selectedCity.toUpperCase();
    return matchesSearch && matchesCity;
  });

  const handleTraceClick = (complaintId) => {
    onSelectComplaint(complaintId);
    const traceEl = document.getElementById('trace-engine');
    if (traceEl) {
      traceEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="live-matrix" className="py-24 relative overflow-hidden bg-[#F8F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-200"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 font-mono mb-3">
              <Database className="w-3.5 h-3.5 text-purple-600" />
              NCRP 1930 HELPLINE LIVE FEED
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              Active Cybercrime <span className="text-purple-600">Incident Matrix</span>
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Real-time ingestion of active financial cybercrime dossiers across Delhi, Mumbai, Bengaluru & Kolkata.
            </p>
          </div>

          {/* Filter Tools (30% Blue Structure) */}
          <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                aria-label="Search incident cases"
                type="text"
                placeholder="Search case, victim, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-blue-200 rounded-2xl text-xs text-slate-800 pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-600 w-48 sm:w-64 shadow-xs"
              />
            </div>

            <div className="flex items-center bg-white p-1 rounded-2xl border border-blue-200 shadow-xs overflow-x-auto max-w-full pb-1">
              {['ALL', 'Delhi', 'Mumbai', 'Bengaluru', 'Kolkata'].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedCity === city
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Matrix Table (60% Dominant White Surface + 30% Blue Table Structure + 10% Purple Accent Button) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white rounded-3xl border border-blue-200/90 overflow-hidden shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="bg-blue-50/70 border-b border-blue-200/80 text-[11px] font-mono font-bold text-blue-900 uppercase tracking-wider">
                  <th className="py-4.5 px-6">Case ID</th>
                  <th className="py-4.5 px-6">Victim & Location</th>
                  <th className="py-4.5 px-6">Fraud Type</th>
                  <th className="py-4.5 px-6">Amount</th>
                  <th className="py-4.5 px-6">First Mule Account</th>
                  <th className="py-4.5 px-6">Predicted Zone</th>
                  <th className="py-4.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-mono">
                {filteredComplaints.map((c) => {
                  const isSelected = c.complaint_id === selectedComplaintId;
                  return (
                    <tr
                      key={c.complaint_id}
                      onClick={() => handleTraceClick(c.complaint_id)}
                      className={`group transition-all duration-300 hover:bg-blue-50/60 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 hover:z-10 relative cursor-pointer ${
                        isSelected ? 'bg-blue-50/90 border-l-4 border-blue-600 font-bold' : 'border-l-4 border-transparent'
                      }`}
                    >
                      <td className="py-4.5 px-6 font-bold text-slate-900">
                        <div className="flex items-center space-x-2">
                          {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>}
                          <span>{c.complaint_id}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-slate-700">
                        <div className="font-bold text-slate-900">{c.victim_name}</div>
                        <div className="text-[10px] text-slate-500">{c.victim_city}</div>
                      </td>
                      <td className="py-4.5 px-6 text-slate-700">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-900 text-[11px] font-bold shadow-xs">
                          {c.fraud_type}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-purple-700 font-extrabold text-sm">
                        ₹{c.amount?.toLocaleString()}
                      </td>
                      <td className="py-4.5 px-6 text-blue-800 font-bold">
                        {c.first_mule_account_id}
                      </td>
                      <td className="py-4.5 px-6 text-purple-700 font-bold max-w-[200px] truncate">
                        {c.predicted_area}
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <button
                          onClick={() => handleTraceClick(c.complaint_id)}
                          className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-1 ml-auto cursor-pointer ${
                            isSelected
                              ? 'bg-slate-950 text-white shadow-md hover:bg-slate-900'
                              : 'bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 shadow-xs'
                          }`}
                        >
                          <span>{isSelected ? 'ACTIVE CASE' : 'TRACE CASE'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
