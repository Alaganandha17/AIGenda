import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext";
import PageWrapper from "./PageWrapper";

// Every venue now has photography — no dead ends
const photographyByVenue = {
  "The Raviz Ashtamudi":             [{ provider:"Backwater Lens Co.", cost:[180000,250000], specialties:["Backwater Sunset Shots","Traditional Kerala Wedding Photography"] }],
  "Le Meridien Kochi":               [{ provider:"Kochi Click Studios", cost:[120000,280000], specialties:["Luxury Hotel Photography","Candid Event Coverage"] }],
  "Grand Hyatt Kochi":               [{ provider:"Kochi Click Studios", cost:[150000,300000], specialties:["Grand Venue Photography","Aerial Drone Coverage"] }],
  "Taj Malabar Resort":              [{ provider:"Backwater Lens Co.", cost:[160000,260000], specialties:["Resort Photography","Sunset & Waterfront Shots"] }],
  "JW Marriott Bangalore":           [{ provider:"Silicon Shots", cost:[200000,320000], specialties:["Corporate Event Photography","Baby Shoot Styling"] }],
  "The Leela Palace Bangalore":      [{ provider:"Silicon Shots", cost:[220000,380000], specialties:["Royal Portraiture","Tech Conference Coverage"] }],
  "The Ritz-Carlton Bangalore":      [{ provider:"Silicon Shots", cost:[250000,400000], specialties:["Luxury Photography","High-End Event Coverage"] }],
  "Conrad Bangalore":                [{ provider:"Namma Frames", cost:[180000,300000], specialties:["Contemporary Event Photography","Candid Coverage"] }],
  "Sheraton Grand Bangalore":        [{ provider:"Namma Frames", cost:[170000,280000], specialties:["Corporate Photography","Group Event Coverage"] }],
  "Taj Mahal Palace":                [{ provider:"Mumbai Moments", cost:[250000,420000], specialties:["Iconic Backdrop Photography","Bollywood-Style Shoots"] }],
  "ITC Maratha":                     [{ provider:"Mumbai Moments", cost:[200000,350000], specialties:["Marathi Cultural Photography","Large Group Coordination"] }],
  "JW Marriott Mumbai":              [{ provider:"Mumbai Moments", cost:[220000,380000], specialties:["Modern Event Photography","Aerial Coverage"] }],
  "The St. Regis Mumbai":            [{ provider:"Elite Captures", cost:[280000,450000], specialties:["Luxury Event Photography","VIP Guest Coverage"] }],
  "Four Seasons Mumbai":             [{ provider:"Elite Captures", cost:[290000,460000], specialties:["Premium Photography","Cinematic Coverage"] }],
  "ITC Maurya":                      [{ provider:"Capital Lens", cost:[200000,340000], specialties:["Diplomatic Event Photography","Minimalist Wedding Shoots"] }],
  "The Oberoi New Delhi":            [{ provider:"Capital Lens", cost:[220000,360000], specialties:["Luxury Product Launches","High-Profile Guest Handling"] }],
  "Taj Palace":                      [{ provider:"Delhi Frames", cost:[210000,350000], specialties:["Heritage Photography","Royal Event Coverage"] }],
  "The Leela Palace Delhi":          [{ provider:"Delhi Frames", cost:[240000,400000], specialties:["Palace Photography","Elegant Event Coverage"] }],
  "Hyatt Regency Delhi":             [{ provider:"Delhi Frames", cost:[190000,320000], specialties:["Contemporary Photography","Corporate Coverage"] }],
  "ITC Kohenur":                     [{ provider:"Hyderabad Optics", cost:[280000,450000], specialties:["Hyderabadi Cuisine Styling","Nizam-Era Portrait Recreation"] }],
  "Novotel Hyderabad":               [{ provider:"Hyderabad Optics", cost:[150000,260000], specialties:["Modern Event Photography","Budget-Friendly Packages"] }],
  "The Westin Hyderabad":            [{ provider:"Hyderabad Optics", cost:[180000,310000], specialties:["Corporate Photography","Panoramic Coverage"] }],
  "Taj Falaknuma Palace":            [{ provider:"Royal Shutter", cost:[320000,500000], specialties:["Palace Photography","Heritage Documentation","Drone Coverage"] }],
  "Park Hyatt Hyderabad":            [{ provider:"Royal Shutter", cost:[200000,360000], specialties:["Luxury Photography","Candid & Portrait Sessions"] }],
  "ITC Grand Chola":                 [{ provider:"Chennai Captures", cost:[220000,370000], specialties:["Heritage Photography","South Indian Cultural Events"] }],
  "Park Hyatt Chennai":              [{ provider:"Chennai Captures", cost:[180000,300000], specialties:["Modern Event Photography","Candid Coverage"] }],
  "Taj Coromandel":                  [{ provider:"Chennai Captures", cost:[200000,340000], specialties:["Classic Photography","Wedding Coverage"] }],
  "Leela Palace Chennai":            [{ provider:"Marina Lens", cost:[230000,390000], specialties:["Royal Photography","Bridal Shoots"] }],
  "The Westin Chennai":              [{ provider:"Marina Lens", cost:[175000,295000], specialties:["Contemporary Coverage","Group Photography"] }],
  "Conrad Pune":                     [{ provider:"Pune Pixels", cost:[160000,280000], specialties:["Modern Event Photography","Corporate Coverage"] }],
  "The Westin Pune":                 [{ provider:"Pune Pixels", cost:[150000,260000], specialties:["Contemporary Photography","Candid Coverage"] }],
  "Hyatt Regency Pune":              [{ provider:"Pune Pixels", cost:[155000,270000], specialties:["Event Photography","Group Portraits"] }],
  "JW Marriott Pune":                [{ provider:"Deccan Frames", cost:[190000,320000], specialties:["Luxury Photography","Wedding Coverage"] }],
  "Sheraton Grand Pune":             [{ provider:"Deccan Frames", cost:[170000,290000], specialties:["Corporate Photography","Candid Moments"] }],
  "JW Marriott Kolkata":             [{ provider:"Kolkata Stories", cost:[185000,310000], specialties:["Bengali Cultural Photography","Grand Event Coverage"] }],
  "ITC Royal Bengal":                [{ provider:"Kolkata Stories", cost:[195000,325000], specialties:["Heritage Photography","Artistic Portraits"] }],
  "The Oberoi Grand":                [{ provider:"Kolkata Stories", cost:[210000,360000], specialties:["Iconic Kolkata Photography","Heritage Documentation"] }],
  "Hyatt Regency Kolkata":           [{ provider:"Kolkata Stories", cost:[170000,290000], specialties:["Contemporary Photography","Group Coverage"] }],
  "Rambagh Palace":                  [{ provider:"Jaipur Heritage Lens", cost:[300000,500000], specialties:["Royal Palace Photography","Rajasthani Heritage Shoots"] }],
  "Fairmont Jaipur":                 [{ provider:"Jaipur Heritage Lens", cost:[250000,420000], specialties:["Luxury Event Photography","Palace Backdrop Shoots"] }],
  "The Leela Palace Jaipur":         [{ provider:"Jaipur Heritage Lens", cost:[270000,440000], specialties:["Heritage Photography","Bridal Portraits"] }],
  "Taj Jai Mahal Palace":            [{ provider:"Pink City Frames", cost:[260000,430000], specialties:["Vintage Photography","Royal Heritage Coverage"] }],
  "ITC Rajputana":                   [{ provider:"Pink City Frames", cost:[220000,370000], specialties:["Rajputana Heritage","Cultural Documentation"] }],
  "The House of MG":                 [{ provider:"Ahmedabad Lens", cost:[140000,240000], specialties:["Heritage Property Photography","Gujarati Cultural Events"] }],
  "Courtyard by Marriott Ahmedabad": [{ provider:"Ahmedabad Lens", cost:[130000,220000], specialties:["Corporate Photography","Modern Event Coverage"] }],
  "The Ummed Ahmedabad":             [{ provider:"Ahmedabad Lens", cost:[150000,250000], specialties:["Boutique Hotel Photography","Cultural Events"] }],
  "Hyatt Regency Ahmedabad":         [{ provider:"Ahmedabad Lens", cost:[160000,270000], specialties:["Luxury Event Photography","Grand Celebration Coverage"] }],
  "Novotel Ahmedabad":               [{ provider:"Ahmedabad Lens", cost:[130000,220000], specialties:["Modern Photography","Budget-Friendly Packages"] }],
  "Radisson Blu Coimbatore":         [{ provider:"Kovai Camera Works", cost:[130000,220000], specialties:["Contemporary Event Photography","Budget Coverage"] }],
  "Vivanta Coimbatore":              [{ provider:"Kovai Camera Works", cost:[140000,240000], specialties:["Heritage Photography","South Indian Culture"] }],
  "Le Meridien Coimbatore":          [{ provider:"Kovai Camera Works", cost:[150000,260000], specialties:["Luxury Photography","Candid Event Coverage"] }],
  "The Residency Towers":            [{ provider:"Kovai Camera Works", cost:[120000,200000], specialties:["Corporate Photography","Modern Coverage"] }],
  "Hyatt Regency Coimbatore":        [{ provider:"Kovai Camera Works", cost:[145000,245000], specialties:["Event Photography","Group Portraits"] }],
};

