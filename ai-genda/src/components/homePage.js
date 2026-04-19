import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import bgImage from "../images/bg.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100); // Trigger animation on load
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        background: loaded ? `url(${bgImage}) center/cover` : "#fff",
        transition: "background 1.5s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Lighter Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(58, 58, 57, 0.34)",
        }}
      ></div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* "Aigenda" Title */}
        <h1
          style={{
            fontSize: "6rem",
            fontWeight: "bold",
            fontFamily: "initial",
            fontStyle: "italic",
            letterSpacing: "1px",
            textShadow: "2px 2px 6px rgba(0,0,0,0.3)",
            color: "#111",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(-50px)",
            transition: "opacity 1s ease-out, transform 1s ease-out",
          }}
        >
          Aigenda
        </h1>

        {/* Tagline */}
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "500",
            maxWidth: "600px",
            margin: "10px auto 25px",
            color: "black",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 1s ease-out 0.5s, transform 1s ease-out 0.5s",
          }}
        >
          Effortless Planning, Powered by AI: Your Event, Perfectly Curated.
        </h2>

        {/* Start Planning Button */}
        <button
          onClick={() => navigate("/login")}
          style={{
            background:
              "linear-gradient(90deg, rgba(188, 104, 2, 0.77), rgba(255, 255, 255, 0.65))",
            color: "#111",
            fontSize: "1.2rem",
            fontWeight: "600",
            padding: "14px 28px",
            borderRadius: "50px",
            border: "none",
            cursor: "pointer",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(50px)",
            transition:
              "opacity 1s ease-out 0.5s, transform 1s ease-out 0.5s",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0px 8px 20px rgb(0, 0, 0)";
            e.target.style.transition = "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "none";
          }}
        >
          Start Planning Your Event
        </button>
      </div>
    </div>
  );
};

export default HomePage;
