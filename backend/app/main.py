from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import math
from datetime import datetime

app = FastAPI(
    title="P.R.A.H.A.R.I. Engine",
    description="Predictive Response Analytics for Hotspot Alert & Rapid Interception API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# SAMPLE DATA WITH GEOSPATIAL PATHS & MULE CHAINS
# -------------------------------------------------------------------

COMPLAINTS_DB = [
    {
        "complaint_id": "NCRP-2026-00417",
        "victim_name": "R. Sharma",
        "victim_city": "New Delhi",
        "amount": 85000,
        "fraud_type": "UPI Phishing Scam",
        "timestamp": "2026-09-20T10:14:00",
        "first_mule_account_id": "AC-2290 (ICICI Bank)",
        "chain": [
            {
                "account": "AC-8841 (Victim - R. Sharma)",
                "to": "AC-2290 (Mule-1 - ICICI)",
                "amount": 85000,
                "delay_min": 0,
                "loc": {"lat": 28.6280, "lng": 77.2189, "name": "Janpath, Delhi"}
            },
            {
                "account": "AC-2290 (Mule-1 - ICICI)",
                "to": "AC-7715 (Mule-2 - HDFC)",
                "amount": 82000,
                "delay_min": 8,
                "loc": {"lat": 28.6325, "lng": 77.2200, "name": "Barakhamba Road, Delhi"}
            },
            {
                "account": "AC-7715 (Mule-2 - HDFC)",
                "to": "ATM-CP-902 (CASH-OUT)",
                "amount": 80000,
                "delay_min": 22,
                "loc": {"lat": 28.6139, "lng": 77.2090, "name": "Connaught Place Hub, Delhi"}
            }
        ],
        "predicted_zone": {
            "lat": 28.6139,
            "lng": 77.2090,
            "area": "Connaught Place Outer Circle, New Delhi",
            "city": "Delhi",
            "risk_score": 0.84,
            "eta_min": 24,
            "atm_density_factor": 0.85,
            "nearby_atms": [
                {"name": "SBI ATM - Block C, CP", "lat": 28.6145, "lng": 77.2082, "risk": "High"},
                {"name": "HDFC ATM - Regal Building", "lat": 28.6130, "lng": 77.2101, "risk": "Critical"},
                {"name": "ICICI ATM - Palika Bazaar Gate 2", "lat": 28.6128, "lng": 77.2078, "risk": "High"}
            ]
        }
    },
    {
        "complaint_id": "NCRP-2026-00418",
        "victim_name": "P. Iyer",
        "victim_city": "Mumbai",
        "amount": 150000,
        "fraud_type": "Fake Stock Investment Scam",
        "timestamp": "2026-09-20T11:02:00",
        "first_mule_account_id": "AC-9910 (Axis Bank)",
        "chain": [
            {
                "account": "AC-3301 (Victim - P. Iyer)",
                "to": "AC-9910 (Mule-1 - Axis)",
                "amount": 150000,
                "delay_min": 0,
                "loc": {"lat": 19.1176, "lng": 72.8631, "name": "Andheri West, Mumbai"}
            },
            {
                "account": "AC-9910 (Mule-1 - Axis)",
                "to": "AC-5541 (Mule-2 - Canara)",
                "amount": 148000,
                "delay_min": 6,
                "loc": {"lat": 19.1120, "lng": 72.8710, "name": "MIDC Central, Mumbai"}
            },
            {
                "account": "AC-5541 (Mule-2 - Canara)",
                "to": "ATM-ANDH-04 (CASH-OUT)",
                "amount": 145000,
                "delay_min": 15,
                "loc": {"lat": 19.0760, "lng": 72.8777, "name": "Andheri East Metro Hub, Mumbai"}
            }
        ],
        "predicted_zone": {
            "lat": 19.0760,
            "lng": 72.8777,
            "area": "Andheri East Railway & Metro Station Zone, Mumbai",
            "city": "Mumbai",
            "risk_score": 0.92,
            "eta_min": 14,
            "atm_density_factor": 0.95,
            "nearby_atms": [
                {"name": "Axis Bank ATM - Andheri East Station", "lat": 19.0765, "lng": 72.8780, "risk": "Critical"},
                {"name": "Bank of Baroda ATM - Kurla Complex Rd", "lat": 19.0750, "lng": 72.8768, "risk": "High"}
            ]
        }
    },
    {
        "complaint_id": "NCRP-2026-00419",
        "victim_name": "K. Venkatesh",
        "victim_city": "Bengaluru",
        "amount": 230000,
        "fraud_type": "Instant Loan App Extortion",
        "timestamp": "2026-09-20T11:45:00",
        "first_mule_account_id": "AC-4412 (SBI)",
        "chain": [
            {
                "account": "AC-1092 (Victim - K. Venkatesh)",
                "to": "AC-4412 (Mule-1 - SBI)",
                "amount": 230000,
                "delay_min": 0,
                "loc": {"lat": 12.9716, "lng": 77.5946, "name": "MG Road, Bengaluru"}
            },
            {
                "account": "AC-4412 (Mule-1 - SBI)",
                "to": "AC-8819 (Mule-2 - Kotak)",
                "amount": 115000,
                "delay_min": 5,
                "loc": {"lat": 12.9352, "lng": 77.6245, "name": "Koramangala 5th Block, Bengaluru"}
            },
            {
                "account": "AC-4412 (Mule-1 - SBI)",
                "to": "AC-6632 (Mule-3 - PNB)",
                "amount": 110000,
                "delay_min": 7,
                "loc": {"lat": 12.9279, "lng": 77.6271, "name": "Silk Board Junction, Bengaluru"}
            },
            {
                "account": "AC-8819 (Mule-2 - Kotak)",
                "to": "ATM-KOR-88 (CASH-OUT)",
                "amount": 112000,
                "delay_min": 18,
                "loc": {"lat": 12.9340, "lng": 77.6101, "name": "Forum Mall ATM Cluster, Bengaluru"}
            }
        ],
        "predicted_zone": {
            "lat": 12.9340,
            "lng": 77.6101,
            "area": "Koramangala 7th Block ATM Corridor, Bengaluru",
            "city": "Bengaluru",
            "risk_score": 0.88,
            "eta_min": 20,
            "atm_density_factor": 0.90,
            "nearby_atms": [
                {"name": "Kotak ATM - 80 Feet Road", "lat": 12.9348, "lng": 77.6110, "risk": "Critical"},
                {"name": "SBI ATM - Forum Circle", "lat": 12.9332, "lng": 77.6095, "risk": "High"}
            ]
        }
    },
    {
        "complaint_id": "NCRP-2026-00420",
        "victim_name": "S. Mukherjee",
        "victim_city": "Kolkata",
        "amount": 62000,
        "fraud_type": "Electricity Bill Update Scam",
        "timestamp": "2026-09-20T12:30:00",
        "first_mule_account_id": "AC-7102 (Bandhan Bank)",
        "chain": [
            {
                "account": "AC-5519 (Victim - S. Mukherjee)",
                "to": "AC-7102 (Mule-1 - Bandhan)",
                "amount": 62000,
                "delay_min": 0,
                "loc": {"lat": 22.5726, "lng": 88.3639, "name": "Esplanade, Kolkata"}
            },
            {
                "account": "AC-7102 (Mule-1 - Bandhan)",
                "to": "AC-3398 (Mule-2 - UCO Bank)",
                "amount": 60000,
                "delay_min": 12,
                "loc": {"lat": 22.5800, "lng": 88.3700, "name": "Sealdah Station North, Kolkata"}
            },
            {
                "account": "AC-3398 (Mule-2 - UCO Bank)",
                "to": "ATM-SLD-12 (CASH-OUT)",
                "amount": 58000,
                "delay_min": 35,
                "loc": {"lat": 22.5697, "lng": 88.3697, "name": "Sealdah Commercial Zone, Kolkata"}
            }
        ],
        "predicted_zone": {
            "lat": 22.5697,
            "lng": 88.3697,
            "area": "Sealdah Station Commercial Market, Kolkata",
            "city": "Kolkata",
            "risk_score": 0.76,
            "eta_min": 38,
            "atm_density_factor": 0.75,
            "nearby_atms": [
                {"name": "UCO Bank ATM - Station Entrance", "lat": 22.5702, "lng": 88.3705, "risk": "High"},
                {"name": "PNB ATM - Baithakkhana Market", "lat": 22.5690, "lng": 88.3688, "risk": "Medium"}
            ]
        }
    }
]


# -------------------------------------------------------------------
# RISK ENGINE & EXPLAINABLE AI FORMULA
# -------------------------------------------------------------------

def calculate_risk_score(chain: List[Dict[str, Any]], predicted_zone: Dict[str, Any]) -> Dict[str, Any]:
    """
    P.R.A.H.A.R.I. Simulated Risk Engine
    risk_score = 0.4 * (1 - normalized_time_since_last_hop) + 0.3 * (chain_length / 3) + 0.3 * atm_density_factor
    """
    chain_length = len(chain)
    
    last_delay = chain[-1]["delay_min"] if chain else 10
    total_delay = sum(item["delay_min"] for item in chain)
    
    normalized_time = max(0.0, min(1.0, last_delay / 60.0))
    time_factor = 1.0 - normalized_time
    
    length_factor = min(1.0, chain_length / 3.0)
    
    atm_density = float(predicted_zone.get("atm_density_factor", 0.8))
    
    raw_score = (0.4 * time_factor) + (0.3 * length_factor) + (0.3 * atm_density)
    clamped_score = max(0.0, min(1.0, raw_score))
    
    return {
        "risk_score": round(clamped_score, 4),
        "percentage": f"{round(clamped_score * 100, 1)}%",
        "risk_level": "CRITICAL" if clamped_score > 0.85 else ("HIGH" if clamped_score > 0.70 else "MEDIUM"),
        "formula_breakdown": {
            "time_velocity_component": {
                "weight": "40%",
                "value": round(0.4 * time_factor, 4),
                "last_hop_delay_min": last_delay,
                "explanation": f"Rapid transfer velocity detected ({last_delay}m lag between final hops)."
            },
            "mule_chain_depth_component": {
                "weight": "30%",
                "value": round(0.3 * length_factor, 4),
                "hops_count": chain_length,
                "explanation": f"{chain_length} multi-hop mule accounts detected (Layer-2/3 evasion pattern)."
            },
            "spatial_atm_density_component": {
                "weight": "30%",
                "value": round(0.3 * atm_density, 4),
                "density_index": atm_density,
                "explanation": f"High density withdrawal zone ({int(atm_density*100)}% ATM proximity index)."
            }
        },
        "explainable_summary": f"This case presents a {round(clamped_score * 100)}% withdrawal risk due to ultra-fast transfer velocity ({last_delay} mins between hops), multi-hop layer evasion across {chain_length} accounts, and high commercial ATM density in {predicted_zone.get('area')}."
    }

# -------------------------------------------------------------------
# ENDPOINTS
# -------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "system": "P.R.A.H.A.R.I. Cybercrime Cash Interception Engine",
        "status": "ONLINE",
        "version": "1.0.0",
        "endpoints": [
            "/api/complaints",
            "/api/complaints/{id}",
            "/api/complaints/{id}/graph",
            "/api/complaints/{id}/predict",
            "/api/complaints/{id}/alert"
        ]
    }

