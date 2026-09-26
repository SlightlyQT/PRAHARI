const API_BASE = '/api';

export async function fetchComplaints() {
  try {
    const res = await fetch(`${API_BASE}/complaints`);
    if (!res.ok) throw new Error('Failed to fetch complaints');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchComplaints:', err);
    return [
      {
        complaint_id: "NCRP-2026-00417",
        victim_name: "R. Sharma",
        victim_city: "New Delhi",
        amount: 85000,
        fraud_type: "UPI Phishing Scam",
        timestamp: "2026-09-20T10:14:00",
        first_mule_account_id: "AC-2290 (ICICI Bank)",
        predicted_area: "Connaught Place Outer Circle, New Delhi",
        predicted_risk_score: 0.84
      },
      {
        complaint_id: "NCRP-2026-00418",
        victim_name: "P. Iyer",
        victim_city: "Mumbai",
        amount: 150000,
        fraud_type: "Fake Stock Investment Scam",
        timestamp: "2026-09-20T11:02:00",
        first_mule_account_id: "AC-9910 (Axis Bank)",
        predicted_area: "Andheri East Metro Hub, Mumbai",
        predicted_risk_score: 0.92
      },
      {
        complaint_id: "NCRP-2026-00419",
        victim_name: "K. Venkatesh",
        victim_city: "Bengaluru",
        amount: 230000,
        fraud_type: "Instant Loan App Extortion",
        timestamp: "2026-09-20T11:45:00",
        first_mule_account_id: "AC-4412 (SBI)",
        predicted_area: "Koramangala 7th Block ATM Corridor, Bengaluru",
        predicted_risk_score: 0.88
      },
      {
        complaint_id: "NCRP-2026-00420",
        victim_name: "S. Mukherjee",
        victim_city: "Kolkata",
        amount: 62000,
        fraud_type: "Electricity Bill Update Scam",
        timestamp: "2026-09-20T12:30:00",
        first_mule_account_id: "AC-7102 (Bandhan Bank)",
        predicted_area: "Sealdah Station Commercial Market, Kolkata",
        predicted_risk_score: 0.76
      }
    ];
  }
}

export async function fetchComplaintById(id) {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    if (!res.ok) throw new Error('Failed to fetch complaint details');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchComplaintById:', err);
    // Bulletproof Mock Fallback for MVP
    const mocks = {
      "NCRP-2026-00417": {
        "complaint_id": "NCRP-2026-00417",
        "victim_name": "R. Sharma",
        "victim_city": "New Delhi",
        "amount": 85000,
        "first_mule_account_id": "AC-2290 (ICICI Bank)",
        "chain": [
          { "account": "Victim", "amount": 85000, "loc": {"lat": 28.6280, "lng": 77.2189, "name": "Janpath, Delhi"} },
          { "account": "Mule-1", "amount": 82000, "loc": {"lat": 28.6315, "lng": 77.2215, "name": "Barakhamba Road, Delhi"} },
          { "account": "Mule-2", "amount": 80000, "loc": {"lat": 28.6328, "lng": 77.2177, "name": "Connaught Place Radial"} },
          { "account": "CASH-OUT", "amount": 80000, "loc": {"lat": 28.6312, "lng": 77.2148, "name": "Regal Building Hub, Delhi"} }
        ],
        "predicted_zone": { "lat": 28.6312, "lng": 77.2148, "area": "Regal Building ATM Hub, CP Outer Circle", "risk_score": 0.84 }
      },
      "NCRP-2026-00418": {
        "complaint_id": "NCRP-2026-00418",
        "victim_name": "P. Iyer",
        "victim_city": "Mumbai",
        "amount": 150000,
        "first_mule_account_id": "AC-9910 (Axis Bank)",
        "chain": [
          { "account": "Victim", "amount": 150000, "loc": {"lat": 19.1176, "lng": 72.8360, "name": "Andheri West, Mumbai"} },
          { "account": "Mule-1", "amount": 148000, "loc": {"lat": 19.1120, "lng": 72.8680, "name": "MIDC Central, Mumbai"} },
          { "account": "Mule-2", "amount": 145000, "loc": {"lat": 19.1140, "lng": 72.8710, "name": "Andheri Hub, Mumbai"} },
          { "account": "CASH-OUT", "amount": 145000, "loc": {"lat": 19.1190, "lng": 72.8690, "name": "Andheri East Metro Hub, Mumbai"} }
        ],
        "predicted_zone": { "lat": 19.1190, "lng": 72.8690, "area": "Andheri East Metro Hub, Mumbai", "risk_score": 0.92 }
      },
      "NCRP-2026-00419": {
        "complaint_id": "NCRP-2026-00419",
        "victim_name": "K. Venkatesh",
        "victim_city": "Bengaluru",
        "amount": 230000,
        "first_mule_account_id": "AC-4412 (SBI)",
        "chain": [
          { "account": "Victim", "amount": 230000, "loc": {"lat": 12.9730, "lng": 77.6080, "name": "MG Road, Bengaluru"} },
          { "account": "Mule-1", "amount": 115000, "loc": {"lat": 12.9350, "lng": 77.6200, "name": "Koramangala 5th Block"} },
          { "account": "Mule-2", "amount": 110000, "loc": {"lat": 12.9180, "lng": 77.6240, "name": "Silk Board Junction"} },
          { "account": "CASH-OUT", "amount": 112000, "loc": {"lat": 12.9340, "lng": 77.6110, "name": "Forum Mall ATM Corridor"} }
        ],
        "predicted_zone": { "lat": 12.9340, "lng": 77.6110, "area": "Forum Mall ATM Corridor, Bengaluru", "risk_score": 0.88 }
      },
      "NCRP-2026-00420": {
        "complaint_id": "NCRP-2026-00420",
        "victim_name": "S. Mukherjee",
        "victim_city": "Kolkata",
        "amount": 62000,
        "first_mule_account_id": "AC-7102 (Bandhan Bank)",
        "chain": [
          { "account": "Victim", "amount": 62000, "loc": {"lat": 22.5640, "lng": 88.3530, "name": "Esplanade, Kolkata"} },
          { "account": "Mule-1", "amount": 60000, "loc": {"lat": 22.5730, "lng": 88.3690, "name": "Sealdah North, Kolkata"} },
          { "account": "Mule-2", "amount": 58000, "loc": {"lat": 22.5690, "lng": 88.3680, "name": "Baithakkhana Market"} },
          { "account": "CASH-OUT", "amount": 58000, "loc": {"lat": 22.5680, "lng": 88.3710, "name": "Sealdah Commercial Market"} }
        ],
        "predicted_zone": { "lat": 22.5680, "lng": 88.3710, "area": "Sealdah Commercial Market, Kolkata", "risk_score": 0.76 }
      }
    };
    return mocks[id] || mocks["NCRP-2026-00417"];
  }
}

export async function fetchComplaintGraph(id) {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}/graph`);
    if (!res.ok) throw new Error('Failed to fetch graph');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchComplaintGraph:', err);
    return null;
  }
}

export async function fetchComplaintPrediction(id) {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}/predict`);
    if (!res.ok) throw new Error('Failed to fetch prediction');
    return await res.json();
  } catch (err) {
    console.error('API Error fetchComplaintPrediction:', err);
    return null;
  }
}

export async function triggerAlert(id, payload = {}) {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}/alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to trigger alert');
    return await res.json();
  } catch (err) {
    console.error('API Error triggerAlert:', err);
    return null;
  }
}
