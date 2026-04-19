#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo " ============================================================"
echo "   AIGENDA - AI Event Planner"
echo "   Starting 2 servers (merged backend)..."
echo " ============================================================"
echo ""

# ── Check Python ──────────────────────────────────────────────────────────────
PYTHON=$(command -v python3 2>/dev/null || command -v python 2>/dev/null)
[ -z "$PYTHON" ] && { echo " [ERROR] Python not found. Install: https://python.org"; exit 1; }

# ── Install deps ──────────────────────────────────────────────────────────────
echo " [1/4] Installing React frontend dependencies..."
cd "$SCRIPT_DIR/ai-genda" && npm install --silent

echo " [2/4] Installing Python backend dependencies..."
cd "$SCRIPT_DIR/backend"
$PYTHON -m pip install -r requirements.txt -q 2>/dev/null || pip3 install -r requirements.txt -q 2>/dev/null || true

# ── Helper to open a terminal window ─────────────────────────────────────────
open_term() {
    local TITLE="$1"
    local CMD="$2"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"Terminal\" to do script \"echo '$TITLE'; $CMD\""
    else
        gnome-terminal --title="$TITLE" -- bash -c "$CMD; exec bash" 2>/dev/null \
        || xterm -title "$TITLE" -e bash -c "$CMD; exec bash" 2>/dev/null \
        || bash -c "$CMD" &
    fi
}

echo " [3/4] Launching servers..."

open_term "Aigenda | Python Backend (5001)"  "cd '$SCRIPT_DIR/backend' && $PYTHON server.py"
sleep 1
open_term "Aigenda | React Frontend (3000)"  "cd '$SCRIPT_DIR/ai-genda' && npm start"

echo " [4/4] Done!"
echo ""
echo " ============================================================"
echo "   React App     ->  http://localhost:3000"
echo "   Python API    ->  http://localhost:5001"
echo "   Production    ->  https://aigenda.onrender.com"
echo " ============================================================"
echo ""
echo "   Test accounts:"
echo "   Alice/alice1234   Bob/bob5678"
echo "   Adhi/nandha123    Dev/nandha123"
echo " ============================================================"