@app.get("/api/complaints")
def get_complaints():
    return [
        {
            "complaint_id": c["complaint_id"],
            "victim_name": c["victim_name"],
            "victim_city": c["victim_city"],
            "amount": c["amount"],
            "fraud_type": c["fraud_type"],
            "timestamp": c["timestamp"],
            "first_mule_account_id": c["first_mule_account_id"],
            "predicted_area": c["predicted_zone"]["area"],
            "predicted_risk_score": c["predicted_zone"]["risk_score"]
        }
        for c in COMPLAINTS_DB
    ]

@app.get("/api/complaints/{complaint_id}")
def get_complaint_by_id(complaint_id: str):
    complaint = next((c for c in COMPLAINTS_DB if c["complaint_id"].lower() == complaint_id.lower()), None)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint ID not found")
    return complaint

@app.get("/api/complaints/{complaint_id}/graph")
def get_complaint_graph(complaint_id: str):
    complaint = next((c for c in COMPLAINTS_DB if c["complaint_id"].lower() == complaint_id.lower()), None)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint ID not found")
    
    chain = complaint["chain"]
    nodes = []
    edges = []
    visited_nodes = set()
    
    for idx, step in enumerate(chain):
        src = step["account"]
        dst = step["to"]
        
        if src not in visited_nodes:
            visited_nodes.add(src)
            is_victim = idx == 0
            nodes.append({
                "id": src,
                "label": src,
                "type": "VICTIM" if is_victim else "MULE",
                "bank": src.split("(")[-1].replace(")", "") if "(" in src else "Bank",
                "lat": step["loc"]["lat"],
                "lng": step["loc"]["lng"],
                "loc_name": step["loc"]["name"]
            })
            
        if dst not in visited_nodes:
            visited_nodes.add(dst)
            is_cashout = "CASH-OUT" in dst or idx == len(chain) - 1
            nodes.append({
                "id": dst,
                "label": dst,
                "type": "CASHOUT" if is_cashout else "MULE",
                "bank": "ATM Terminal" if is_cashout else (dst.split("(")[-1].replace(")", "") if "(" in dst else "Bank"),
                "lat": complaint["predicted_zone"]["lat"] if is_cashout else step["loc"]["lat"],
                "lng": complaint["predicted_zone"]["lng"] if is_cashout else step["loc"]["lng"],
                "loc_name": complaint["predicted_zone"]["area"] if is_cashout else step["loc"]["name"]
            })
            
        edges.append({
            "id": f"edge-{idx}",
            "from": src,
            "to": dst,
            "amount": f"₹{step['amount']:,}",
            "raw_amount": step["amount"],
            "delay_min": step["delay_min"],
            "label": f"₹{step['amount']:,} ({step['delay_min']}m delay)"
        })
        
    return {
        "complaint_id": complaint_id,
        "total_stolen": complaint["amount"],
        "chain_length": len(chain),
        "nodes": nodes,
        "edges": edges
    }

