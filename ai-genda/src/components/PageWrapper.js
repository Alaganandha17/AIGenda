
import bgImage from "../images/bg.jpg";
import { FaArrowLeft } from "react-icons/fa";

const PageWrapper = ({ title, children, onBack }) => (
  <div style={{
    height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
    textAlign: "center", background: `linear-gradient(rgba(77, 73, 73, 0.6), rgba(255, 255, 255, 0.6)), url(${bgImage})`, 
    backgroundSize: "cover", backgroundPosition: "center", padding: "20px" }}>
    {onBack && <button onClick={onBack} style={{ position: "absolute", top: "20px", left: "20px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}><FaArrowLeft /></button>}
    <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#222" }}>{title}</h2>
    {children}
  </div>
);

export default PageWrapper;