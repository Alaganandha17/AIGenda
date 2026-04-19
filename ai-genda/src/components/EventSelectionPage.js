import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext"; 
import PageWrapper from "./PageWrapper";
import { FaGraduationCap, FaBaby, FaHeart, FaGift, FaBriefcase, FaBirthdayCake, FaUsers, FaRing, FaGlassCheers, FaBuilding } from "react-icons/fa";

const events = [
  { name: "Anniversary", icon: <FaGift /> },
  { name: "Baby Shower", icon: <FaBaby /> },
  { name: "Birthday", icon: <FaBirthdayCake /> },
  { name: "Bridal Shower", icon: <FaHeart /> },
  { name: "Conference", icon: <FaBuilding /> },
  { name: "Corporate", icon: <FaBriefcase /> },
  { name: "Family Meet", icon: <FaUsers /> },
  { name: "Graduation", icon: <FaGraduationCap /> },
  { name: "Reception", icon: <FaGlassCheers /> },
  { name: "Wedding", icon: <FaRing /> },
];

const EventSelection = () => {
  const navigate = useNavigate();
  const { setFormData } = useEvent();
  
  const currentStep = 1; // First step
  const totalSteps = 9;

  return (
    <PageWrapper title="What type of event are you planning?">
      {/* Progress Bar */}
      <div
        style={{
          display: "flex",
          width: "80%",
          height: "10px",
          background: "#FFB347",
          borderRadius: "5px",
          margin: "0 auto 20px",
          overflow: "hidden",
        }}
      >
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            style={{
              flex: "1",
              background: index < currentStep ? "#D2691E" : "#FFB347",
              transition: "background 0.3s ease-in-out",
              marginRight: index !== totalSteps - 1 ? "2px" : "0", // Adds small spacing between segments
            }}
          ></div>
        ))}
      </div>

      {/* Event Selection Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "80%",
          margin: "0 auto",
        }}
      >
        {events.slice(0, 8).map((event, index) => (
          <button
            key={index}
            onClick={() => {
              setFormData((prev) => ({ ...prev, eventType: event.name }));
              navigate("/theme-selection");
            }}
            style={{
              background: "#FFB347",
              color: "#222",
              fontSize: "1rem",
              fontWeight: "600",
              padding: "20px",
              borderRadius: "15px",
              cursor: "pointer",
              textAlign: "center",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "250px",
              height: "120px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#D2691E";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#FFB347";
              e.currentTarget.style.color = "#222";
            }}
          >
            <span style={{ fontSize: "1.8rem" }}>{event.icon}</span>
            <span>{event.name}</span>
          </button>
        ))}
      </div>

      {/* Centered Last Two Events */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {events.slice(8).map((event, index) => (
          <button
            key={index}
            onClick={() => {
              setFormData((prev) => ({ ...prev, eventType: event.name }));
              navigate("/theme-selection");
            }}
            style={{
              background: "#FFB347",
              color: "#222",
              fontSize: "1rem",
              fontWeight: "600",
              padding: "20px",
              borderRadius: "15px",
              cursor: "pointer",
              textAlign: "center",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "250px",
              height: "120px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#D2691E";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#FFB347";
              e.currentTarget.style.color = "#222";
            }}
          >
            <span style={{ fontSize: "1.8rem" }}>{event.icon}</span>
            <span>{event.name}</span>
          </button>
        ))}
      </div>
    </PageWrapper>
  );
};

export default EventSelection;