@app.get("/api/complaints/{complaint_id}/predict")
def get_complaint_prediction(complaint_id: str):
    complaint = next((c for c in COMPLAINTS_DB if c["complaint_id"].lower() == complaint_id.lower()), None)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint ID not found")
    
    risk_evaluation = calculate_risk_score(complaint["chain"], complaint["predicted_zone"])
    
    geo_path = []
    for step in complaint["chain"]:
        geo_path.append({
            "name": step["account"],
            "lat": step["loc"]["lat"],
            "lng": step["loc"]["lng"],
            "type": "origin" if step == complaint["chain"][0] else "mule_hop",
            "loc_name": step["loc"]["name"],
            "amount": step["amount"],
            "delay_min": step["delay_min"]
        })
    geo_path.append({
        "name": complaint["chain"][-1]["to"],
        "lat": complaint["predicted_zone"]["lat"],
        "lng": complaint["predicted_zone"]["lng"],
        "type": "predicted_cashout",
        "loc_name": complaint["predicted_zone"]["area"],
        "amount": complaint["chain"][-1]["amount"],
        "delay_min": complaint["chain"][-1]["delay_min"]
    })
    
    return {
        "complaint_id": complaint["complaint_id"],
        "victim_name": complaint["victim_name"],
        "fraud_type": complaint["fraud_type"],
        "predicted_zone": complaint["predicted_zone"],
        "risk_evaluation": risk_evaluation,
        "geospatial_path": geo_path,
        "golden_window_eta_min": complaint["predicted_zone"]["eta_min"]
    }

