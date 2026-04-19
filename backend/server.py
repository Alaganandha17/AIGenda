"""
Aigenda Python AI Backend
=========================
Port: 5001
Endpoint: POST /api/plan-event

Uses the trained XGBoost model (event_recommender_model.pkl) to predict
venue cost from 4 features: event_type, event_theme, city, total_budget.
Returns 3 tiered plans: Budget-Friendly, Recommended, Premium.
"""

import json
import logging
import warnings
from pathlib import Path

import joblib
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS

warnings.filterwarnings("ignore")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("server.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

BASE_DIR    = Path(__file__).parent
DATAS_DIR   = BASE_DIR / "datas"
USERS_FILE  = DATAS_DIR / "users.json"
EVENTS_FILE = DATAS_DIR / "events.json"
MODEL_FILE  = BASE_DIR / "event_recommender_model.pkl"

DATAS_DIR.mkdir(exist_ok=True)

# ── Load model ────────────────────────────────────────────────────────────────
logger.info("Loading XGBoost model...")
_pkl      = joblib.load(MODEL_FILE)
_model    = _pkl["model"]
_encoders = _pkl["encoders"]   # event_type, event_theme, city
_features = _pkl["features"]   # ['event_type','event_theme','city','total_budget']
logger.info("Model ready. Features: %s", _features)
logger.info("event_type values:  %s", list(_encoders["event_type"].classes_))
logger.info("event_theme values: %s", list(_encoders["event_theme"].classes_))
logger.info("city values:        %s", list(_encoders["city"].classes_))

# ── Helpers ───────────────────────────────────────────────────────────────────
def parse_budget(value) -> float:
    if isinstance(value, (int, float)):
        return float(value)
    s = str(value).replace("₹", "").replace(",", "").strip().upper()
    if s.endswith("CR"):  return float(s[:-2]) * 10_000_000
    if s.endswith("L"):   return float(s[:-1]) * 100_000
    return float(s)

def fmt(amount: float) -> str:
    return f"₹{float(amount):,.2f}"

def parse_guests(value) -> int:
    if isinstance(value, int): return value
    s = str(value).strip()
    if "-" in s:
        parts = s.split("-")
        try: return (int(parts[0]) + int(parts[1])) // 2
        except: pass
    if s.lower().startswith("below"):
        try: return max(50, int(s.split()[-1]) // 2)
        except: pass
    if s.lower().startswith("above"):
        try: return int(int(s.split()[-1]) * 1.2)
        except: pass
    try: return int(s)
    except: return 200

def encode(encoder, value: str) -> int:
    classes = list(encoder.classes_)
    if value in classes:
        return int(encoder.transform([value])[0])
    lower = value.lower()
    for cls in classes:
        if lower in cls.lower() or cls.lower() in lower:
            logger.warning("'%s' not found, using '%s'", value, cls)
            return int(encoder.transform([cls])[0])
    logger.warning("'%s' not found at all, defaulting to 0", value)
    return 0

def predict_venue_cost(event_type, event_theme, city, total_budget) -> float:
    et  = encode(_encoders["event_type"],  event_type)
    eth = encode(_encoders["event_theme"], event_theme)
    cit = encode(_encoders["city"],        city)
    X   = np.array([[et, eth, cit, total_budget]])
    cost = float(_model.predict(X)[0])
    logger.info("XGBoost: %s / %s / %s / budget=%.0f → venue=%.0f",
                event_type, event_theme, city, total_budget, cost)
    return cost

_RATIOS = {
    "wedding":    {"venue":0.40,"catering":0.30,"decoration":0.12,"entertainment":0.08,"logistics":0.07,"misc":0.03},
    "corporate":  {"venue":0.35,"catering":0.25,"decoration":0.10,"entertainment":0.12,"logistics":0.12,"misc":0.06},
    "birthday":   {"venue":0.35,"catering":0.28,"decoration":0.15,"entertainment":0.12,"logistics":0.07,"misc":0.03},
    "graduation": {"venue":0.38,"catering":0.30,"decoration":0.12,"entertainment":0.10,"logistics":0.07,"misc":0.03},
    "anniversary":{"venue":0.40,"catering":0.28,"decoration":0.15,"entertainment":0.08,"logistics":0.06,"misc":0.03},
    "conference": {"venue":0.40,"catering":0.20,"decoration":0.08,"entertainment":0.10,"logistics":0.17,"misc":0.05},
}
_DEFAULT = {"venue":0.40,"catering":0.28,"decoration":0.12,"entertainment":0.10,"logistics":0.07,"misc":0.03}

def budget_breakdown(event_type, venue_cost, total_budget) -> dict:
    ratios    = _RATIOS.get(event_type.lower(), _DEFAULT)
    remaining = max(0.0, total_budget - venue_cost)
    non_venue = sum(v for k, v in ratios.items() if k != "venue")
    result    = {"venue": {"amount": venue_cost, "formatted": fmt(venue_cost),
                           "percentage": f"{venue_cost/total_budget*100:.1f}%"}}
    for key, ratio in ratios.items():
        if key == "venue": continue
        amt = remaining * (ratio / non_venue)
        result[key] = {"amount": amt, "formatted": fmt(amt),
                       "percentage": f"{amt/total_budget*100:.1f}%"}
    return result

def load_json(path):
    if not path.exists(): return []
    with open(path, "r", encoding="utf-8") as f: return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f: json.dump(data, f, indent=2, ensure_ascii=False)

# ── Auth routes (mirror of Node backend, for deploy flexibility) ──────────────
@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        if not all(f in data for f in ("name","email","password")):
            return jsonify({"success":False,"message":"Missing fields"}), 400
        users = load_json(USERS_FILE)
        if any(u["email"] == data["email"] for u in users):
            return jsonify({"success":False,"message":"Email already registered"}), 400
        users.append({"name":data["name"],"email":data["email"],"password":data["password"]})
        save_json(USERS_FILE, users)
        return jsonify({"success":True,"message":"Signup successful!"}), 201
    except Exception as e:
        return jsonify({"success":False,"message":str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        users = load_json(USERS_FILE)
        user  = next((u for u in users if u["name"]==data.get("username") and u["password"]==data.get("password")), None)
        if not user: return jsonify({"error":"Invalid username or password"}), 401
        return jsonify({"message":"Login successful!","user":{"name":user["name"],"email":user["email"]}}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@app.route("/events", methods=["GET"])
def get_all_events():
    return jsonify(load_json(EVENTS_FILE)), 200

@app.route("/events/<string:username>", methods=["GET"])
def get_user_events(username):
    events = [e for e in load_json(EVENTS_FILE) if e.get("name") == username]
    return jsonify(events), 200

@app.route("/events", methods=["POST"])
def add_event():
    try:
        event_data = request.get_json()
        events = load_json(EVENTS_FILE)
        events.append(event_data)
        save_json(EVENTS_FILE, events)
        return jsonify({"message":"Event saved!","event":event_data}), 201
    except Exception as e:
        return jsonify({"error":str(e)}), 500

# ── Main AI endpoint ──────────────────────────────────────────────────────────
@app.route("/api/plan-event", methods=["POST"])
def plan_event():
    try:
        data = request.get_json()
        logger.info("plan-event: %s", data)

        required = {"eventType","theme","city","guestCount","minBudget","maxBudget"}
        missing  = required - set(data.keys())
        if missing:
            return jsonify({"error": f"Missing: {missing}"}), 400

        event_type  = data["eventType"]
        theme       = data["theme"]
        city        = data["city"]
        guests      = parse_guests(data["guestCount"])
        min_b       = parse_budget(data["minBudget"])
        max_b       = parse_budget(data["maxBudget"])
        avg_b       = (min_b + max_b) / 2

        predicted = predict_venue_cost(event_type, theme, city, avg_b)

        # Each tier has a genuinely different venue cost AND total event spend.
        # Total spend is derived by: total = venue_cost / venue_ratio
        # so if venue is 38% of total, then total = venue / 0.38
        # Budget-Friendly always < Recommended < Premium in both venue and total.
        ratios_for_event = _RATIOS.get(event_type.lower(), _DEFAULT)
        venue_ratio = ratios_for_event.get("venue", 0.40)

        # Tier multipliers for venue cost
        vc_budget    = predicted * 0.65   # 65% of prediction
        vc_recommend = predicted           # exact prediction
        vc_premium   = predicted * 1.40   # 140% of prediction

        # Derive realistic total event spend from venue cost
        total_budget    = vc_budget    / venue_ratio
        total_recommend = vc_recommend / venue_ratio
        total_premium   = vc_premium   / venue_ratio

        tiers = [
            {"tier":"Budget-Friendly", "desc":f"Affordable option for your {event_type} in {city}",
             "venue_cost": vc_budget, "total": total_budget, "rating": 4.0},
            {"tier":"Recommended",     "desc":f"Best-fit prediction for {theme} {event_type}",
             "venue_cost": vc_recommend, "total": total_recommend, "rating": 4.4},
            {"tier":"Premium",         "desc":f"Upscale experience for your {theme} {event_type} in {city}",
             "venue_cost": vc_premium, "total": total_premium, "rating": 4.8},
        ]

        plans = []
        for t in tiers:
            vc    = t["venue_cost"]
            tot   = t["total"]
            alloc = budget_breakdown(event_type, vc, tot)
            plans.append({
                "tier":             t["tier"],
                "description":      t["desc"],
                "rating":           t["rating"],
                "venue_cost":       vc,
                "venue_cost_fmt":   fmt(vc),
                "total_spend":      tot,
                "total_budget_fmt": fmt(tot),
                "guest_count":      guests,
                "budget_allocation":alloc,
            })

        return jsonify({
            "status":                  "success",
            "xgboost_raw_prediction":  fmt(predicted),
            "event_details": {
                "eventType": event_type, "theme": theme,
                "city": city, "guestCount": guests,
                "minBudget": fmt(min_b), "maxBudget": fmt(max_b),
            },
            "plans": plans,
        }), 200

    except Exception as e:
        logger.exception("plan-event error")
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status":"ok","message":"Aigenda Python AI backend running on port (configured by Render via PORT env var)"}), 200

if __name__ == "__main__":
    logger.info("Starting Aigenda Python AI backend on http://0.0.0.0")
    import os
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
