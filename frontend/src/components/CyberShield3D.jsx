import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Shield, Zap, Orbit, Cpu, Activity, Lock } from 'lucide-react';

export default function CyberShield3D({ onExploreTrace }) {
  const [isPulseActive, setIsPulseActive] = useState(false);

  // Mouse tilt spring physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 140, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 140, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);
  const floatZ = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const triggerPulse = () => {
    setIsPulseActive(true);
    setTimeout(() => setIsPulseActive(false), 2200);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        triggerPulse();
        if (onExploreTrace) onExploreTrace();
      }}
      className="relative w-full h-[480px] flex items-center justify-center perspective-[1200px] select-none cursor-pointer group"
    >
      {/* Soft Ambient Background Radial Spotlights */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/15 blur-[130px] pointer-events-none"></div>
      <div className="absolute w-[280px] h-[280px] rounded-full bg-sky-400/15 blur-[100px] pointer-events-none"></div>

      <motion.div
        style={{
          rotateX,
          rotateY,
          z: floatZ,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* 3D Tactical Disk Base Grid */}
        <div
          className="absolute w-[460px] h-[460px] rounded-full opacity-35 border-2 border-dashed border-blue-400/60 pointer-events-none"
          style={{
            transform: "rotateX(74deg) translateZ(-50px)",
            background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(248,248,246,0) 75%)"
          }}
        ></div>

        {/* Outer Orbit Ring 1 (Sweeper) */}
        <div
          className="absolute w-[360px] h-[360px] rounded-full border border-blue-500/40 radar-sweeper pointer-events-none"
          style={{ transform: "rotateX(74deg) translateZ(-15px)" }}
        >
          <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-[0_0_20px_#2563EB] absolute -top-2.5 left-1/2 -translate-x-1/2"></div>
        </div>

        {/* Counter-Rotating Orbit Ring 2 */}
        <div
          className="absolute w-[270px] h-[270px] rounded-full border-2 border-dashed border-sky-400/50 pointer-events-none"
          style={{
            transform: "rotateX(74deg) rotateZ(45deg) translateZ(15px)",
            animation: "radar-sweep-rotate 10s linear infinite reverse"
          }}
        >
          <div className="w-4 h-4 rounded-full bg-sky-400 border-2 border-white shadow-[0_0_16px_#38BDF8] absolute -top-2 left-1/2 -translate-x-1/2"></div>
        </div>

        {/* Counter-Rotating Orbit Ring 3 */}
        <div
          className="absolute w-[190px] h-[190px] rounded-full border border-indigo-500/50 pointer-events-none"
          style={{
            transform: "rotateX(74deg) rotateZ(-60deg) translateZ(35px)",
            animation: "radar-sweep-rotate 6s linear infinite"
          }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white shadow-[0_0_14px_#6366F1] absolute -top-1.5 left-1/2 -translate-x-1/2"></div>
        </div>

        {/* SVG Laser Flow Trajectories Connecting 3D Spheres */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <path d="M 90 140 C 180 80, 240 80, 240 240" fill="none" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="6 3" className="laser-trace-cyan" />
          <path d="M 240 240 C 280 340, 360 340, 390 200" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="6 3" className="laser-trace-cyan" />
          <path d="M 390 200 C 420 120, 480 120, 480 300" fill="none" stroke="#E11D48" strokeWidth="3.5" strokeDasharray="6 3" className="laser-trace-cyan" />
        </svg>

        {/* Dynamic Floating Ambient Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, Math.random() * -50 - 20, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#38BDF8] pointer-events-none"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              transform: `translateZ(${Math.random() * 80 - 40}px)`
            }}
          />
        ))}

        {/* 3D FLOATING SPHERES (NO TEXT BOXES) */}

        {/* 3D Sphere Node 1 (Sky Blue - Origin) */}
        <motion.div
          animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-16 top-16 z-20 w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-sky-400 p-0.5 border-2 border-white shadow-[0_8px_24px_rgba(2,132,199,0.5)] flex items-center justify-center"
          style={{ transform: "translateZ(90px)" }}
        >
          <div className="w-full h-full rounded-full bg-sky-500/20 backdrop-blur-sm flex items-center justify-center text-white">
            <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
          </div>
        </motion.div>

        {/* 3D Sphere Node 2 (Cobalt Blue - Mule 1) */}
        <motion.div
          animate={{ y: [0, 8, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute right-20 top-14 z-20 w-14 h-14 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-400 p-0.5 border-2 border-white shadow-[0_10px_30px_rgba(37,99,235,0.6)] flex items-center justify-center ring-4 ring-blue-500/20"
          style={{ transform: "translateZ(105px)" }}
        >
          <div className="w-full h-full rounded-full bg-blue-600/20 backdrop-blur-sm flex items-center justify-center text-white">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        {/* 3D Sphere Node 3 (Amber Warning - Mule 2) */}
        <motion.div
          animate={{ y: [0, -7, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute left-20 bottom-16 z-20 w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 border-2 border-white shadow-[0_8px_24px_rgba(217,119,6,0.5)] flex items-center justify-center"
          style={{ transform: "translateZ(75px)" }}
        >
          <div className="w-full h-full rounded-full bg-amber-500/20 backdrop-blur-sm flex items-center justify-center text-white">
            <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm"></span>
          </div>
        </motion.div>

        {/* 3D Sphere Node 4 (Crimson Critical - Target ATM) */}
        <motion.div
          animate={{ y: [0, 9, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
          className="absolute right-14 bottom-14 z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-rose-400 p-0.5 border-2 border-white shadow-[0_12px_36px_rgba(225,29,72,0.65)] flex items-center justify-center ring-4 ring-rose-500/30"
          style={{ transform: "translateZ(115px)" }}
        >
          <div className="relative w-full h-full rounded-full bg-rose-600/30 backdrop-blur-sm flex items-center justify-center text-white">
            <span className="w-4 h-4 rounded-full bg-white animate-ping"></span>
          </div>
        </motion.div>

        {/* Interactive Shockwave Pulse Ring */}
        {isPulseActive && (
          <div className="absolute w-32 h-32 rounded-full bg-blue-500/30 border-2 border-cyan-400 animate-ping z-30 pointer-events-none"></div>
        )}

        {/* Central PRAHARI Holographic Cyber Core Orb */}
        <div
          className="relative z-30 w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-[0_16px_50px_rgba(37,99,235,0.5)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          style={{ transform: "translateZ(80px)" }}
        >
          <div className="w-full h-full rounded-[22px] bg-white border border-slate-100 flex flex-col items-center justify-center text-slate-900 space-y-1 shadow-inner">
            <Shield className="w-10 h-10 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-[10px] font-mono font-black text-blue-700 tracking-widest">P.R.A.H.A.R.I.</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