class AlertRequest(BaseModel):
    lea_unit: Optional[str] = "Delhi Cyber Cell - Patrol Wing 4"
    bank_code: Optional[str] = "ICICI/HDFC Automated Gateway"
    notes: Optional[str] = "Immediate lien hold requested"

@app.post("/api/complaints/{complaint_id}/alert")
def trigger_alert(complaint_id: str, payload: Optional[AlertRequest] = None):
    complaint = next((c for c in COMPLAINTS_DB if c["complaint_id"].lower() == complaint_id.lower()), None)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint ID not found")
    
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    lea_unit = payload.lea_unit if payload else f"{complaint['victim_city']} Cyber Cell"
    
    return {
        "status": "DISPATCHED",
        "timestamp": now_str,
        "complaint_id": complaint["complaint_id"],
        "victim_name": complaint["victim_name"],
        "alert_id": f"ALT-PRAHARI-{complaint_id.split('-')[-1]}",
        "messages": [
            {
                "channel": "SMS / Twilio LEA Broadcast",
                "recipient": f"+91-987654XXXX ({lea_unit})",
                "content": f"🚨 P.R.A.H.A.R.I. ALERT: Fraud ₹{complaint['amount']:,} moving to {complaint['predicted_zone']['area']}. ETA {complaint['predicted_zone']['eta_min']} mins! Intercept Patrol Dispatched.",
                "status": "DELIVERED"
            },
            {
                "channel": "I4C / Bank Core Automated Webhook",
                "recipient": f"Bank Core API ({complaint['first_mule_account_id']})",
                "content": f"⚡ EMERGENCY LIEN HOLD PLACED on mule accounts. Account Freeze ID: FRZ-{complaint_id}",
                "status": "SUCCESS"
            }
        ],
        "metrics": {
            "prahari_response_time_min": 3.2,
            "industry_avg_response_time_hours": 4.5,
            "time_saved_percentage": "98.8%",
            "golden_window_status": "INTERCEPTED IN TIME"
        }
    }
