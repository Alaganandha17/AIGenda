import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext";
import PageWrapper from "./PageWrapper";

// Universal fallback options used when no theme-specific match
const universalOptions = [
  { type:"Live Band", cost:80000, description:"Live covers of popular songs across genres" },
  { type:"DJ Night", cost:70000, description:"High-energy DJ set with lighting show" },
  { type:"Stand-up Comedy", cost:60000, description:"Professional comedian for all ages" },
];

const entertainmentByTheme = {
  "Memory Lane Throwback":       [{ type:"Kathakali", cost:120000, description:"Traditional Kerala dance drama" },{ type:"Mohiniyattam", cost:100000, description:"Graceful classical dance form" },{ type:"Chenda Melam", cost:90000, description:"Powerful Kerala percussion ensemble" }],
  "Boy or Girl":                 [{ type:"DJ Night", cost:75000, description:"Curated Bollywood & international mix" },{ type:"Rock Band", cost:85000, description:"Live covers of popular songs" },{ type:"Magic Show", cost:55000, description:"Interactive illusion show for families" }],
  "Glam Night":                  [{ type:"Bollywood Night", cost:120000, description:"Bollywood dance performances & DJ" },{ type:"Fashion Show", cost:100000, description:"Mini runway with live music" },{ type:"DJ Night", cost:75000, description:"High-energy club-style DJ" }],
  "Pastel and Florals":          [{ type:"Carnatic Music", cost:80000, description:"South Indian classical vocal" },{ type:"Bharatanatyam", cost:90000, description:"Traditional Tamil dance" },{ type:"Fusion Band", cost:100000, description:"Classical meets contemporary" }],
  "Candlelight":                 [{ type:"Qawwali", cost:100000, description:"Sufi devotional music" },{ type:"Ghazal Night", cost:90000, description:"Poetic Urdu love songs" },{ type:"Live Jazz", cost:85000, description:"Soft jazz/lounge music" }],
  "Tech and Innovation":         [{ type:"Folk Dance", cost:70000, description:"Regional cultural performances" },{ type:"Live Band", cost:85000, description:"Upbeat contemporary music" },{ type:"Classical Music", cost:75000, description:"Instrumental ensemble" }],
  "Superhero":                   [{ type:"Lavani Dance", cost:80000, description:"Energetic Maharashtrian folk dance" },{ type:"DJ Night", cost:70000, description:"Themed superhero soundtrack mixes" },{ type:"Stunt Show", cost:110000, description:"Live action stunt performers" }],
  "Carnival Fiesta":             [{ type:"Garba Dance", cost:85000, description:"Traditional Gujarati circle dance" },{ type:"Live Music", cost:80000, description:"Bollywood dance numbers" },{ type:"Magic Show", cost:55000, description:"Interactive illusion performances" }],
  "Women in Leadership":         [{ type:"Bhangra", cost:80000, description:"Energetic Punjabi dance performance" },{ type:"Live DJ", cost:70000, description:"Empowerment-themed music" },{ type:"Stand-up Comedy", cost:60000, description:"Female comedian sets" }],
  "AI and Future Tech":          [{ type:"Tech Demo", cost:50000, description:"Interactive AI/VR demo zone" },{ type:"Live Band", cost:85000, description:"Contemporary tech-themed music" },{ type:"DJ Night", cost:70000, description:"Electronic/EDM set" }],
  "Startup Investor Pitch":      [{ type:"Networking DJ", cost:65000, description:"Background music for networking" },{ type:"Live Jazz", cost:80000, description:"Sophisticated live jazz" },{ type:"Stand-up Comedy", cost:60000, description:"Light humor for business crowd" }],
  "Luxury White Collar":         [{ type:"Classical Orchestra", cost:150000, description:"Live orchestra performance" },{ type:"Live Jazz", cost:90000, description:"Premium jazz quartet" },{ type:"Opera", cost:130000, description:"Short opera performance" }],
  "All Black Meet":              [{ type:"DJ Night", cost:80000, description:"High-energy exclusive DJ set" },{ type:"Live Band", cost:90000, description:"Sophisticated live band" },{ type:"Saxophone Solo", cost:70000, description:"Live sax performer" }],
  "Red Carpet":                  [{ type:"Bollywood Night", cost:130000, description:"Bollywood dance & DJ extravaganza" },{ type:"Live Band", cost:90000, description:"Star-studded live performance" },{ type:"Photo Booth Setup", cost:40000, description:"Glamorous red carpet photo experience" }],
  "Black and Gold":              [{ type:"DJ Night", cost:85000, description:"Exclusive DJ set with gold lighting" },{ type:"Live R&B Band", cost:100000, description:"Soulful R&B performance" },{ type:"Drum Circle", cost:65000, description:"Interactive percussion experience" }],
  "Grand Ballroom":              [{ type:"Classical Orchestra", cost:150000, description:"Full orchestral performance" },{ type:"Ballroom Dance Show", cost:110000, description:"Professional ballroom dancers" },{ type:"Live Band", cost:95000, description:"Premium live band" }],
  "Tropical Gala":               [{ type:"Bollywood Night", cost:100000, description:"High-energy Bollywood night" },{ type:"Samba Dancers", cost:90000, description:"Tropical themed dance performances" },{ type:"DJ Night", cost:75000, description:"Beach/tropical music DJ" }],
  "Rustic":                      [{ type:"Folk Band", cost:70000, description:"Acoustic folk music" },{ type:"Classical Guitar", cost:55000, description:"Live classical guitar" },{ type:"Storytelling Performance", cost:45000, description:"Live narrative performance" }],
  "Floral":                      [{ type:"Classical Music", cost:80000, description:"Instrumental string quartet" },{ type:"Bharatanatyam", cost:90000, description:"Graceful classical dance" },{ type:"Live Harp", cost:70000, description:"Enchanting harp performance" }],
  "Parisian Love":               [{ type:"French Cabaret", cost:120000, description:"Parisian-style cabaret show" },{ type:"Violin Duo", cost:80000, description:"Romantic violin performance" },{ type:"Accordion Music", cost:65000, description:"Authentic French ambiance" }],
  "Minimalistic":                [{ type:"Piano Solo", cost:70000, description:"Elegant live piano" },{ type:"Jazz Trio", cost:85000, description:"Minimal sophisticated jazz" },{ type:"Spoken Word", cost:50000, description:"Poetry and spoken word" }],
  "Karaoke and Dance Battle":    [{ type:"Karaoke Setup", cost:45000, description:"Professional karaoke system" },{ type:"DJ Battle", cost:70000, description:"Back-to-back DJ battle" },{ type:"Dance Performance", cost:80000, description:"Choreographed troupe performance" }],
  "Storytelling and Memory Lane":[{ type:"Live Theatre", cost:95000, description:"Short theatrical performance" },{ type:"Classical Music", cost:75000, description:"Nostalgic classical tunes" },{ type:"Acoustic Set", cost:55000, description:"Intimate acoustic singer-songwriter" }],
  "Retro Throwback":             [{ type:"80s Band", cost:85000, description:"Classic 80s/90s hits live" },{ type:"Retro DJ", cost:70000, description:"Vintage era DJ set" },{ type:"Old-School Dance Troupe", cost:90000, description:"Retro dance performance" }],
  "Family Talent Show":          [{ type:"Host & Emcee", cost:40000, description:"Professional event host" },{ type:"Live Band", cost:80000, description:"Accompaniment for performances" },{ type:"Magic Show", cost:55000, description:"Family magic entertainment" }],
  "Sports":                      [{ type:"Sports Quiz", cost:35000, description:"Interactive sports trivia" },{ type:"Live Commentary", cost:40000, description:"Sports commentary entertainment" },{ type:"DJ Night", cost:70000, description:"High-energy sports anthems" }],
  "Retro":                       [{ type:"80s Band", cost:85000, description:"Classic hits live performance" },{ type:"Retro DJ", cost:70000, description:"Vintage era DJ set" },{ type:"Themed Dance Troupe", cost:90000, description:"Retro-themed dance show" }],
  "Animal/Jungle":               [{ type:"Magic Show", cost:55000, description:"Animal-themed magic acts" },{ type:"Puppet Show", cost:45000, description:"Jungle animal puppet theater" },{ type:"Live Music", cost:75000, description:"Nature-inspired live music" }],
  "Princess/Fairytale":          [{ type:"Ballet Performance", cost:110000, description:"Graceful ballet show" },{ type:"Magic Show", cost:55000, description:"Fairytale magic acts" },{ type:"Live Harp", cost:70000, description:"Enchanting harp music" }],
  "Brunch with Bride":           [{ type:"Live Acoustic", cost:55000, description:"Soft acoustic background music" },{ type:"Jazz Trio", cost:80000, description:"Brunch jazz music" },{ type:"Photo Booth", cost:35000, description:"Fun bridal photo experience" }],
  "Classic Reception":           [{ type:"Classical Orchestra", cost:140000, description:"Traditional orchestral performance" },{ type:"Live Band", cost:95000, description:"Premium wedding band" },{ type:"DJ Night", cost:80000, description:"Dance floor DJ" }],
  "Sustainable Business Growth": [{ type:"Motivational Speaker", cost:80000, description:"Inspiring business talk" },{ type:"Live Jazz", cost:75000, description:"Sophisticated background music" },{ type:"Acoustic Set", cost:50000, description:"Eco-friendly acoustic performance" }],
};

