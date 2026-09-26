import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Globe, ShieldAlert, Zap, Compass, Activity, Eye, Layers, Lock, RotateCcw, Play, Pause,
  MapPin, CheckCircle2, ChevronRight, AlertTriangle, ArrowRight, Server, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Multi-State Indian Account Traces for Hackathon Demo
const TRACE_CASES = {
  'NCRP-2026-00417': {
    id: 'NCRP-2026-00417',
    title: 'Jamtara OTP & UPI Phishing Syndicate',
    totalAmount: '₹5,40,000',
    riskLevel: 'CRITICAL',
    timeRemaining: '04:12 mins',
    nodes: [
      {
        id: 'node-victim',
        type: 'victim',
        code: 'V1',
        label: 'Victim (SBI Janpath)',
        city: 'New Delhi',
        state: 'Delhi NCR',
        lat: 28.6139,
        lng: 77.2090,
        account: 'XXXX-4819-2041',
        bank: 'State Bank of India',
        ifsc: 'SBIN0000691',
        amount: '₹5,40,000',
        status: 'DISBURSED',
        time: '14:20:05',
        ip: '103.24.18.91'
      },
      {
        id: 'node-mule1',
        type: 'mule',
        code: 'M1',
        label: 'Tier-1 Mule (Axis Jamtara)',
        city: 'Jamtara',
        state: 'Jharkhand',
        lat: 23.9627,
        lng: 86.8020,
        account: 'XXXX-9102-4412',
        bank: 'Axis Bank',
        ifsc: 'UTIB0001890',
        amount: '₹3,80,000',
        status: 'HOLD APPLIED',
        time: '14:21:40',
        ip: '157.34.12.8'
      },
      {
        id: 'node-mule2',
        type: 'mule',
        code: 'M2',
        label: 'Tier-2 Mule (HDFC Saltlake)',
        city: 'Kolkata',
        state: 'West Bengal',
        lat: 22.5726,
        lng: 88.3639,
        account: 'XXXX-3341-8890',
        bank: 'HDFC Bank',
        ifsc: 'HDFC0000128',
        amount: '₹2,10,000',
        status: 'MONITORED',
        time: '14:23:12',
        ip: '49.36.192.11'
      },
      {
        id: 'node-target',
        type: 'target',
        code: 'ATM',
        label: 'Target Withdrawal ATM',
        city: 'Bengaluru',
        state: 'Karnataka',
        lat: 12.9716,
        lng: 77.5946,
        account: 'ATM-BLR-REGAL-04',
        bank: 'ICICI Automated Gateway',
        ifsc: 'ICIC0000002',
        amount: '₹1,60,000',
        status: 'IMMINENT CASH OUT',
        time: 'EXPECTED <2 MINS',
        ip: 'ATM SQUAD DIST: 180m'
      }
    ]
  },
  'NCRP-2026-00892': {
    id: 'NCRP-2026-00892',
    title: 'Fake Investment P2P Crypto Laundering',
    totalAmount: '₹12,80,000',
    riskLevel: 'HIGH THREAT',
    timeRemaining: '08:45 mins',
    nodes: [
      {
        id: 'node-victim',
        type: 'victim',
        code: 'V1',
        label: 'Victim (ICICI Bandra)',
        city: 'Mumbai',
        state: 'Maharashtra',
        lat: 19.0760,
        lng: 72.8777,
        account: 'XXXX-7721-0091',
        bank: 'ICICI Bank',
        ifsc: 'ICIC0000011',
        amount: '₹12,80,000',
        status: 'DISBURSED',
        time: '11:15:22',
        ip: '115.98.22.10'
      },
      {
        id: 'node-mule1',
        type: 'mule',
        code: 'M1',
        label: 'Mule (Kotak CG Road)',
        city: 'Ahmedabad',
        state: 'Gujarat',
        lat: 23.0225,
        lng: 72.5714,
        account: 'XXXX-5512-9901',
        bank: 'Kotak Mahindra',
        ifsc: 'KKBK0000812',
        amount: '₹9,50,000',
        status: 'FROZEN',
        time: '11:16:05',
        ip: '122.170.8.44'
      },
      {
        id: 'node-mule2',
        type: 'mule',
        code: 'M2',
        label: 'Mule (PNB MI Road)',
        city: 'Jaipur',
        state: 'Rajasthan',
        lat: 26.9124,
        lng: 75.7873,
        account: 'XXXX-1102-7743',
        bank: 'Punjab National Bank',
        ifsc: 'PUNB0109200',
        amount: '₹6,20,000',
        status: 'HOLD APPLIED',
        time: '11:17:30',
        ip: '106.213.4.12'
      },
      {
        id: 'node-target',
        type: 'target',
        code: 'ATM',
        label: 'Target ATM Hub (Connaught Place)',
        city: 'New Delhi',
        state: 'Delhi NCR',
        lat: 28.6139,
        lng: 77.2090,
        account: 'ATM-DEL-CP-09',
        bank: 'SBI Financial District Hub',
        ifsc: 'SBIN0000001',
        amount: '₹3,00,000',
        status: 'MONITORED',
        time: 'EXPECTED <5 MINS',
        ip: 'SQUAD 2 ON STANDBY'
      }
    ]
  },
  'NCRP-2026-01204': {
    id: 'NCRP-2026-01204',
    title: 'Digital Arrest & Tele-Extortion Ring',
    totalAmount: '₹8,90,000',
    riskLevel: 'CRITICAL',
    timeRemaining: '02:10 mins',
    nodes: [
      {
        id: 'node-victim',
        type: 'victim',
        code: 'V1',
        label: 'Victim (Canara Hitech City)',
        city: 'Hyderabad',
        state: 'Telangana',
        lat: 17.3850,
        lng: 78.4867,
        account: 'XXXX-3390-1124',
        bank: 'Canara Bank',
        ifsc: 'CNRB0002109',
        amount: '₹8,90,000',
        status: 'DISBURSED',
        time: '09:02:11',
        ip: '183.82.1.99'
      },
      {
        id: 'node-mule1',
        type: 'mule',
        code: 'M1',
        label: 'Mule (BoB Anna Salai)',
        city: 'Chennai',
        state: 'Tamil Nadu',
        lat: 13.0827,
        lng: 80.2707,
        account: 'XXXX-4421-9008',
        bank: 'Bank of Baroda',
        ifsc: 'BARB0ANNASA',
        amount: '₹6,50,000',
        status: 'MONITORED',
        time: '09:03:50',
        ip: '117.200.44.2'
      },
      {
        id: 'node-mule2',
        type: 'mule',
        code: 'M2',
        label: 'Mule (Union Bank Hazratganj)',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        lat: 26.8467,
        lng: 80.9462,
        account: 'XXXX-8820-1192',
        bank: 'Union Bank of India',
        ifsc: 'UBIN0530018',
        amount: '₹4,10,000',
        status: 'HOLD APPLIED',
        time: '09:05:14',
        ip: '125.63.78.20'
      },
      {
        id: 'node-target',
        type: 'target',
        code: 'ATM',
        label: 'Mule Withdrawal Hub',
        city: 'Jamtara',
        state: 'Jharkhand',
        lat: 23.9627,
        lng: 86.8020,
        account: 'ATM-JMT-MAIN-01',
        bank: 'Gramin Bank ATM',
        ifsc: 'PUNB0RRBBGB',
        amount: '₹3,50,000',
        status: 'IMMINENT CASH OUT',
        time: 'EXPECTED NOW',
        ip: 'CYBER CELL EN ROUTE'
      }
    ]
  }
};

