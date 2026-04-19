import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext";
import PageWrapper from "./PageWrapper";

const allCities = ["Kochi","Delhi","Kolkata","Bangalore","Chennai","Pune","Ahmedabad","Coimbatore","Hyderabad","Mumbai","Jaipur"];

// Every theme maps to ALL cities — no dead ends
const citiesByTheme = {
  "Graduation": {
    "Memory Lane Throwback": ["Kochi","Delhi","Bangalore","Chennai","Mumbai"],
    "Red Carpet": ["Kolkata","Mumbai","Delhi","Bangalore"],
    "Black and Gold": ["Kochi","Kolkata","Hyderabad","Bangalore","Chennai"],
    "Grand Ballroom": ["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata"],
    "Tropical Gala": ["Kochi","Chennai","Mumbai","Bangalore","Hyderabad"],
    "Retro": ["Ahmedabad","Bangalore","Pune","Mumbai","Delhi"],
  },
  "Baby Shower": {
    "Boy or Girl": ["Bangalore","Chennai","Delhi","Pune","Ahmedabad","Coimbatore","Mumbai","Kochi","Hyderabad","Kolkata"],
    "Pastel and Florals": ["Kochi","Mumbai","Chennai","Bangalore","Pune","Delhi","Coimbatore"],
    "Tropical Gala": ["Jaipur","Kochi","Chennai","Mumbai","Bangalore"],
    "Animal/Jungle": ["Jaipur","Pune","Bangalore","Chennai","Hyderabad","Mumbai"],
    "Princess/Fairytale": ["Hyderabad","Jaipur","Mumbai","Delhi","Bangalore","Chennai"],
  },
  "Bridal Shower": {
    "Brunch with Bride": ["Chennai","Pune","Bangalore","Mumbai","Delhi","Hyderabad","Kochi"],
    "Glam Night": ["Kochi","Bangalore","Hyderabad","Coimbatore","Mumbai","Delhi","Chennai","Pune"],
    "Pastel and Florals": ["Kochi","Mumbai","Chennai","Bangalore","Pune","Delhi"],
    "Tropical Gala": ["Jaipur","Kochi","Chennai","Mumbai","Bangalore"],
    "Candlelight": ["Hyderabad","Pune","Mumbai","Delhi","Kolkata","Bangalore"],
    "Floral": ["Hyderabad","Kolkata","Pune","Chennai","Bangalore","Mumbai"],
  },
  "Anniversary": {
    "Candlelight": ["Hyderabad","Coimbatore","Ahmedabad","Pune","Mumbai","Delhi","Bangalore","Kolkata"],
    "Floral": ["Hyderabad","Kolkata","Pune","Chennai","Bangalore","Mumbai","Delhi"],
    "Parisian Love": ["Mumbai","Delhi","Bangalore","Chennai","Kolkata"],
    "Tropical Gala": ["Jaipur","Kochi","Chennai","Mumbai","Bangalore"],
    "Rustic": ["Pune","Delhi","Coimbatore","Jaipur","Bangalore"],
    "Grand Ballroom": ["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata"],
  },
  "Corporate": {
    "Luxury White Collar": ["Coimbatore","Kolkata","Mumbai","Bangalore","Delhi","Hyderabad","Chennai"],
    "All Black Meet": ["Mumbai","Kolkata","Delhi","Bangalore","Hyderabad","Chennai"],
    "Tech and Innovation": ["Coimbatore","Hyderabad","Bangalore","Kochi","Mumbai","Pune","Chennai"],
    "Minimalistic": ["Mumbai","Chennai","Delhi","Bangalore","Pune","Hyderabad"],
    "Grand Ballroom": ["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata"],
    "Startup Investor Pitch": ["Bangalore","Hyderabad","Coimbatore","Kochi","Mumbai","Pune","Delhi","Chennai"],
  },
  "Conference": {
    "AI and Future Tech": ["Jaipur","Bangalore","Hyderabad","Mumbai","Delhi","Chennai","Pune"],
    "Startup Investor Pitch": ["Bangalore","Hyderabad","Coimbatore","Kochi","Mumbai","Pune","Delhi","Chennai"],
    "Sustainable Business Growth": ["Jaipur","Pune","Hyderabad","Bangalore","Delhi","Mumbai","Chennai"],
    "Women in Leadership": ["Delhi","Kolkata","Jaipur","Chennai","Bangalore","Mumbai","Hyderabad"],
    "Tech and Innovation": ["Coimbatore","Hyderabad","Bangalore","Kochi","Mumbai","Pune","Chennai"],
    "Luxury White Collar": ["Coimbatore","Kolkata","Mumbai","Bangalore","Delhi","Hyderabad","Chennai"],
  },
  "Birthday": {
    "Sports": ["Chennai","Coimbatore","Bangalore","Mumbai","Delhi","Hyderabad","Pune"],
    "Superhero": ["Pune","Hyderabad","Bangalore","Mumbai","Delhi","Chennai"],
    "Animal/Jungle": ["Jaipur","Pune","Bangalore","Chennai","Hyderabad","Mumbai"],
    "Carnival Fiesta": ["Ahmedabad","Hyderabad","Mumbai","Bangalore","Pune","Delhi","Kochi"],
    "Retro": ["Ahmedabad","Bangalore","Pune","Mumbai","Delhi","Kolkata"],
    "Princess/Fairytale": ["Hyderabad","Jaipur","Mumbai","Delhi","Bangalore","Chennai"],
    "Glam Night": ["Kochi","Bangalore","Hyderabad","Mumbai","Delhi","Chennai","Pune"],
    "Tropical Gala": ["Jaipur","Kochi","Chennai","Mumbai","Bangalore"],
  },
  "Family Meet": {
    "Karaoke and Dance Battle": ["Hyderabad","Coimbatore","Ahmedabad","Mumbai","Bangalore","Pune","Delhi"],
    "Storytelling and Memory Lane": ["Mumbai","Kolkata","Delhi","Bangalore","Chennai"],
    "Retro Throwback": ["Pune","Ahmedabad","Bangalore","Mumbai","Delhi","Kolkata"],
    "Family Talent Show": ["Kolkata","Mumbai","Delhi","Bangalore","Chennai","Hyderabad"],
    "Carnival Fiesta": ["Ahmedabad","Hyderabad","Mumbai","Bangalore","Pune","Delhi","Kochi"],
    "Sports": ["Chennai","Coimbatore","Bangalore","Mumbai","Delhi","Hyderabad","Pune"],
  },
  "Wedding": {
    "Minimalistic": ["Delhi","Mumbai","Chennai","Bangalore","Pune","Hyderabad","Kolkata"],
    "Rustic": ["Pune","Delhi","Coimbatore","Jaipur","Bangalore","Mumbai"],
    "Grand Ballroom": ["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata"],
    "Floral": ["Hyderabad","Kolkata","Pune","Chennai","Bangalore","Mumbai","Delhi"],
    "Candlelight": ["Hyderabad","Pune","Mumbai","Delhi","Kolkata","Bangalore"],
    "Tropical Gala": ["Jaipur","Kochi","Chennai","Mumbai","Bangalore"],
  },
  "Reception": {
    "Classic Reception": ["Coimbatore","Jaipur","Kochi","Bangalore","Delhi","Ahmedabad","Mumbai","Chennai","Hyderabad","Pune","Kolkata"],
    "Grand Ballroom": ["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata","Jaipur"],
    "Floral": ["Hyderabad","Kolkata","Pune","Chennai","Bangalore","Mumbai","Delhi"],
    "Candlelight": ["Hyderabad","Pune","Mumbai","Delhi","Kolkata","Bangalore"],
    "Tropical Gala": ["Jaipur","Kochi","Chennai","Mumbai","Bangalore"],
    "Rustic": ["Pune","Delhi","Coimbatore","Jaipur","Bangalore"],
  },
};

