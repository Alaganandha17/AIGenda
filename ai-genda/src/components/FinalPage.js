import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext";
import { useState } from "react";
import axios from "axios";
import PageWrapper from "./PageWrapper";

const FinalPage = () => {
    const navigate = useNavigate();
    const { formData, setEventPlanResponse } = useEvent();
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const parseBudgetRange = (rangeStr) => {
        if (!rangeStr) return { min: 100000, max: 1000000 };
        const clean = rangeStr.replace(/₹/g, "").replace(/\s/g, "").toUpperCase();
        if (clean.startsWith("<")) {
            const val = parseAmt(clean.slice(1));
            return { min: Math.round(val * 0.5), max: val };
        }
        const parts = clean.split("-");
        if (parts.length === 2) return { min: parseAmt(parts[0]), max: parseAmt(parts[1]) };
        const v = parseAmt(clean);
        return { min: Math.round(v * 0.8), max: v };
    };

    const parseAmt = (s) => {
        if (s.endsWith("CR")) return parseFloat(s) * 10000000;
        if (s.endsWith("1CR")) return 10000000;
        if (s.endsWith("L")) return parseFloat(s) * 100000;
        return parseFloat(s) || 100000;
    };

    const submitData = async () => {
        if (!loggedInUser) {
            setResponse("Error: No logged-in user found!");
            return;
        }

        setLoading(true);
        setResponse(null);

        const newEvent = {
            name: loggedInUser.name,
            email: loggedInUser.email,
            ...formData,
            timestamp: new Date().toLocaleString(),
        };

        try {
            await axios.post("http://localhost:5000/events", newEvent);

            const { min, max } = parseBudgetRange(formData.budgetRange);
            const reqData = {
                eventType:  formData.eventType  || "Birthday",
                theme:      formData.theme       || "Classic",
                city:       formData.city        || "Bangalore",
                guestCount: formData.guestCount  || "200",
                minBudget:  min,
                maxBudget:  max,
            };

            const resp2 = await axios.post("http://localhost:5001/api/plan-event", reqData);
            setEventPlanResponse(resp2.data);
            localStorage.removeItem("aigenda_formData");
            navigate("/event-plan");
        } catch (error) {
            console.error("Error:", error);
            if (error.code === "ERR_NETWORK" || error.message.includes("5001")) {
                setResponse("Python AI backend (port 5001) is not running. Start it and try again.");
            } else if (error.message.includes("5000")) {
                setResponse("Node backend (port 5000) is not running. Start it and try again.");
            } else {
                setResponse("Failed to save event or get AI plan. Check both backends are running.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper
            title={<span style={{ color: "black" }}>Review Your Selection</span>}
            onBack={() => navigate("/guest-selection")}
        >
            <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "0 30px" }}>

                {/* Summary */}
                <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: "16px",
                    padding: "28px 32px", marginBottom: "28px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#111",
                        marginBottom: "20px", borderBottom: "2px solid #FFB347", paddingBottom: "12px" }}>
                        Event Summary
                    </h2>
                    {[
                        ["Event",        formData.eventType],
                        ["Theme",        formData.theme],
                        ["City",         formData.city],
                        ["Venue",        formData.venue],
                        ["Budget",       formData.budgetRange],
                        ["Guests",       formData.guestCount],
                        ["Catering",     formData.catering || "Not Selected"],
                        ["Entertainment",formData.entertainment && formData.entertainment !== "None" ? formData.entertainment : null],
                        ["Photography",  formData.photography?.provider],
                        ["Decoration",   formData.decoration],
                    ].filter(([, val]) => val).map(([label, val]) => (
                        <div key={label} style={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,0.06)",
                            padding: "10px 0", alignItems: "center" }}>
                            <span style={{ width: "160px", fontSize: "0.95rem", fontWeight: "600",
                                color: "#555", flexShrink: 0 }}>{label}</span>
                            <span style={{ fontSize: "0.95rem", color: "#111", fontWeight: "500" }}>{val}</span>
                        </div>
                    ))}
                </div>

                {/* Error */}
                {response && (
                    <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)",
                        color: "#b91c1c", borderRadius: "10px", padding: "14px 18px",
                        marginBottom: "20px", fontSize: "0.95rem" }}>
                        {response}
                    </div>
                )}

                {/* CTA */}
                <div style={{ display: "flex", justifyContent: "center", paddingBottom: "30px" }}>
                    <button onClick={submitData} disabled={loading}
                        style={{
                            background: loading ? "#ccc" : "linear-gradient(45deg, #FF8C00, #D2691E)",
                            color: "white", fontSize: "1.2rem", fontWeight: "700",
                            padding: "18px 52px", borderRadius: "12px",
                            cursor: loading ? "not-allowed" : "pointer", border: "none",
                            boxShadow: loading ? "none" : "3px 3px 12px rgba(0,0,0,0.25)",
                            transition: "all 0.2s ease-in-out",
                        }}
                        onMouseOver={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-3px)"; } }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
                        {loading ? "Processing..." : "Finalize & Create Event"}
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
};

export default FinalPage;
