import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext";
import PageWrapper from "./PageWrapper";

const venueCatering = {
  "The Raviz Ashtamudi":             ["Malabar Feast","Kerala Delights","Spice Route Catering","Backwater Bites"],
  "JW Marriott Bangalore":           ["Bangalore Bites","South Side Caterers","Garden City Gourmet","Namma Nadu Kitchen"],
  "JW Marriott Kolkata":             ["Bengali Treats","Calcutta Kitchen","Eastern Flavours","Rosogolla Caterers"],
  "Leela Palace Chennai":            ["Chettinad Flavours","Madras Meals","Spice Route Caterers","Marina Bites"],
  "ITC Kohenur":                     ["Hyderabadi Zayka","Nizami Cuisine","Charminar Caterers","Dum Pukht Delights"],
  "Le Meridien Kochi":               ["Malabar Feast","Kerala Delights","Spice Route Catering","Backwater Bites"],
  "Vivanta Coimbatore":              ["Kovai Caterers","Taste of Kongu","Tamil Gourmet","Nilgiris Kitchen"],
  "ITC Grand Chola":                 ["Chettinad Flavours","Madras Meals","Spice Route Caterers","Marina Bites"],
  "Park Hyatt Chennai":              ["Chettinad Flavours","Madras Meals","Spice Route Caterers","Marina Bites"],
  "Rambagh Palace":                  ["Royal Rajasthan","Pink City Flavors","Desert Gourmet","Rajwada Caterers"],
  "The Leela Palace Bangalore":      ["Bangalore Bites","South Side Caterers","Garden City Gourmet","Namma Nadu Kitchen"],
  "Conrad Pune":                     ["Pune Platters","Deccan Delights","Maratha Gourmet","Sahyadri Kitchen"],
  "The St. Regis Mumbai":            ["Mumbai Masala","Taste of Bombay","Coastal Feast","Marine Drive Caterers"],
  "Taj Malabar Resort":              ["Malabar Feast","Kerala Delights","Spice Route Catering","Backwater Bites"],
  "Taj Mahal Palace":                ["Mumbai Masala","Taste of Bombay","Coastal Feast","Marine Drive Caterers"],
  "Radisson Blu Coimbatore":         ["Kovai Caterers","Taste of Kongu","Tamil Gourmet","Nilgiris Kitchen"],
  "The Residency Towers":            ["Kovai Caterers","Taste of Kongu","Tamil Gourmet","Nilgiris Kitchen"],
  "Hyatt Regency Kolkata":           ["Bengali Treats","Calcutta Kitchen","Eastern Flavours","Rosogolla Caterers"],
  "ITC Maratha":                     ["Mumbai Masala","Taste of Bombay","Coastal Feast","Marine Drive Caterers"],
  "The Oberoi New Delhi":            ["Delhi Delights","Capital Caterers","Spice Route","Purani Dilli Kitchen"],
  "JW Marriott Pune":                ["Pune Platters","Deccan Delights","Maratha Gourmet","Sahyadri Kitchen"],
  "The Westin Pune":                 ["Pune Platters","Deccan Delights","Maratha Gourmet","Sahyadri Kitchen"],
  "Fairmont Jaipur":                 ["Royal Rajasthan","Pink City Flavors","Desert Gourmet","Rajwada Caterers"],
  "Novotel Hyderabad":               ["Hyderabadi Zayka","Nizami Cuisine","Charminar Caterers","Dum Pukht Delights"],
  "The Ummed Ahmedabad":             ["Gujarati Gourmet","Ahmedabad Flavours","Veggie Delights","Kathiyawadi Kitchen"],
  "Taj Palace":                      ["Delhi Delights","Capital Caterers","Spice Route","Purani Dilli Kitchen"],
  "The Ritz-Carlton Bangalore":      ["Bangalore Bites","South Side Caterers","Garden City Gourmet","Namma Nadu Kitchen"],
  "Hyatt Regency Ahmedabad":         ["Gujarati Gourmet","Ahmedabad Flavours","Veggie Delights","Kathiyawadi Kitchen"],
  "The Oberoi Grand":                ["Bengali Treats","Calcutta Kitchen","Eastern Flavours","Rosogolla Caterers"],
  "Courtyard by Marriott Ahmedabad": ["Gujarati Gourmet","Ahmedabad Flavours","Veggie Delights","Kathiyawadi Kitchen"],
  "ITC Maurya":                      ["Delhi Delights","Capital Caterers","Spice Route","Purani Dilli Kitchen"],
  "Taj Coromandel":                  ["Chettinad Flavours","Madras Meals","Spice Route Caterers","Marina Bites"],
  "Grand Hyatt Kochi":               ["Malabar Feast","Kerala Delights","Spice Route Catering","Backwater Bites"],
  "The Westin Hyderabad":            ["Hyderabadi Zayka","Nizami Cuisine","Charminar Caterers","Dum Pukht Delights"],
  "The House of MG":                 ["Gujarati Gourmet","Ahmedabad Flavours","Veggie Delights","Kathiyawadi Kitchen"],
  "ITC Royal Bengal":                ["Bengali Treats","Calcutta Kitchen","Eastern Flavours","Rosogolla Caterers"],
  "Conrad Bangalore":                ["Bangalore Bites","South Side Caterers","Garden City Gourmet","Namma Nadu Kitchen"],
  "Sheraton Grand Bangalore":        ["Bangalore Bites","South Side Caterers","Garden City Gourmet","Namma Nadu Kitchen"],
  "The Westin Chennai":              ["Chettinad Flavours","Madras Meals","Spice Route Caterers","Marina Bites"],
  "Hyatt Regency Pune":              ["Pune Platters","Deccan Delights","Maratha Gourmet","Sahyadri Kitchen"],
  "Sheraton Grand Pune":             ["Pune Platters","Deccan Delights","Maratha Gourmet","Sahyadri Kitchen"],
  "Novotel Ahmedabad":               ["Gujarati Gourmet","Ahmedabad Flavours","Veggie Delights","Kathiyawadi Kitchen"],
  "Hyatt Regency Coimbatore":        ["Kovai Caterers","Taste of Kongu","Tamil Gourmet","Nilgiris Kitchen"],
  "Le Meridien Coimbatore":          ["Kovai Caterers","Taste of Kongu","Tamil Gourmet","Nilgiris Kitchen"],
  "Park Hyatt Hyderabad":            ["Hyderabadi Zayka","Nizami Cuisine","Charminar Caterers","Dum Pukht Delights"],
  "Taj Falaknuma Palace":            ["Hyderabadi Zayka","Nizami Cuisine","Charminar Caterers","Dum Pukht Delights"],
  "Four Seasons Mumbai":             ["Mumbai Masala","Taste of Bombay","Coastal Feast","Marine Drive Caterers"],
  "JW Marriott Mumbai":              ["Mumbai Masala","Taste of Bombay","Coastal Feast","Marine Drive Caterers"],
  "The Leela Palace Delhi":          ["Delhi Delights","Capital Caterers","Spice Route","Purani Dilli Kitchen"],
  "Hyatt Regency Delhi":             ["Delhi Delights","Capital Caterers","Spice Route","Purani Dilli Kitchen"],
  "The Leela Palace Jaipur":         ["Royal Rajasthan","Pink City Flavors","Desert Gourmet","Rajwada Caterers"],
  "Taj Jai Mahal Palace":            ["Royal Rajasthan","Pink City Flavors","Desert Gourmet","Rajwada Caterers"],
  "ITC Rajputana":                   ["Royal Rajasthan","Pink City Flavors","Desert Gourmet","Rajwada Caterers"],
};

