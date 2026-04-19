import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import bgImage from "../images/bg.jpg";
import { useEvent } from "./EventContext";

const parseBudgetRange = (r) => {
  if (!r) return { min: 100000, max: 1000000 };
  const s = r.replace(/₹/g,"").replace(/\s/g,"").toUpperCase();
  if (s.startsWith("<")) { const v=parseAmt(s.slice(1)); return { min:v*0.5, max:v }; }
  const p = s.split("-");
  if (p.length===2) return { min:parseAmt(p[0]), max:parseAmt(p[1]) };
  const v=parseAmt(s); return { min:v*0.8, max:v*1.2 };
};
const parseAmt = (s) => {
  if (s.endsWith("CR")) return parseFloat(s)*10000000;
  if (s.endsWith("L"))  return parseFloat(s)*100000;
  return parseFloat(s)||100000;
};

const TIER_CONFIG = {
  "Budget-Friendly": { color:"#22c55e" },
  "Recommended":     { color:"#f97316" },
  "Premium":         { color:"#a855f7" },
};

const CAT_LABELS = {
  venue:"Venue", catering:"Catering", decoration:"Decoration",
  entertainment:"Entertainment", logistics:"Logistics", misc:"Miscellaneous"
};

const ExistingPlans = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const [events, setEvents] = useState([]);
  const { setEventPlanResponse } = useEvent();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [aiPlans, setAiPlans] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

