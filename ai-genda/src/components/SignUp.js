import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../images/bg.jpg";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSignUp = async () => {
    if (!user.name || !user.email || !user.password) {
      setError("All fields are required");
      return;
    }
    if (!validateEmail(user.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (user.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const res = await axios.post("https://aigenda.onrender.com/signup", user);
      if (res.data.success) {
        navigate("/event-selection", { state: { name: user.name } });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${bgImage}) no-repeat center center/cover`,
        position: "relative",
      }}
    >
      {/* Background Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
        }}
      ></div>

      {/* Signup Form */}
      <div
        style={{
          position: "relative",
          background: "rgba(255, 255, 255, 0.2)",
          padding: "40px",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          width: "350px",
        }}
      >
        <h2 style={{ color: "#fff", marginBottom: "20px" }}>Sign Up</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={user.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password (8+ characters)"
          value={user.password}
          onChange={handleChange}
          style={inputStyle}
        />

        <button onClick={handleSignUp} style={buttonStyle}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

// Styles
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  background: "rgba(255, 255, 255, 0.3)",
  color: "#fff",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#fff",
  color: "#333",
  fontSize: "1.1rem",
  fontWeight: "bold",
  cursor: "pointer",
};

export default SignUpPage;