const VenueCatering = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useEvent();
  const options = venueCatering[formData.venue] || ["Local Caterers","Standard Buffet","Premium Catering"];

  return (
    <PageWrapper title="Select Catering" onBack={() => navigate("/venue-selection")}>
      <div style={{ width:"80%", height:"10px", background:"#FFB347", borderRadius:"5px", margin:"0 auto 20px", overflow:"hidden" }}>
        <div style={{ width:"60%", height:"100%", background:"#D2691E" }} />
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"18px", maxWidth:"80%", margin:"0 auto" }}>
        {options.map((catering, i) => (
          <button key={i}
            onClick={() => { setFormData((p) => ({ ...p, catering })); navigate("/budget-selection"); }}
            style={{ background:"#FFB347", color:"#222", fontSize:"0.92rem", fontWeight:"600",
              padding:"20px", borderRadius:"15px", cursor:"pointer", border:"none",
              display:"flex", alignItems:"center", justifyContent:"center",
              width:"210px", height:"85px", transition:"all 0.2s", textAlign:"center" }}
            onMouseOver={(e) => { e.currentTarget.style.background="#D2691E"; e.currentTarget.style.color="#fff"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background="#FFB347"; e.currentTarget.style.color="#222"; e.currentTarget.style.transform="none"; }}>
            {catering}
          </button>
        ))}
      </div>
    </PageWrapper>
  );
};

export default VenueCatering;