// Map conversion helper: Converts [lat, lng] to 3D plane X, Y coordinates centered on India
function latLngToVector3(lat, lng, altitude = 0, isGlobe = false, radius = 50) {
  if (isGlobe) {
    // 3D Spherical Globe coordinates
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const r = radius + altitude;
    return new THREE.Vector3(
      -(r * Math.sin(phi) * Math.cos(theta)),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  } else {
    // 3D Tactical Plane coordinates centered around India (Lat: 22.5° N, Lng: 78.9° E)
    const centerLat = 22.5;
    const centerLng = 78.9;
    const scale = 2.4; // Map distance scaling

    const x = (lng - centerLng) * scale;
    const z = -(lat - centerLat) * scale;
    const y = altitude;
    return new THREE.Vector3(x, y, z);
  }
}

export default function India3DTraceMap({ activeCase, onDispatchAlert }) {
  const mountRef = useRef(null);
  const [selectedCaseId, setSelectedCaseId] = useState('NCRP-2026-00417');
  const [viewMode, setViewMode] = useState('plane'); // 'plane' | 'globe'
  const [activeNode, setActiveNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'VICTIM' | 'MULE' | 'TARGET'
  const [frozenAccounts, setFrozenAccounts] = useState({});

  const currentCase = TRACE_CASES[selectedCaseId] || TRACE_CASES['NCRP-2026-00417'];

  // Three.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const pulseSpheresRef = useRef([]);

  // Sync activeCase if passed from parent app
  useEffect(() => {
    if (activeCase?.complaint_id && TRACE_CASES[activeCase.complaint_id]) {
      setSelectedCaseId(activeCase.complaint_id);
    }
  }, [activeCase]);

  // Handle Account Freeze Simulation
  const handleToggleFreeze = (nodeId) => {
    setFrozenAccounts(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Build & Manage Three.js 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.0035);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    if (viewMode === 'plane') {
      camera.position.set(0, 45, 55);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 20, 110);
      camera.lookAt(0, 0, 0);
    }
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls Setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Don't go below ground in plane mode
    controls.minDistance = 15;
    controls.maxDistance = 180;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight1.position.set(30, 60, 40);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xec4899, 1.2);
    dirLight2.position.set(-30, -20, -40);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x00f0ff, 3.0, 120);
    pointLight.position.set(0, 25, 0);
    scene.add(pointLight);

    // 6. Build Map Base & Grid
    if (viewMode === 'plane') {
      // 3D Tactical Hologram Plane of India
      const mapWidth = 100;
      const mapHeight = 90;
      const planeGeo = new THREE.PlaneGeometry(mapWidth, mapHeight, 64, 64);
      planeGeo.rotateX(-Math.PI / 2);

      // Create Cyber Grid Texture
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0b1329';
      ctx.fillRect(0, 0, 1024, 1024);

      // Cyber Grid Lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      const step = 32;
      for (let x = 0; x <= 1024; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, x);
        ctx.lineTo(1024, x);
        ctx.stroke();
      }

      // Lat/Lng Coordinate Overlay Markings
      ctx.strokeStyle = '#38bdf840';
      ctx.lineWidth = 2;
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.fillStyle = '#38bdf880';
      ctx.fillText('INDIA CYBERTRACE GEOSPATIAL 3D GRID', 40, 50);
      ctx.fillText('28°N 77°E (DELHI)', 120, 280);
      ctx.fillText('19°N 72°E (MUMBAI)', 90, 620);
      ctx.fillText('12°N 77°E (BENGALURU)', 220, 840);
      ctx.fillText('23°N 86°E (JAMTARA HUB)', 680, 480);
      ctx.fillText('22°N 88°E (KOLKATA)', 760, 520);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      const planeMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.4,
        metalness: 0.6,
        side: THREE.DoubleSide
      });
      const groundMesh = new THREE.Mesh(planeGeo, planeMat);
      groundMesh.position.y = -0.1;
      scene.add(groundMesh);

      // Glowing Perimeter Grid Box
      const gridHelper = new THREE.GridHelper(120, 40, 0x00f0ff, 0x1e293b);
      gridHelper.position.y = -0.2;
      scene.add(gridHelper);

    } else {
      // 3D Cyber Globe Mode
      const globeRadius = 40;
      const globeGeo = new THREE.SphereGeometry(globeRadius, 64, 64);

      // Globe Wireframe & Hologram Material
      const globeMat = new THREE.MeshStandardMaterial({
        color: 0x07152e,
        wireframe: false,
        roughness: 0.7,
        metalness: 0.8
      });
      const globeMesh = new THREE.Mesh(globeGeo, globeMat);
      scene.add(globeMesh);

      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      });
      const wireframeMesh = new THREE.Mesh(globeGeo, wireframeMat);
      scene.add(wireframeMesh);
    }

    // 7. Render 3D Nodes & Elevated Beacons for current Case
    const nodes = currentCase.nodes.filter(n => {
      if (filterType === 'VICTIM') return n.type === 'victim';
      if (filterType === 'MULE') return n.type === 'mule';
      if (filterType === 'TARGET') return n.type === 'target';
      return true;
    });

    const isGlobe = viewMode === 'globe';
    const nodeObjects = [];
    pulseSpheresRef.current = [];

    nodes.forEach((node, idx) => {
      const pos = latLngToVector3(node.lat, node.lng, 0, isGlobe, 40);

      // Determine Node Theme Color based on Type & Status
      let nodeColor = 0x38bdf8; // Victim Blue
      if (node.type === 'mule') nodeColor = 0xf59e0b; // Mule Amber
      if (node.type === 'target') nodeColor = 0xf43f5e; // Target Red
      if (frozenAccounts[node.id]) nodeColor = 0x10b981; // Frozen Green

      // Elevated 3D Pillar Beacon
      const pillarHeight = node.type === 'victim' ? 8 : node.type === 'mule' ? 12 : 16;
      const pillarGeo = new THREE.CylinderGeometry(0.6, 0.9, pillarHeight, 16);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);

      if (isGlobe) {
        // Align pillar to globe surface normal
        const normal = pos.clone().normalize();
        pillar.position.copy(pos.clone().add(normal.clone().multiplyScalar(pillarHeight / 2)));
        pillar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      } else {
        pillar.position.set(pos.x, pillarHeight / 2, pos.z);
      }
      scene.add(pillar);

      // Glowing Orb at Top of Beacon
      const orbGeo = new THREE.SphereGeometry(1.4, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 1.2,
        roughness: 0.1
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      if (isGlobe) {
        const normal = pos.clone().normalize();
        orb.position.copy(pos.clone().add(normal.clone().multiplyScalar(pillarHeight + 1)));
      } else {
        orb.position.set(pos.x, pillarHeight + 1, pos.z);
      }
      scene.add(orb);

      // Expanding Radar Rings on Ground / Globe Surface
      const ringGeo = new THREE.RingGeometry(1.5, 3.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      if (isGlobe) {
        const normal = pos.clone().normalize();
        ring.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.2)));
        ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      } else {
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(pos.x, 0.1, pos.z);
      }
      scene.add(ring);

      nodeObjects.push({ nodeData: node, orb, pillar, pos });
    });

    // 8. Construct 3D Parabolic Flow Arcs between consecutive nodes
    for (let i = 0; i < nodes.length - 1; i++) {
      const startNode = nodes[i];
      const endNode = nodes[i + 1];

      const startPos = latLngToVector3(startNode.lat, startNode.lng, 0, isGlobe, 40);
      const endPos = latLngToVector3(endNode.lat, endNode.lng, 0, isGlobe, 40);

      // Calculate elevated 3D Bezier curve control point
      const midPos = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
      const distance = startPos.distanceTo(endPos);
      const arcHeight = Math.max(10, distance * 0.45);

      if (isGlobe) {
        const midNormal = midPos.clone().normalize();
        midPos.add(midNormal.multiplyScalar(arcHeight));
      } else {
        midPos.y += arcHeight;
      }

      const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, endPos);
      const curvePoints = curve.getPoints(60);

      // Arc Line Mesh
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const lineMat = new THREE.LineDashedMaterial({
        color: 0x00f0ff,
        dashSize: 1.5,
        gapSize: 0.8,
        linewidth: 2,
        transparent: true,
        opacity: 0.85
      });
      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      scene.add(line);

      // 3D Traveling Energy Pulse Light
      const pulseGeo = new THREE.SphereGeometry(1.1, 16, 16);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      scene.add(pulseMesh);

      // Light trail attached to pulse
      const pulseLight = new THREE.PointLight(0x00f0ff, 3.0, 20);
      pulseMesh.add(pulseLight);

      pulseSpheresRef.current.push({
        mesh: pulseMesh,
        curve: curve,
        progress: (i * 0.33) % 1.0,
        speed: 0.006
      });
    }

    // 9. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Animate Traveling Arcs Light Pulses
      if (isPlaying) {
        pulseSpheresRef.current.forEach(p => {
          p.progress += p.speed;
          if (p.progress > 1.0) p.progress = 0;

          const point = p.curve.getPoint(p.progress);
          p.mesh.position.copy(point);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Raycasting & Interaction Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Find if an orb or pillar was clicked
        for (let hit of intersects) {
          const matched = nodeObjects.find(n => n.orb === hit.object || n.pillar === hit.object);
          if (matched) {
            setActiveNode(matched.nodeData);
            break;
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('click', handleCanvasClick);
        renderer.dispose();
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedCaseId, viewMode, filterType, isPlaying, frozenAccounts]);

  // Camera Preset View Animators
  const setCameraPreset = (preset) => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    if (preset === 'OVERVIEW') {
      camera.position.set(0, 50, 60);
      controls.target.set(0, 0, 0);
    } else if (preset === 'DELHI') {
      // Focus North India (Delhi)
      const delVec = latLngToVector3(28.6139, 77.2090, 0, viewMode === 'globe', 40);
      camera.position.set(delVec.x, delVec.y + 15, delVec.z + 25);
      controls.target.copy(delVec);
    } else if (preset === 'JAMTARA') {
      // Focus Jamtara Cyber Hub
      const jmtVec = latLngToVector3(23.9627, 86.8020, 0, viewMode === 'globe', 40);
      camera.position.set(jmtVec.x, jmtVec.y + 12, jmtVec.z + 20);
      controls.target.copy(jmtVec);
    } else if (preset === 'SOUTH') {
      // Focus Bengaluru / Target ATM
      const blrVec = latLngToVector3(12.9716, 77.5946, 0, viewMode === 'globe', 40);
      camera.position.set(blrVec.x, blrVec.y + 12, blrVec.z + 20);
      controls.target.copy(blrVec);
    }
    controls.update();
  };

  return (
    <section id="india-3d-trace" className="py-20 relative overflow-hidden bg-[#070B14] text-white selection:bg-blue-600">
      
      {/* Background Decorative Ambient Flares */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <span>LIVE HACKATHON FEATURE • 3D GEOSPATIAL FUND TRACE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans flex items-center gap-3">
              Pan-India 3D Account Trace Map
              <span className="px-2.5 py-1 text-xs font-mono font-bold text-sky-400 bg-sky-950/80 border border-sky-500/40 rounded-lg uppercase">
                WebGL 3D Engine
              </span>
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl font-sans">
              Real-time 3D visualization of multi-hop cybercrime fund flows across Indian states. Elevates mule account tracking from victim origin to target ATM cashout.
            </p>
          </div>

          {/* Top Control Bar: Case Selector & Dispatch */}
          <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-2xl backdrop-blur-xl">
            <select
              aria-label="Select NCRP Cyber Case for 3D Trace"
              value={selectedCaseId}
              onChange={(e) => {
                setSelectedCaseId(e.target.value);
                setActiveNode(null);
              }}
              className="bg-slate-950 text-sky-400 border border-slate-700/80 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer shadow-inner font-bold"
            >
              {Object.values(TRACE_CASES).map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => onDispatchAlert && onDispatchAlert()}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-rose-600/25 transition-all active:scale-95 flex items-center gap-1.5 uppercase cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>DISPATCH INTERCEPT</span>
            </button>
          </div>
        </div>

        {/* Main 3D Canvas Stage Container */}
        <div className="relative w-full h-[620px] rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl overflow-hidden group">

          {/* WebGL 3D Canvas Mount */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating Top Left Tactical Telemetry HUD */}
          <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 pointer-events-none">
            <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl space-y-1 pointer-events-auto max-w-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">ACTIVE TRACE CASE</span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-extrabold rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                  {currentCase.riskLevel}
                </span>
              </div>
              <div className="text-lg font-extrabold text-white font-mono tracking-tight flex items-center gap-2">
                {currentCase.id}
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {currentCase.title}
              </div>
              <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">TOTAL LAUNDERED</span>
                  <span className="text-emerald-400 font-bold">{currentCase.totalAmount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">ATM CASHOUT THREAT</span>
                  <span className="text-amber-400 font-bold">{currentCase.timeRemaining}</span>
                </div>
              </div>
            </div>

            {/* Quick Helper Legend */}
            <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md px-3 py-2 rounded-xl text-[11px] font-mono text-slate-400 flex items-center space-x-4 pointer-events-auto">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Victim
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Mule Account
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Target ATM
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Frozen
              </span>
            </div>
          </div>

          {/* Floating Top Right 3D Controls Toolbar */}
          <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2 pointer-events-auto">
            {/* View Mode Toggle */}
            <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-1.5 rounded-2xl shadow-xl flex items-center space-x-1">
              <button
                onClick={() => setViewMode('plane')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'plane'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D TACTICAL PLANE</span>
              </button>
              <button
                onClick={() => setViewMode('globe')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'globe'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>3D HOLO GLOBE</span>
              </button>
            </div>

            {/* Camera View Presets */}
            <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-2 rounded-2xl shadow-xl space-y-1.5">
              <div className="text-[10px] font-mono font-bold text-slate-500 px-1 uppercase">CAMERA ANGLE PRESETS</div>
              <div className="grid grid-cols-2 gap-1 font-mono text-[11px]">
                <button
                  onClick={() => setCameraPreset('OVERVIEW')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors text-left flex items-center gap-1"
                >
                  <Compass className="w-3 h-3 text-blue-400" />
                  <span>Pan-India</span>
                </button>
                <button
                  onClick={() => setCameraPreset('DELHI')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors text-left flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-sky-400" />
                  <span>Delhi North</span>
                </button>
                <button
                  onClick={() => setCameraPreset('JAMTARA')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors text-left flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Jamtara Hub</span>
                </button>
                <button
                  onClick={() => setCameraPreset('SOUTH')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors text-left flex items-center gap-1"
                >
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  <span>South ATM</span>
                </button>
              </div>
            </div>

            {/* Play/Pause & Auto Rotation Controls */}
            <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-1.5 rounded-2xl shadow-xl flex items-center justify-between space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPlaying ? 'PAUSE ARCS' : 'PLAY ARCS'}</span>
              </button>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1.5 rounded-xl border text-xs transition-colors ${
                  autoRotate
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Toggle 3D Orbit Auto-Rotate"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive 3D Node Dossier Modal Overlay when clicked */}
          <AnimatePresence>
            {activeNode && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-96 z-30 bg-slate-900/95 border border-slate-800 p-5 rounded-3xl shadow-2xl backdrop-blur-2xl space-y-4"
              >
                <div className="flex items-start justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">3D NODE DOSSIER</span>
                    <h3 className="text-base font-extrabold text-white font-sans flex items-center gap-2">
                      {activeNode.label}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveNode(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-mono"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-white font-semibold">{activeNode.city}, {activeNode.state}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-500">Bank / Entity:</span>
                    <span className="text-sky-400 font-semibold">{activeNode.bank}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-500">Account No / ATM ID:</span>
                    <span className="text-amber-400 font-mono">{activeNode.account}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-500">IFSC Code:</span>
                    <span className="text-slate-300">{activeNode.ifsc}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-500">Fund Amount:</span>
                    <span className="text-emerald-400 font-extrabold">{activeNode.amount}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Node Status:</span>
                    <span className={`font-bold ${frozenAccounts[activeNode.id] ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {frozenAccounts[activeNode.id] ? 'FROZEN BY APEX GW' : activeNode.status}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleFreeze(activeNode.id)}
                    className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-extrabold uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      frozenAccounts[activeNode.id]
                        ? 'bg-slate-800 text-slate-400 border border-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>{frozenAccounts[activeNode.id] ? 'UNFREEZE ACCOUNT' : 'INSTANT FREEZE ACCOUNT'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Left Control Instruction Hint */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-md">
              💡 Drag to Rotate 3D Pitch/Yaw • Scroll to Zoom • Click Node to Inspect & Freeze
            </span>
          </div>
        </div>

        {/* Bottom Case Hop Cards Bar across India */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {currentCase.nodes.map((node, i) => (
            <div
              key={node.id}
              onClick={() => setActiveNode(node)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                activeNode?.id === node.id
                  ? 'bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {frozenAccounts[node.id] && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-mono text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase">
                  FROZEN
                </div>
              )}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>HOP {i + 1} • {node.type.toUpperCase()}</span>
                <span className="text-sky-400 font-bold">{node.city}</span>
              </div>
              <div className="font-extrabold text-sm text-white font-sans truncate">
                {node.bank}
              </div>
              <div className="mt-2 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>{node.amount}</span>
                <span className="text-slate-500">{node.time}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
