import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import MuleTraceCanvas from './components/MuleTraceCanvas';
import TacticalRadarMap from './components/TacticalRadarMap';
import SystemArchitecture from './components/SystemArchitecture';
import IncidentMatrix from './components/IncidentMatrix';
import AlertModal from './components/AlertModal';
import Footer from './components/Footer';
import { Terminal } from 'lucide-react';

import {
  fetchComplaints,
  fetchComplaintById,
  fetchComplaintGraph,
  fetchComplaintPrediction,
  triggerAlert
} from './api/client';

export default function App() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState('NCRP-2026-00417');
  const [activeCase, setActiveCase] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertResult, setAlertResult] = useState(null);

  // Load complaints list
  useEffect(() => {
    async function loadComplaints() {
      const list = await fetchComplaints();
      if (list && list.length > 0) {
        setComplaints(list);
        setSelectedComplaintId(list[0].complaint_id);
      }
    }
    loadComplaints();
  }, []);

  // Load details whenever selected case changes
  useEffect(() => {
    async function loadCaseData() {
      if (!selectedComplaintId) return;

      const [cDetails, gData, pData] = await Promise.all([
        fetchComplaintById(selectedComplaintId),
        fetchComplaintGraph(selectedComplaintId),
        fetchComplaintPrediction(selectedComplaintId)
      ]);

      if (cDetails) setActiveCase(cDetails);
      if (gData) setGraphData(gData);
      if (pData) setPredictionData(pData);
    }

    loadCaseData();
  }, [selectedComplaintId]);

  // Handle Dispatch Intercept Trigger
  const handleSimulateIntercept = async () => {
    const activeInfo = complaints.find(c => c.complaint_id === selectedComplaintId) || activeCase;
    const res = await triggerAlert(selectedComplaintId, {
      lea_unit: `${activeInfo?.victim_city || 'Delhi'} Cyber Cell Patrol Squad`,
      bank_code: `${activeInfo?.first_mule_account_id || 'ICICI/HDFC'} Automated Gateway`
    });
    setAlertResult(res);
    setIsAlertModalOpen(true);
  };

  const handleExploreTrace = () => {
    const el = document.getElementById('trace-engine');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreMap = () => {
    const el = document.getElementById('spatial-map');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-[#F8F8F6] tactical-grid-bg text-slate-900 font-sans selection:bg-blue-600 selection:text-white relative">
          {/* Floating Header */}
          <Navbar
            complaints={complaints}
            selectedComplaintId={selectedComplaintId}
            onSelectComplaint={setSelectedComplaintId}
            onSimulateIntercept={handleSimulateIntercept}
          />

          {/* Main Full-Bleed Platform Site */}
          <main className="relative">
            <LandingHero
              activeCase={activeCase}
              complaints={complaints}
              selectedComplaintId={selectedComplaintId}
              onSelectComplaint={setSelectedComplaintId}
              onExploreTrace={handleExploreTrace}
              onExploreMap={handleExploreMap}
            />

            <MuleTraceCanvas
              graphData={graphData}
              activeCase={activeCase}
              onProceedToMap={handleExploreMap}
            />

            <TacticalRadarMap
              predictionData={predictionData}
              activeCase={activeCase}
              onDispatchAlert={handleSimulateIntercept}
            />

            {/* Banner CTA to the separate Trace Route */}
            <section id="architecture" className="py-16 bg-blue-600 text-white flex flex-col items-center text-center px-4">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-black mb-4">Want to see exactly how our algorithm reasons?</h2>
                <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                  Step inside the P.R.A.H.A.R.I. engine. Watch the live execution trace as it fetches complaints, traverses graphs, and runs XGBoost predictions.
                </p>
                <Link to="/trace" className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <Terminal size={20} />
                  Launch Live Tracer
                </Link>
              </div>
            </section>

            <IncidentMatrix
              complaints={complaints}
              selectedComplaintId={selectedComplaintId}
              onSelectComplaint={setSelectedComplaintId}
            />
          </main>

          <Footer />

          <AlertModal
            isOpen={isAlertModalOpen}
            onClose={() => setIsAlertModalOpen(false)}
            alertResult={alertResult}
            activeCase={activeCase}
          />
        </div>
      } />
      
      {/* Dedicated standalone trace page */}
      <Route path="/trace" element={<SystemArchitecture />} />
    </Routes>
  );
}
