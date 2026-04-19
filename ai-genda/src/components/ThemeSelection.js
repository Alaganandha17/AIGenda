import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext";
import PageWrapper from "./PageWrapper";

const eventThemes = {
  Anniversary:     ["Candlelight", "Floral", "Parisian Love", "Tropical Gala", "Rustic", "Grand Ballroom"],
  "Baby Shower":   ["Boy or Girl", "Pastel and Florals", "Tropical Gala", "Animal/Jungle", "Princess/Fairytale"],
  Birthday:        ["Superhero", "Animal/Jungle", "Carnival Fiesta", "Retro", "Princess/Fairytale", "Sports", "Glam Night", "Tropical Gala"],
  "Bridal Shower": ["Brunch with Bride", "Glam Night", "Pastel and Florals", "Tropical Gala", "Candlelight", "Floral"],
  Conference:      ["AI and Future Tech", "Startup Investor Pitch", "Sustainable Business Growth", "Women in Leadership", "Tech and Innovation", "Luxury White Collar"],
  Corporate:       ["Luxury White Collar", "All Black Meet", "Tech and Innovation", "Minimalistic", "Grand Ballroom", "Startup Investor Pitch"],
  "Family Meet":   ["Karaoke and Dance Battle", "Storytelling and Memory Lane", "Retro Throwback", "Family Talent Show", "Carnival Fiesta", "Sports"],
  Graduation:      ["Memory Lane Throwback", "Red Carpet", "Black and Gold", "Grand Ballroom", "Tropical Gala", "Retro"],
  Reception:       ["Classic Reception", "Grand Ballroom", "Floral", "Candlelight", "Tropical Gala", "Rustic"],
  Wedding:         ["Minimalistic", "Rustic", "Grand Ballroom", "Floral", "Candlelight", "Tropical Gala"],
};

const themeEmojis = {
  "Candlelight": "", "Floral": "", "Parisian Love": "", "Tropical Gala": "",
  "Rustic": "", "Grand Ballroom": "", "Boy or Girl": "", "Pastel and Florals": "",
  "Animal/Jungle": "", "Princess/Fairytale": "", "Superhero": "", "Carnival Fiesta": "",
  "Retro": "", "Sports": "", "Glam Night": "", "Brunch with Bride": "",
  "AI and Future Tech": "", "Startup Investor Pitch": "", "Sustainable Business Growth": "",
  "Women in Leadership": "", "Tech and Innovation": "", "Luxury White Collar": "",
  "All Black Meet": "", "Minimalistic": "", "Karaoke and Dance Battle": "",
  "Storytelling and Memory Lane": "", "Retro Throwback": "", "Family Talent Show": "",
  "Memory Lane Throwback": "", "Red Carpet": "", "Black and Gold": "",
  "Classic Reception": "",
};

const ThemeSelection = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useEvent();
  const themes = eventThemes[formData.eventType] || [];

  return (
    <PageWrapper title={`Select a Theme for ${formData.eventType}`} onBack={() => navigate("/event-selection")}>
      <div style={{ width:"80%", height:"10px", background:"#FFB347", borderRadius:"5px", margin:"0 auto 20px", overflow:"hidden" }}>
        <div style={{ width:"22.2%", height:"100%", background:"#D2691E" }} />
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"16px", maxWidth:"80%", margin:"0 auto" }}>
        {themes.map((theme, i) => (
          <button key={i}
            onClick={() => { setFormData((p) => ({ ...p, theme })); navigate("/city-selection"); }}
            style={{ background:"#FFB347", color:"#222", fontSize:"0.88rem", fontWeight:"600",
              padding:"16px 12px", borderRadius:"15px", cursor:"pointer", border:"none",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              gap:"6px", width:"155px", height:"90px", transition:"all 0.2s" }}
            onMouseOver={(e) => { e.currentTarget.style.background="#D2691E"; e.currentTarget.style.color="#fff"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background="#FFB347"; e.currentTarget.style.color="#222"; e.currentTarget.style.transform="none"; }}>
            <span style={{ fontSize:"1.6rem" }}>{themeEmojis[theme] || ""}</span>
            <span>{theme}</span>
          </button>
        ))}
      </div>
    </PageWrapper>
  );
};

export default ThemeSelection;