const EntertainmentSelection = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useEvent();
  const { theme } = formData;
  const options = entertainmentByTheme[theme] || universalOptions;

  return (
    <PageWrapper title={`Entertainment for ${theme || "Your Event"}`} onBack={() => navigate("/budget-selection")}>
      <div style={{ width:"80%", height:"10px", background:"#FFB347", borderRadius:"5px", margin:"0 auto 20px", overflow:"hidden" }}>
        <div style={{ width:"80%", height:"100%", background:"#D2691E" }} />
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"18px", maxWidth:"80%", margin:"0 auto" }}>
        {options.map((e, i) => (
          <button key={i}
            onClick={() => { setFormData((p) => ({ ...p, entertainment: e.type })); navigate("/photography-selection"); }}
            style={{ background:"#FFB347", color:"#222", fontSize:"0.88rem", fontWeight:"600", padding:"18px",
              borderRadius:"15px", cursor:"pointer", border:"none",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              gap:"6px", width:"220px", height:"130px", transition:"all 0.2s", textAlign:"center" }}
            onMouseOver={(e2) => { e2.currentTarget.style.background="#D2691E"; e2.currentTarget.style.color="#fff"; e2.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseOut={(e2) => { e2.currentTarget.style.background="#FFB347"; e2.currentTarget.style.color="#222"; e2.currentTarget.style.transform="none"; }}>
            <strong style={{ fontSize:"1rem" }}>{e.type}</strong>
            <span style={{ color:"#5a3000", fontWeight:"700" }}>₹{e.cost.toLocaleString()}</span>
            <small style={{ lineHeight:"1.3", opacity:0.85 }}>{e.description}</small>
          </button>
        ))}
      </div>
      <button onClick={() => { setFormData((p) => ({ ...p, entertainment: "None" })); navigate("/photography-selection"); }}
        style={{ background:"#D2691E", color:"white", fontSize:"0.95rem", fontWeight:"600",
          padding:"13px 30px", borderRadius:"10px", cursor:"pointer", border:"none",
          marginTop:"20px", display:"block", marginLeft:"auto", marginRight:"auto", transition:"all 0.2s" }}
        onMouseOver={(e) => { e.currentTarget.style.background="#B8561A"; }}
        onMouseOut={(e) => { e.currentTarget.style.background="#D2691E"; }}>
        Skip
      </button>
    </PageWrapper>
  );
};

export default EntertainmentSelection;