const PhotographySelection = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useEvent();
  const { venue } = formData;

  const options = photographyByVenue[venue] || [
    { provider:"Elite Captures", cost:[150000,300000], specialties:["Professional Event Photography","Candid & Formal Coverage"] }
  ];

  return (
    <PageWrapper title="Select Photography" onBack={() => navigate("/entertainment-selection")}>
      <div style={{ width:"90%", height:"10px", background:"#FFB347", borderRadius:"5px", margin:"0 auto 20px", overflow:"hidden" }}>
        <div style={{ width:"90%", height:"100%", background:"#D2691E" }} />
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"18px", maxWidth:"80%", margin:"0 auto" }}>
        {options.map((pkg, i) => (
          <button key={i}
            onClick={() => { setFormData((p) => ({ ...p, photography: { provider: pkg.provider, cost: pkg.cost, specialties: pkg.specialties } })); navigate("/guest-selection"); }}
            style={{ background:"#FFB347", color:"#222", fontSize:"0.88rem", fontWeight:"600", padding:"20px",
              borderRadius:"15px", cursor:"pointer", border:"none",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              gap:"6px", width:"260px", minHeight:"140px", transition:"all 0.2s", textAlign:"center" }}
            onMouseOver={(e) => { e.currentTarget.style.background="#D2691E"; e.currentTarget.style.color="#fff"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background="#FFB347"; e.currentTarget.style.color="#222"; e.currentTarget.style.transform="none"; }}>
            <strong style={{ fontSize:"1rem" }}>{pkg.provider}</strong>
            <span style={{ color:"#5a3000", fontWeight:"700" }}>₹{pkg.cost[0].toLocaleString()} – ₹{pkg.cost[1].toLocaleString()}</span>
            <small style={{ lineHeight:"1.4", opacity:0.85 }}>{pkg.specialties.join(" · ")}</small>
          </button>
        ))}
      </div>
      <button onClick={() => { setFormData((p) => ({ ...p, photography: null })); navigate("/guest-selection"); }}
        style={{ background:"#D2691E", color:"white", fontSize:"0.95rem", fontWeight:"600",
          padding:"13px 30px", borderRadius:"10px", cursor:"pointer", border:"none",
          marginTop:"20px", display:"block", marginLeft:"auto", marginRight:"auto" }}
        onMouseOver={(e) => { e.currentTarget.style.background="#B8561A"; }}
        onMouseOut={(e) => { e.currentTarget.style.background="#D2691E"; }}>
        Skip
      </button>
    </PageWrapper>
  );
};

export default PhotographySelection;
