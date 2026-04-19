import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext";
import bgImage from "../images/bg.jpg";

const TIER_COLORS = {
    "Budget-Friendly": { accent:"#e67212", light:"rgba(34,197,94,0.10)", border:"rgba(34,197,94,0.35)" },
    "Recommended":     { accent:"#f97316", light:"rgba(249,115,22,0.10)", border:"rgba(249,115,22,0.35)" },
    "Premium":         { accent:"#c2783b", light:"rgba(168,85,247,0.10)", border:"rgba(168,85,247,0.35)" },
};

const CAT_LABELS = {
    venue:"Venue", catering:"Catering", decoration:"Decoration",
    entertainment:"Entertainment", logistics:"Logistics", misc:"Miscellaneous"
};

const EventPlanPage = () => {
    const navigate = useNavigate();
    const { eventPlanResponse } = useEvent();

    if (!eventPlanResponse || !eventPlanResponse.plans) {
        return (
            <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center",
                background:`linear-gradient(rgba(0,0,0,0.78),rgba(0,0,0,0.78)),url(${bgImage}) center/cover fixed`,
                fontFamily:"'Inter',sans-serif" }}>
                <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"1rem", marginBottom:"20px" }}>
                    No plan data found. Please go back and finalize your event.
                </p>
                <button onClick={() => navigate("/final")}
                    style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)",
                        color:"#fff", padding:"12px 30px", borderRadius:"10px",
                        cursor:"pointer", fontSize:"0.95rem", fontWeight:"600" }}>
                    Go Back
                </button>
            </div>
        );
    }

    const { plans, xgboost_raw_prediction, event_details } = eventPlanResponse;

    const detailRow = (label, value) => value ? (
        <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0",
            borderBottom:"1px solid rgba(255,255,255,0.07)", fontSize:"0.88rem" }}>
            <span style={{ color:"rgba(255,255,255,0.45)", fontWeight:"500" }}>{label}</span>
            <span style={{ color:"#fff", fontWeight:"600", textAlign:"right", maxWidth:"55%" }}>{value}</span>
        </div>
    ) : null;

    return (
        <div style={{ minHeight:"100vh",
            background:`linear-gradient(rgba(0,0,0,0.78),rgba(0,0,0,0.78)),url(${bgImage}) center/cover fixed`,
            padding:"36px 24px", boxSizing:"border-box", fontFamily:"'Inter',sans-serif" }}>

            {/* Header */}
            <div style={{ maxWidth:"1100px", margin:"0 auto 30px", display:"flex",
                alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
                <div>
                    <h1 style={{ color:"#fff", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:"800",
                        margin:0, letterSpacing:"-0.5px" }}>
                        Your Event Plans
                    </h1>
                    <p style={{ color:"rgba(255,255,255,0.4)", margin:"4px 0 0", fontSize:"0.88rem" }}>
                        {event_details?.eventType} · {event_details?.theme} · {event_details?.city}
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        XGBoost predicted venue cost: <strong style={{color:"rgba(255,255,255,0.65)"}}>{xgboost_raw_prediction}</strong>
                    </p>
                </div>
                <div style={{ display:"flex", gap:"10px" }}>
                    <button onClick={() => navigate("/final")}
                        style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.18)",
                            color:"#fff", borderRadius:"10px", padding:"9px 20px",
                            cursor:"pointer", fontSize:"0.88rem", fontWeight:"600" }}>
                        Back
                    </button>
                    <button onClick={() => navigate("/existing-plans")}
                        style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)",
                            color:"#fff", borderRadius:"10px", padding:"9px 20px",
                            cursor:"pointer", fontSize:"0.88rem", fontWeight:"600" }}>
                        View All Plans
                    </button>
                </div>
            </div>

            {/* 3 column grid */}
            <div style={{ maxWidth:"1100px", margin:"0 auto",
                display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px", alignItems:"start" }}>

                {plans.map((plan) => {
                    const cfg = TIER_COLORS[plan.tier] || TIER_COLORS["Recommended"];
                    return (
                        <div key={plan.tier}
                            style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(18px)",
                                border:`1px solid ${cfg.border}`, borderTop:`4px solid ${cfg.accent}`,
                                borderRadius:"18px", overflow:"hidden", display:"flex", flexDirection:"column" }}>

                            {/* Tier header */}
                            <div style={{ background:cfg.light, padding:"20px 22px", borderBottom:`1px solid ${cfg.border}` }}>
                                <p style={{ margin:"0 0 2px", color:cfg.accent, fontWeight:"800",
                                    fontSize:"1.1rem", letterSpacing:"0.3px" }}>
                                    {plan.tier}
                                </p>
                                <p style={{ margin:0, color:"rgba(255,255,255,0.45)", fontSize:"0.82rem" }}>
                                    {plan.description}
                                </p>
                                <div style={{ display:"flex", gap:"4px", marginTop:"8px", alignItems:"center" }}>
                                    {[1,2,3,4,5].map((s) => (
                                        <span key={s} style={{ fontSize:"0.85rem",
                                            color: s <= Math.round(plan.rating) ? cfg.accent : "rgba(255,255,255,0.2)" }}>
                                            {s <= Math.round(plan.rating) ? "" : ""}
                                        </span>
                                    ))}
                                    <span style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.78rem", marginLeft:"4px" }}>
                                        {plan.rating}
                                    </span>
                                </div>
                            </div>

                            {/* Total spend */}
                            <div style={{ background:cfg.light, padding:"16px 22px",
                                borderBottom:`1px solid ${cfg.border}`, textAlign:"center" }}>
                                <p style={{ margin:"0 0 2px", color:"rgba(255,255,255,0.4)", fontSize:"0.72rem",
                                    textTransform:"uppercase", letterSpacing:"0.8px" }}>
                                    Total Estimated Spend
                                </p>
                                <p style={{ margin:0, color:cfg.accent, fontSize:"1.8rem", fontWeight:"800" }}>
                                    {plan.total_budget_fmt}
                                </p>
                                <p style={{ margin:"4px 0 0", color:"rgba(255,255,255,0.35)", fontSize:"0.78rem" }}>
                                    Venue alone: {plan.venue_cost_fmt}
                                </p>
                            </div>

                            {/* Budget breakdown */}
                            <div style={{ padding:"18px 22px", flex:1 }}>
                                <p style={{ margin:"0 0 12px", color:"rgba(255,255,255,0.35)", fontSize:"0.72rem",
                                    textTransform:"uppercase", letterSpacing:"0.8px" }}>
                                    Cost Breakdown
                                </p>
                                {Object.entries(plan.budget_allocation).map(([cat, info]) => (
                                    <div key={cat} style={{ marginBottom:"12px" }}>
                                        <div style={{ display:"flex", justifyContent:"space-between",
                                            marginBottom:"5px", alignItems:"center" }}>
                                            <span style={{ color:"rgba(255,255,255,0.65)", fontSize:"0.85rem", fontWeight:"600" }}>
                                                {CAT_LABELS[cat] || cat}
                                            </span>
                                            <div style={{ textAlign:"right" }}>
                                                <span style={{ color:"#fff", fontSize:"0.88rem", fontWeight:"700" }}>
                                                    {info.formatted}
                                                </span>
                                                <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.72rem", marginLeft:"6px" }}>
                                                    {info.percentage}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ height:"4px", background:"rgba(255,255,255,0.08)",
                                            borderRadius:"4px", overflow:"hidden" }}>
                                            <div style={{ height:"100%", background:cfg.accent,
                                                borderRadius:"4px", width:info.percentage, maxWidth:"100%" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Event details */}
                            <div style={{ padding:"16px 22px", borderTop:`1px solid ${cfg.border}` }}>
                                <p style={{ margin:"0 0 10px", color:"rgba(255,255,255,0.35)", fontSize:"0.72rem",
                                    textTransform:"uppercase", letterSpacing:"0.8px" }}>
                                    Event Details
                                </p>
                                {detailRow("Event", event_details?.eventType)}
                                {detailRow("Theme", event_details?.theme)}
                                {detailRow("City", event_details?.city)}
                                {detailRow("Guests", String(plan.guest_count))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <p style={{ textAlign:"center", color:"rgba(255,255,255,0.18)", fontSize:"0.78rem", marginTop:"24px" }}>
                Scroll horizontally on smaller screens to see all three plans
            </p>
        </div>
    );
};

export default EventPlanPage;
