# Aigenda — AI-Powered Event Planner

## Structure

```
aigenda/
├── ai-genda/              ← React frontend (port 3000)
├── backend/               ← Python Flask + XGBoost — auth, events & AI (port 5001)
├── START.bat              ← Windows: double-click to run everything
└── start.sh               ← Mac/Linux: ./start.sh
```

---

## Run Locally

### Requirements
- [Python](https://python.org) 3.8+
- [Node.js](https://nodejs.org) v16+ (for React frontend)

### Windows
Double-click **`START.bat`**

### Mac / Linux
```bash
chmod +x start.sh
./start.sh
```

### Manual (2 terminals)

**Terminal 1:**
```bash
cd backend
pip install -r requirements.txt
python server.py
```

**Terminal 2:**
```bash
cd ai-genda
npm install
npm start
```

Open **http://localhost:3000**

---

## Test Accounts

| Username | Password |
|---|---|
| Alice | alice1234 |
| Bob | bob5678 |
| Adhi | nandha123 |
| Dev | nandha123 |

---

## How the AI Works

The `backend/event_recommender_model.pkl` is a trained **XGBoost Regressor**.

**Inputs → Output:**
| Input | Example |
|---|---|
| event_type | Graduation, Wedding, Birthday... |
| event_theme | Black and Gold, Candlelight, Retro... |
| city | Kochi, Bangalore, Delhi... |
| total_budget | avg of your min/max |

**→ Predicts:** venue cost in ₹

The backend then produces 3 plans around the prediction:
- **Budget-Friendly** = prediction × 0.65
- **Recommended** = raw XGBoost prediction
- **Premium** = prediction × 1.40

Each plan includes a full budget breakdown: venue, catering, decoration, entertainment, logistics, misc.

---

## Deploy to Production

### Backend → Render
- Point to `backend/`
- Start command: `python server.py`
- Render URL: **https://aigenda.onrender.com**
- Make sure `event_recommender_model.pkl` is included

### Frontend → Vercel / Netlify
```bash
cd ai-genda
npm run build
# Upload the build/ folder to Vercel or Netlify
```

All API calls in the frontend already point to `https://aigenda.onrender.com`.

---

## GitHub

```bash
git init
git add .
git commit -m "Initial commit - Aigenda AI Event Planner"
git remote add origin https://github.com/YOUR_USERNAME/aigenda.git
git push -u origin main
```

Add a `.gitignore`:
```
node_modules/
__pycache__/
*.pyc
.env
build/
*.log
```
