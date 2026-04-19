import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../images/bg.jpg";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);

  const handleLogin = async () => {
    if (!username || password.length < 8) return;
    try {
      const response = await axios.post("http://localhost:5000/login", { username, password });
      localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
      navigate("/existing-plans");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `url(${bgImage}) no-repeat center center/cover`, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <div style={{ position: "relative", background: "rgba(255,255,255,0.15)", padding: "40px",
        borderRadius: "16px", backdropFilter: "blur(14px)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        textAlign: "center", width: "320px", border: "1px solid rgba(255,255,255,0.2)" }}>

        <h2 style={{ color: "#fff", marginBottom: "24px", fontSize: "1.8rem", fontWeight: "700",
          letterSpacing: "1px" }}>Welcome Back</h2>

        {error && (
          <div style={{ background: "rgba(255,80,80,0.2)", border: "1px solid rgba(255,80,80,0.5)",
            color: "#ffaaaa", padding: "10px", borderRadius: "8px", marginBottom: "14px",
            fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <input type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.3)",
            outline: "none", background: "rgba(255,255,255,0.2)", color: "#fff", marginBottom: "14px",
            fontSize: "1rem", boxSizing: "border-box" }} />

        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.3)",
            outline: "none", background: "rgba(255,255,255,0.2)", color: "#fff", marginBottom: "20px",
            fontSize: "1rem", boxSizing: "border-box" }} />

        <button onClick={handleLogin}
          style={{ width: "100%", padding: "13px", borderRadius: "8px", border: "none",
            background: username && password.length >= 8
              ? "linear-gradient(135deg, #FF8C00, #D2691E)" : "rgba(255,255,255,0.2)",
            color: username && password.length >= 8 ? "#fff" : "rgba(255,255,255,0.4)",
            fontSize: "1.05rem", fontWeight: "700", cursor: username && password.length >= 8 ? "pointer" : "not-allowed",
            transition: "all 0.2s", letterSpacing: "0.5px" }}
          disabled={!username || password.length < 8}>
          Login
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
          gap: "6px", marginTop: "18px", flexWrap: "wrap" }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem" }}>Don't have an account?</span>
          <button onClick={() => navigate("/signup")}
            style={{ background: "none", border: "none", color: "#FFB347", fontWeight: "700",
              cursor: "pointer", fontSize: "0.88rem", padding: 0 }}>
            Register
          </button>
          <div style={{ position: "relative", display: "inline-block" }}>
            <button onClick={() => setShowHint(!showHint)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)",
                cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline dotted", padding: 0 }}>
              Hint
            </button>
            {showHint && (
              <div style={{ position: "absolute", bottom: "130%", left: "50%", transform: "translateX(-50%)",
                background: "rgba(20,20,20,0.95)", color: "#FFD580", borderRadius: "10px",
                padding: "12px 16px", fontSize: "0.82rem", whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)", border: "1px solid rgba(255,179,71,0.3)",
                zIndex: 100, lineHeight: "1.7" }}>
                <strong style={{ color: "#FFB347" }}>Demo Account</strong><br />
                Username: <code style={{ color: "#fff" }}>Alice</code><br />
                Password: <code style={{ color: "#fff" }}>alice1234</code>
                <div style={{ position: "absolute", bottom: "-6px", left: "50%", transform: "translateX(-50%)",
                  width: "12px", height: "12px", background: "rgba(20,20,20,0.95)",
                  borderBottom: "1px solid rgba(255,179,71,0.3)" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