const cityEmojis = {
  "Kochi":"","Delhi":"","Kolkata":"","Bangalore":"","Chennai":"",
  "Pune":"","Ahmedabad":"","Coimbatore":"","Hyderabad":"","Mumbai":"","Jaipur":"",
};

const CitySelection = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useEvent();
  const themeCities = citiesByTheme[formData.eventType]?.[formData.theme] || allCities;
  const otherCities = allCities.filter((c) => !themeCities.includes(c));

  const CityBtn = ({ city }) => (
    <button onClick={() => { setFormData((p) => ({ ...p, city })); navigate("/budget-selection"); }}
      style={{ background:"#FFB347", color:"#222", fontSize:"0.88rem", fontWeight:"600",
        padding:"14px", borderRadius:"15px", cursor:"pointer", border:"none",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        gap:"5px", width:"130px", height:"80px", transition:"all 0.2s" }}
      onMouseOver={(e) => { e.currentTarget.style.background="#D2691E"; e.currentTarget.style.color="#fff"; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseOut={(e) => { e.currentTarget.style.background="#FFB347"; e.currentTarget.style.color="#222"; e.currentTarget.style.transform="none"; }}>
      <span style={{ fontSize:"1.4rem" }}>{cityEmojis[city]||""}</span>
      <span>{city}</span>
    </button>
  );

  return (
    <PageWrapper title="Select Your City" onBack={() => navigate("/theme-selection")}>
      <div style={{ width:"80%", height:"10px", background:"#FFB347", borderRadius:"5px", margin:"0 auto 20px", overflow:"hidden" }}>
        <div style={{ width:"33.3%", height:"100%", background:"#D2691E" }} />
      </div>
      {themeCities.length > 0 && (
        <>
          <h3 style={{ textAlign:"center", color:"#111", marginBottom:"12px", fontSize:"1.1rem" }}>
             Popular for <strong>{formData.theme}</strong>
          </h3>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"14px", maxWidth:"80%", margin:"0 auto 20px" }}>
            {themeCities.map((c, i) => <CityBtn key={i} city={c} />)}
          </div>
        </>
      )}
      {otherCities.length > 0 && (
        <>
          <h3 style={{ textAlign:"center", color:"#555", marginBottom:"12px", fontSize:"1rem" }}>Other Cities</h3>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"14px", maxWidth:"80%", margin:"0 auto" }}>
            {otherCities.map((c, i) => <CityBtn key={i} city={c} />)}
          </div>
        </>
      )}
    </PageWrapper>
  );
};

export default CitySelection;
