# Aigenda — AI-Powered Event Planner

## Structure

```
aigenda/
├── ai-genda/              ← React frontend (port 3000)
├── login-op-backend/      ← Node.js backend — auth + event storage (port 5000)
├── ai-genda-backend/      ← Python Flask + XGBoost AI backend (port 5001)
├── START.bat              ← Windows: double-click to run everything
└── start.sh               ← Mac/Linux: ./start.sh
```

---

## Run Locally

### Requirements
- [Node.js](https://nodejs.org) v16+
- [Python](https://python.org) 3.8+

### Windows
Double-click **`START.bat`**

### Mac / Linux
```bash
chmod +x start.sh
./start.sh
```

### Manual (3 terminals)

**Terminal 1:**
```bash
cd login-op-backend
npm install
node server.js
```

**Terminal 2:**
```bash
cd ai-genda-backend
pip install -r requirements.txt
python server.py
```

**Terminal 3:**
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

The `ai-genda-backend/event_recommender_model.pkl` is a trained **XGBoost Regressor**.

**Inputs → Output:**
| Input | Example |
|---|---|
| event_type | Graduation, Wedding, Birthday... |
| event_theme | Black and Gold, Candlelight, Retro... |
| city | Kochi, Bangalore, Delhi... |
| total_budget | avg of your min/max |

**→ Predicts:** venue cost in ₹

The backend then produces 3 plans around the prediction:
- **Budget-Friendly** = prediction × 0.75
- **Recommended** = raw XGBoost prediction
- **Premium** = prediction × 1.30

Each plan includes a full budget breakdown: venue, catering, decoration, entertainment, logistics, misc.

---

## Deploy to Production

### Frontend → Vercel / Netlify
```bash
cd ai-genda
npm run build
# Upload the build/ folder to Vercel or Netlify
```
Then update these two lines in `FinalPage.js` to point to your deployed backends:
```js
await axios.post("http://localhost:5000/events", ...)      // → your Node URL
await axios.post("http://localhost:5001/api/plan-event", .) // → your Python URL
```

### Node Backend → Railway / Render
- Point to `login-op-backend/`
- Start command: `node server.js`
- Port: `5000`

### Python Backend → Railway / Render / Fly.io
- Point to `ai-genda-backend/`
- Start command: `python server.py`
- Port: `5001`
- Make sure `event_recommender_model.pkl` is included

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