const userName = loggedInUser?.name;
useEffect(() => {
  axios.get(`http://localhost:5000/events/${userName}`)
    .then((r) => setEvents(r.data))
    .catch(() => {});
}, [userName]);

  const viewPlan = async (event) => {
    setSelectedEvent(event);
    setAiPlans(null);
    setLoadingAI(true);
    try {
      const { min, max } = parseBudgetRange(event.budgetRange);
      const res = await axios.post("http://localhost:5001/api/plan-event", {
        eventType: event.eventType||"Birthday", theme: event.theme||"Classic",
        city: event.city||"Bangalore", guestCount: event.guestCount||"200",
        minBudget: min, maxBudget: max,
      });
      setAiPlans(res.data);
      setEventPlanResponse(res.data);
    } catch { /* AI offline */ }
    setLoadingAI(false);
  };

  const chip = (label, val) => val ? (
    <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:"8px", padding:"6px 12px",
      display:"flex", flexDirection:"column", gap:"2px" }}>
      <span style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</span>
      <span style={{ fontSize:"0.82rem", fontWeight:"600", color:"#fff" }}>{val}</span>
    </div>
  ) : null;

  return (
    <div style={{ minHeight:"100vh",
      background:`linear-gradient(rgba(0,0,0,0.78),rgba(0,0,0,0.78)),url(${bgImage}) center/cover fixed`,
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"40px 20px", boxSizing:"border-box", fontFamily:"'Inter',sans-serif" }}>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"32px" }}>
        <h1 style={{ color:"#fff", fontSize:"clamp(1.6rem,3vw,2.2rem)", fontWeight:"800",
          margin:0, letterSpacing:"-0.01em" }}>
          Welcome back, {loggedInUser?.name}
        </h1>
        <p style={{ color:"rgba(255,255,255,0.4)", marginTop:"6px", fontSize:"0.9rem", margin:"6px 0 0" }}>
          Your saved event plans
        </p>
      </div>

      {/* Cards grid */}
      {!selectedEvent && (
        <>
          {events.length === 0 ? (
            <p style={{ color:"rgba(255,255,255,0.35)", marginBottom:"30px", fontSize:"0.9rem" }}>
              No plans yet. Create your first one below.
            </p>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
              gap:"16px", maxWidth:"900px", width:"100%", marginBottom:"32px" }}>
              {events.filter((e) => e.email === loggedInUser?.email).map((event, i) => (
                <div key={i} onClick={() => viewPlan(event)}
                  style={{ background:"rgba(255,255,255,0.06)", backdropFilter:"blur(12px)",
                    border:"1px solid rgba(255,255,255,0.12)", borderRadius:"16px",
                    padding:"20px", cursor:"pointer", transition:"all 0.2s" }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background="rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor="rgba(255,255,255,0.25)";
                    e.currentTarget.style.transform="translateY(-3px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background="rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";
                    e.currentTarget.style.transform="none";
                  }}>
                  <div style={{ marginBottom:"12px" }}>
                    <p style={{ color:"#fff", fontWeight:"700", margin:0, fontSize:"1rem" }}>{event.eventType}</p>
                    <p style={{ color:"rgba(255,255,255,0.5)", margin:"2px 0 0", fontSize:"0.82rem" }}>{event.theme}</p>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                    {event.city && <span style={{ background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.65)",
                      fontSize:"0.75rem", borderRadius:"6px", padding:"3px 8px" }}>{event.city}</span>}
                    {event.budgetRange && <span style={{ background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.65)",
                      fontSize:"0.75rem", borderRadius:"6px", padding:"3px 8px" }}>{event.budgetRange}</span>}
                    {event.guestCount && <span style={{ background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.65)",
                      fontSize:"0.75rem", borderRadius:"6px", padding:"3px 8px" }}>{event.guestCount} guests</span>}
                  </div>
                  <p style={{ color:"rgba(255,255,255,0.25)", fontSize:"0.72rem", marginTop:"12px", marginBottom:0 }}>
                    {event.timestamp}
                  </p>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.78rem", marginTop:"6px",
                    marginBottom:0, fontWeight:"600" }}>View AI plan →</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Detail view */}
      {selectedEvent && (
        <div style={{ maxWidth:"900px", width:"100%", marginBottom:"30px" }}>
          <button onClick={() => { setSelectedEvent(null); setAiPlans(null); }}
            style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
              color:"#fff", borderRadius:"10px", padding:"8px 18px", cursor:"pointer",
              fontSize:"0.85rem", marginBottom:"20px" }}>
            Back to Plans
          </button>

          {/* Summary card */}
          <div style={{ background:"rgba(255,255,255,0.06)", backdropFilter:"blur(16px)",
            border:"1px solid rgba(255,255,255,0.12)", borderRadius:"18px", padding:"24px", marginBottom:"20px" }}>
            <h2 style={{ color:"#fff", margin:"0 0 4px", fontSize:"1.3rem", fontWeight:"800" }}>
              {selectedEvent.eventType}
            </h2>
            <p style={{ color:"rgba(255,255,255,0.5)", margin:"0 0 16px" }}>{selectedEvent.theme}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
              {chip("City", selectedEvent.city)}
              {chip("Venue", selectedEvent.venue)}
              {chip("Catering", selectedEvent.catering)}
              {chip("Budget", selectedEvent.budgetRange)}
              {chip("Guests", selectedEvent.guestCount)}
              {chip("Entertainment", selectedEvent.entertainment !== "None" ? selectedEvent.entertainment : null)}
              {chip("Photography", selectedEvent.photography?.provider)}
            </div>
          </div>

          {/* AI Plans */}
          {loadingAI && (
            <div style={{ color:"rgba(255,255,255,0.4)", textAlign:"center", padding:"30px 0", fontSize:"0.9rem" }}>
              Loading AI budget plans...
            </div>
          )}

          {aiPlans?.plans && (
            <>
              <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.82rem", textAlign:"center", marginBottom:"16px" }}>
                XGBoost predicted venue cost — <strong style={{color:"rgba(255,255,255,0.6)"}}>{aiPlans.xgboost_raw_prediction}</strong>
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                {aiPlans.plans.map((plan, i) => {
                  const cfg = TIER_CONFIG[plan.tier] || TIER_CONFIG["Recommended"];
                  return (
                    <div key={i} style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(16px)",
                      border:`1px solid ${cfg.color}30`, borderLeft:`4px solid ${cfg.color}`,
                      borderRadius:"16px", padding:"20px" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                        flexWrap:"wrap", gap:"8px", marginBottom:"14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                          <span style={{ color:cfg.color, fontWeight:"800", fontSize:"1rem" }}>{plan.tier}</span>
                          <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.8rem" }}>{plan.rating} / 5</span>
                        </div>
                        <div style={{ display:"flex", gap:"14px" }}>
                          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.82rem" }}>
                            Venue — <strong style={{color:"#fff"}}>{plan.venue_cost_fmt}</strong>
                          </span>
                          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.82rem" }}>
                            Total — <strong style={{color:"#fff"}}>{plan.total_budget_fmt}</strong>
                          </span>
                        </div>
                      </div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                        {Object.entries(plan.budget_allocation).map(([cat, info]) => (
                          <div key={cat} style={{ background:"rgba(255,255,255,0.05)",
                            border:"1px solid rgba(255,255,255,0.08)", borderRadius:"9px",
                            padding:"8px 12px", minWidth:"100px", flex:"1 1 100px" }}>
                            <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.35)",
                              textTransform:"capitalize", marginBottom:"4px" }}>
                              {CAT_LABELS[cat] || cat}
                            </div>
                            <div style={{ color:"#fff", fontWeight:"700", fontSize:"0.85rem" }}>{info.formatted}</div>
                            <div style={{ color:cfg.color, fontSize:"0.72rem" }}>{info.percentage}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!loadingAI && !aiPlans && (
            <div style={{ color:"rgba(255,255,255,0.3)", textAlign:"center", fontSize:"0.85rem", padding:"20px 0" }}>
              Start the Python backend (port 5001) to see AI budget plans.
            </div>
          )}

          {aiPlans && (
            <div style={{ textAlign:"center", marginTop:"24px" }}>
              <button onClick={() => navigate("/event-plan")}
                style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)",
                  color:"#fff", fontSize:"1rem", fontWeight:"700", padding:"14px 40px",
                  borderRadius:"12px", cursor:"pointer" }}>
                View Full Plan
              </button>
            </div>
          )}
        </div>
      )}

      <button onClick={() => navigate("/event-selection")}
        style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)",
          color:"#fff", fontSize:"1rem", fontWeight:"700", padding:"14px 36px",
          borderRadius:"14px", cursor:"pointer", letterSpacing:"0.3px" }}>
        + Create New Plan
      </button>
    </div>
  );
};

export default ExistingPlans;
