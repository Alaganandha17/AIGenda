import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext";
import PageWrapper from "./PageWrapper";

// ALL venues per city — always have something to show
const venuesByCity = {
  "Kochi":      ["The Raviz Ashtamudi","Le Meridien Kochi","Taj Malabar Resort","Grand Hyatt Kochi"],
  "Delhi":      ["The Oberoi New Delhi","Taj Palace","ITC Maurya","The Leela Palace Delhi","Hyatt Regency Delhi"],
  "Kolkata":    ["JW Marriott Kolkata","ITC Royal Bengal","The Oberoi Grand","Hyatt Regency Kolkata"],
  "Bangalore":  ["JW Marriott Bangalore","The Leela Palace Bangalore","The Ritz-Carlton Bangalore","Conrad Bangalore","Sheraton Grand Bangalore"],
  "Chennai":    ["ITC Grand Chola","Park Hyatt Chennai","Taj Coromandel","Leela Palace Chennai","The Westin Chennai"],
  "Pune":       ["Conrad Pune","The Westin Pune","Hyatt Regency Pune","JW Marriott Pune","Sheraton Grand Pune"],
  "Ahmedabad":  ["The House of MG","Courtyard by Marriott Ahmedabad","The Ummed Ahmedabad","Hyatt Regency Ahmedabad","Novotel Ahmedabad"],
  "Coimbatore": ["Radisson Blu Coimbatore","Vivanta Coimbatore","Le Meridien Coimbatore","The Residency Towers","Hyatt Regency Coimbatore"],
  "Hyderabad":  ["ITC Kohenur","Novotel Hyderabad","The Westin Hyderabad","Taj Falaknuma Palace","Park Hyatt Hyderabad"],
  "Mumbai":     ["Taj Mahal Palace","ITC Maratha","JW Marriott Mumbai","The St. Regis Mumbai","Four Seasons Mumbai"],
  "Jaipur":     ["Rambagh Palace","Fairmont Jaipur","The Leela Palace Jaipur","Taj Jai Mahal Palace","ITC Rajputana"],
};

// Theme-experienced venues (subset of city venues) — best matches shown first
const experiencedVenues = {
  "Graduation": {
    "Memory Lane Throwback": { "Kochi":["The Raviz Ashtamudi","Le Meridien Kochi"], "Delhi":["The Oberoi New Delhi","Taj Palace"], "Bangalore":["JW Marriott Bangalore"], "Chennai":["ITC Grand Chola"], "Mumbai":["Taj Mahal Palace"] },
    "Red Carpet": { "Kolkata":["JW Marriott Kolkata","ITC Royal Bengal"], "Mumbai":["Taj Mahal Palace","JW Marriott Mumbai"], "Delhi":["The Leela Palace Delhi","ITC Maurya"], "Bangalore":["The Ritz-Carlton Bangalore"] },
    "Black and Gold": { "Hyderabad":["ITC Kohenur","Park Hyatt Hyderabad"], "Kochi":["Le Meridien Kochi","Grand Hyatt Kochi"], "Kolkata":["ITC Royal Bengal"], "Bangalore":["The Leela Palace Bangalore"], "Chennai":["ITC Grand Chola"] },
    "Grand Ballroom": { "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Bangalore":["The Ritz-Carlton Bangalore","Conrad Bangalore"], "Hyderabad":["Taj Falaknuma Palace"], "Chennai":["ITC Grand Chola"], "Kolkata":["JW Marriott Kolkata"] },
    "Tropical Gala": { "Kochi":["Taj Malabar Resort","Grand Hyatt Kochi"], "Chennai":["The Westin Chennai","Leela Palace Chennai"], "Mumbai":["Four Seasons Mumbai","JW Marriott Mumbai"], "Bangalore":["Sheraton Grand Bangalore"], "Hyderabad":["The Westin Hyderabad"] },
    "Retro": { "Ahmedabad":["The Ummed Ahmedabad","Novotel Ahmedabad"], "Bangalore":["JW Marriott Bangalore","Conrad Bangalore"], "Pune":["Sheraton Grand Pune"], "Mumbai":["ITC Maratha"], "Delhi":["ITC Maurya"] },
  },
  "Baby Shower": {
    "Boy or Girl": { "Bangalore":["JW Marriott Bangalore","The Ritz-Carlton Bangalore","Conrad Bangalore"], "Chennai":["Park Hyatt Chennai","The Westin Chennai"], "Pune":["Conrad Pune","Sheraton Grand Pune"], "Ahmedabad":["The House of MG","Courtyard by Marriott Ahmedabad"], "Delhi":["Taj Palace","Hyatt Regency Delhi"], "Coimbatore":["Radisson Blu Coimbatore","Vivanta Coimbatore"], "Mumbai":["JW Marriott Mumbai","Four Seasons Mumbai"], "Kochi":["Le Meridien Kochi","Grand Hyatt Kochi"], "Hyderabad":["Novotel Hyderabad","Park Hyatt Hyderabad"], "Kolkata":["JW Marriott Kolkata","Hyatt Regency Kolkata"] },
    "Pastel and Florals": { "Kochi":["Taj Malabar Resort","Le Meridien Kochi"], "Mumbai":["Taj Mahal Palace","Four Seasons Mumbai"], "Chennai":["Leela Palace Chennai","Park Hyatt Chennai"], "Bangalore":["The Leela Palace Bangalore","Sheraton Grand Bangalore"], "Pune":["Conrad Pune","JW Marriott Pune"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Coimbatore":["Le Meridien Coimbatore","Vivanta Coimbatore"] },
    "Tropical Gala": { "Jaipur":["Rambagh Palace","Fairmont Jaipur"], "Kochi":["Taj Malabar Resort","Grand Hyatt Kochi"], "Chennai":["The Westin Chennai","Leela Palace Chennai"], "Mumbai":["Four Seasons Mumbai"], "Bangalore":["Sheraton Grand Bangalore"] },
    "Animal/Jungle": { "Jaipur":["Rambagh Palace","Fairmont Jaipur","Taj Jai Mahal Palace"], "Pune":["Conrad Pune","Hyatt Regency Pune"], "Bangalore":["The Ritz-Carlton Bangalore","Sheraton Grand Bangalore"], "Chennai":["ITC Grand Chola"], "Hyderabad":["Taj Falaknuma Palace","Novotel Hyderabad"], "Mumbai":["Four Seasons Mumbai"] },
    "Princess/Fairytale": { "Hyderabad":["Taj Falaknuma Palace","ITC Kohenur","Novotel Hyderabad"], "Jaipur":["Rambagh Palace","Fairmont Jaipur","The Leela Palace Jaipur"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Bangalore":["The Ritz-Carlton Bangalore"], "Chennai":["Leela Palace Chennai"] },
  },
  "Bridal Shower": {
    "Brunch with Bride": { "Chennai":["Leela Palace Chennai","Taj Coromandel"], "Pune":["Conrad Pune","JW Marriott Pune"], "Bangalore":["The Leela Palace Bangalore","Sheraton Grand Bangalore"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Hyderabad":["Park Hyatt Hyderabad","The Westin Hyderabad"], "Kochi":["Le Meridien Kochi","Grand Hyatt Kochi"] },
    "Glam Night": { "Kochi":["Le Meridien Kochi","The Raviz Ashtamudi"], "Bangalore":["The Leela Palace Bangalore","The Ritz-Carlton Bangalore"], "Hyderabad":["ITC Kohenur","Taj Falaknuma Palace"], "Coimbatore":["Le Meridien Coimbatore","Vivanta Coimbatore"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","ITC Maurya"], "Chennai":["ITC Grand Chola","Leela Palace Chennai"], "Pune":["Conrad Pune","JW Marriott Pune"] },
    "Pastel and Florals": { "Kochi":["Taj Malabar Resort","Le Meridien Kochi"], "Mumbai":["Taj Mahal Palace","Four Seasons Mumbai"], "Chennai":["Leela Palace Chennai","Park Hyatt Chennai"], "Bangalore":["The Leela Palace Bangalore","Sheraton Grand Bangalore"], "Pune":["Conrad Pune","JW Marriott Pune"], "Delhi":["The Leela Palace Delhi"] },
    "Tropical Gala": { "Jaipur":["Rambagh Palace","Fairmont Jaipur"], "Kochi":["Taj Malabar Resort","Grand Hyatt Kochi"], "Chennai":["The Westin Chennai","Leela Palace Chennai"], "Mumbai":["Four Seasons Mumbai"] },
    "Candlelight": { "Hyderabad":["ITC Kohenur","Taj Falaknuma Palace"], "Pune":["Conrad Pune","JW Marriott Pune"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Kolkata":["JW Marriott Kolkata","The Oberoi Grand"], "Bangalore":["The Ritz-Carlton Bangalore","Conrad Bangalore"] },
    "Floral": { "Hyderabad":["ITC Kohenur","Park Hyatt Hyderabad"], "Kolkata":["ITC Royal Bengal","JW Marriott Kolkata"], "Pune":["JW Marriott Pune","Conrad Pune"], "Chennai":["Leela Palace Chennai","Park Hyatt Chennai"], "Bangalore":["The Leela Palace Bangalore","Sheraton Grand Bangalore"], "Mumbai":["Taj Mahal Palace","Four Seasons Mumbai"] },
  },
  "Anniversary": {
    "Candlelight": { "Hyderabad":["ITC Kohenur","Taj Falaknuma Palace"], "Pune":["Conrad Pune","JW Marriott Pune"], "Ahmedabad":["Courtyard by Marriott Ahmedabad","Hyatt Regency Ahmedabad"], "Coimbatore":["Vivanta Coimbatore","Le Meridien Coimbatore"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Bangalore":["The Ritz-Carlton Bangalore","Conrad Bangalore"], "Kolkata":["The Oberoi Grand","JW Marriott Kolkata"] },
    "Floral": { "Hyderabad":["ITC Kohenur","Park Hyatt Hyderabad"], "Kolkata":["ITC Royal Bengal","JW Marriott Kolkata"], "Pune":["JW Marriott Pune","Conrad Pune"], "Chennai":["Leela Palace Chennai","Park Hyatt Chennai"], "Bangalore":["The Leela Palace Bangalore"], "Mumbai":["Taj Mahal Palace","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi"] },
    "Parisian Love": { "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Bangalore":["The Ritz-Carlton Bangalore","Conrad Bangalore"], "Chennai":["ITC Grand Chola","Leela Palace Chennai"], "Kolkata":["The Oberoi Grand"] },
    "Tropical Gala": { "Jaipur":["Rambagh Palace","Fairmont Jaipur"], "Kochi":["Taj Malabar Resort","Grand Hyatt Kochi"], "Chennai":["The Westin Chennai"], "Mumbai":["Four Seasons Mumbai"] },
    "Rustic": { "Pune":["JW Marriott Pune","Sheraton Grand Pune"], "Delhi":["The Oberoi New Delhi","Hyatt Regency Delhi"], "Coimbatore":["Vivanta Coimbatore","Hyatt Regency Coimbatore"], "Jaipur":["Rambagh Palace","Taj Jai Mahal Palace"], "Bangalore":["Conrad Bangalore"] },
    "Grand Ballroom": { "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Bangalore":["The Ritz-Carlton Bangalore"], "Hyderabad":["Taj Falaknuma Palace","ITC Kohenur"], "Chennai":["ITC Grand Chola"], "Kolkata":["JW Marriott Kolkata"] },
  },
  "Corporate": {
    "Luxury White Collar": { "Coimbatore":["Vivanta Coimbatore","Le Meridien Coimbatore"], "Kolkata":["Hyatt Regency Kolkata","JW Marriott Kolkata"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Bangalore":["Conrad Bangalore","Sheraton Grand Bangalore"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Hyderabad":["ITC Kohenur","Park Hyatt Hyderabad"], "Chennai":["ITC Grand Chola","The Westin Chennai"] },
    "All Black Meet": { "Mumbai":["Taj Mahal Palace","ITC Maratha"], "Kolkata":["The Oberoi Grand","ITC Royal Bengal"], "Delhi":["ITC Maurya","The Leela Palace Delhi"], "Bangalore":["The Ritz-Carlton Bangalore","Conrad Bangalore"], "Hyderabad":["ITC Kohenur","Taj Falaknuma Palace"], "Chennai":["ITC Grand Chola","Park Hyatt Chennai"] },
    "Tech and Innovation": { "Coimbatore":["The Residency Towers","Le Meridien Coimbatore"], "Hyderabad":["The Westin Hyderabad","Park Hyatt Hyderabad"], "Bangalore":["The Leela Palace Bangalore","Conrad Bangalore"], "Kochi":["Le Meridien Kochi","Grand Hyatt Kochi","Taj Malabar Resort"], "Mumbai":["JW Marriott Mumbai","Four Seasons Mumbai"], "Pune":["Hyatt Regency Pune","Sheraton Grand Pune"], "Chennai":["ITC Grand Chola","The Westin Chennai"] },
    "Minimalistic": { "Mumbai":["JW Marriott Mumbai","Four Seasons Mumbai"], "Chennai":["Taj Coromandel","The Westin Chennai"], "Delhi":["ITC Maurya","Hyatt Regency Delhi"], "Bangalore":["Sheraton Grand Bangalore","Conrad Bangalore"], "Pune":["The Westin Pune","Hyatt Regency Pune"], "Hyderabad":["The Westin Hyderabad","Novotel Hyderabad"] },
    "Grand Ballroom": { "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Bangalore":["The Ritz-Carlton Bangalore"], "Hyderabad":["Taj Falaknuma Palace","ITC Kohenur"], "Chennai":["ITC Grand Chola"], "Kolkata":["JW Marriott Kolkata"] },
    "Startup Investor Pitch": { "Bangalore":["The Leela Palace Bangalore","The Ritz-Carlton Bangalore","Conrad Bangalore"], "Hyderabad":["ITC Kohenur","The Westin Hyderabad"], "Kochi":["Grand Hyatt Kochi","Le Meridien Kochi"], "Mumbai":["JW Marriott Mumbai","The St. Regis Mumbai"], "Coimbatore":["The Residency Towers","Le Meridien Coimbatore"], "Pune":["Hyatt Regency Pune","JW Marriott Pune"], "Delhi":["Hyatt Regency Delhi","The Leela Palace Delhi"], "Chennai":["ITC Grand Chola","The Westin Chennai"] },
  },
  "Conference": {
    "AI and Future Tech": { "Jaipur":["Rambagh Palace","Fairmont Jaipur"], "Bangalore":["Conrad Bangalore","The Leela Palace Bangalore"], "Hyderabad":["The Westin Hyderabad","ITC Kohenur"], "Mumbai":["JW Marriott Mumbai","The St. Regis Mumbai"], "Delhi":["Hyatt Regency Delhi","The Leela Palace Delhi"], "Chennai":["ITC Grand Chola","The Westin Chennai"], "Pune":["Hyatt Regency Pune"] },
    "Startup Investor Pitch": { "Bangalore":["The Leela Palace Bangalore","The Ritz-Carlton Bangalore","Conrad Bangalore"], "Hyderabad":["ITC Kohenur","The Westin Hyderabad"], "Kochi":["Grand Hyatt Kochi","Le Meridien Kochi"], "Mumbai":["JW Marriott Mumbai","The St. Regis Mumbai"], "Coimbatore":["The Residency Towers","Le Meridien Coimbatore"], "Pune":["Hyatt Regency Pune","JW Marriott Pune"], "Delhi":["Hyatt Regency Delhi","The Leela Palace Delhi"], "Chennai":["ITC Grand Chola","The Westin Chennai"] },
    "Sustainable Business Growth": { "Jaipur":["Fairmont Jaipur","Rambagh Palace"], "Pune":["Hyatt Regency Pune","JW Marriott Pune"], "Hyderabad":["ITC Kohenur","The Westin Hyderabad"], "Bangalore":["Conrad Bangalore","Sheraton Grand Bangalore"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Mumbai":["JW Marriott Mumbai"], "Chennai":["The Westin Chennai"] },
    "Women in Leadership": { "Delhi":["Taj Palace","The Leela Palace Delhi","Hyatt Regency Delhi"], "Kolkata":["JW Marriott Kolkata","Hyatt Regency Kolkata"], "Chennai":["ITC Grand Chola","Leela Palace Chennai"], "Jaipur":["Rambagh Palace","Fairmont Jaipur"], "Bangalore":["The Ritz-Carlton Bangalore","Conrad Bangalore"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Hyderabad":["Park Hyatt Hyderabad"] },
    "Tech and Innovation": { "Coimbatore":["The Residency Towers","Le Meridien Coimbatore"], "Hyderabad":["The Westin Hyderabad","Park Hyatt Hyderabad"], "Bangalore":["The Leela Palace Bangalore","Conrad Bangalore"], "Kochi":["Le Meridien Kochi","Grand Hyatt Kochi"], "Mumbai":["JW Marriott Mumbai","Four Seasons Mumbai"], "Pune":["Hyatt Regency Pune","Sheraton Grand Pune"], "Chennai":["ITC Grand Chola","The Westin Chennai"] },
    "Luxury White Collar": { "Coimbatore":["Vivanta Coimbatore","Le Meridien Coimbatore"], "Kolkata":["Hyatt Regency Kolkata","JW Marriott Kolkata"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Bangalore":["Conrad Bangalore","Sheraton Grand Bangalore"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Hyderabad":["ITC Kohenur","Park Hyatt Hyderabad"], "Chennai":["ITC Grand Chola"] },
  },
  "Birthday": {
    "Sports": { "Chennai":["ITC Grand Chola","The Westin Chennai"], "Coimbatore":["The Residency Towers","Hyatt Regency Coimbatore"], "Bangalore":["JW Marriott Bangalore","Sheraton Grand Bangalore"], "Mumbai":["JW Marriott Mumbai","ITC Maratha"], "Delhi":["Hyatt Regency Delhi","Taj Palace"], "Hyderabad":["The Westin Hyderabad","Novotel Hyderabad"], "Pune":["Hyatt Regency Pune","Sheraton Grand Pune"] },
    "Superhero": { "Pune":["Conrad Pune","Hyatt Regency Pune"], "Hyderabad":["Novotel Hyderabad","Park Hyatt Hyderabad"], "Bangalore":["JW Marriott Bangalore","The Ritz-Carlton Bangalore"], "Mumbai":["JW Marriott Mumbai","ITC Maratha"], "Delhi":["Taj Palace","Hyatt Regency Delhi"], "Chennai":["ITC Grand Chola","The Westin Chennai"] },
    "Animal/Jungle": { "Jaipur":["Fairmont Jaipur","Rambagh Palace","Taj Jai Mahal Palace"], "Pune":["Conrad Pune","Hyatt Regency Pune"], "Bangalore":["The Ritz-Carlton Bangalore","Sheraton Grand Bangalore"], "Chennai":["ITC Grand Chola"], "Hyderabad":["Taj Falaknuma Palace","Novotel Hyderabad"], "Mumbai":["Four Seasons Mumbai"] },
    "Carnival Fiesta": { "Ahmedabad":["Hyatt Regency Ahmedabad","The Ummed Ahmedabad","Novotel Ahmedabad"], "Hyderabad":["Novotel Hyderabad","The Westin Hyderabad"], "Mumbai":["JW Marriott Mumbai","ITC Maratha"], "Bangalore":["Conrad Bangalore","JW Marriott Bangalore"], "Pune":["Sheraton Grand Pune","JW Marriott Pune"], "Delhi":["Taj Palace","Hyatt Regency Delhi"], "Kochi":["Grand Hyatt Kochi","Le Meridien Kochi"] },
    "Retro": { "Ahmedabad":["The Ummed Ahmedabad","Novotel Ahmedabad"], "Bangalore":["JW Marriott Bangalore","Conrad Bangalore"], "Pune":["Sheraton Grand Pune","The Westin Pune"], "Mumbai":["ITC Maratha","JW Marriott Mumbai"], "Delhi":["ITC Maurya","Hyatt Regency Delhi"], "Kolkata":["ITC Royal Bengal","Hyatt Regency Kolkata"] },
    "Princess/Fairytale": { "Hyderabad":["Taj Falaknuma Palace","ITC Kohenur","Novotel Hyderabad"], "Jaipur":["Rambagh Palace","Fairmont Jaipur","The Leela Palace Jaipur"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Bangalore":["The Ritz-Carlton Bangalore"], "Chennai":["Leela Palace Chennai"] },
    "Glam Night": { "Kochi":["Le Meridien Kochi","The Raviz Ashtamudi"], "Bangalore":["The Leela Palace Bangalore","The Ritz-Carlton Bangalore"], "Hyderabad":["ITC Kohenur","Taj Falaknuma Palace"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","ITC Maurya"], "Chennai":["ITC Grand Chola","Leela Palace Chennai"], "Pune":["Conrad Pune","JW Marriott Pune"] },
    "Tropical Gala": { "Jaipur":["Rambagh Palace","Fairmont Jaipur"], "Kochi":["Taj Malabar Resort","Grand Hyatt Kochi"], "Chennai":["The Westin Chennai","Leela Palace Chennai"], "Mumbai":["Four Seasons Mumbai","JW Marriott Mumbai"], "Bangalore":["Sheraton Grand Bangalore"] },
  },
  "Family Meet": {
    "Karaoke and Dance Battle": { "Hyderabad":["ITC Kohenur","Novotel Hyderabad","The Westin Hyderabad"], "Coimbatore":["The Residency Towers","Hyatt Regency Coimbatore"], "Ahmedabad":["Courtyard by Marriott Ahmedabad","Hyatt Regency Ahmedabad"], "Mumbai":["JW Marriott Mumbai","ITC Maratha"], "Bangalore":["Conrad Bangalore","JW Marriott Bangalore"], "Pune":["Sheraton Grand Pune","JW Marriott Pune"], "Delhi":["Taj Palace","Hyatt Regency Delhi"] },
    "Storytelling and Memory Lane": { "Mumbai":["ITC Maratha","JW Marriott Mumbai"], "Kolkata":["ITC Royal Bengal","The Oberoi Grand"], "Delhi":["ITC Maurya","Taj Palace"], "Bangalore":["JW Marriott Bangalore","Conrad Bangalore"], "Chennai":["ITC Grand Chola","Park Hyatt Chennai"] },
    "Retro Throwback": { "Pune":["The Westin Pune","Sheraton Grand Pune"], "Ahmedabad":["The Ummed Ahmedabad","Novotel Ahmedabad"], "Bangalore":["JW Marriott Bangalore","Conrad Bangalore"], "Mumbai":["ITC Maratha","JW Marriott Mumbai"], "Delhi":["ITC Maurya","Hyatt Regency Delhi"], "Kolkata":["ITC Royal Bengal","Hyatt Regency Kolkata"] },
    "Family Talent Show": { "Kolkata":["The Oberoi Grand","ITC Royal Bengal","JW Marriott Kolkata"], "Mumbai":["JW Marriott Mumbai","ITC Maratha"], "Delhi":["Taj Palace","Hyatt Regency Delhi"], "Bangalore":["JW Marriott Bangalore","Sheraton Grand Bangalore"], "Chennai":["ITC Grand Chola","The Westin Chennai"], "Hyderabad":["Novotel Hyderabad","The Westin Hyderabad"] },
    "Carnival Fiesta": { "Ahmedabad":["Hyatt Regency Ahmedabad","The Ummed Ahmedabad","Novotel Ahmedabad"], "Hyderabad":["Novotel Hyderabad","The Westin Hyderabad"], "Mumbai":["JW Marriott Mumbai","ITC Maratha"], "Bangalore":["Conrad Bangalore","JW Marriott Bangalore"], "Pune":["Sheraton Grand Pune"], "Kochi":["Grand Hyatt Kochi"] },
    "Sports": { "Chennai":["ITC Grand Chola","The Westin Chennai"], "Coimbatore":["The Residency Towers","Hyatt Regency Coimbatore"], "Bangalore":["JW Marriott Bangalore","Sheraton Grand Bangalore"], "Mumbai":["JW Marriott Mumbai","ITC Maratha"], "Delhi":["Hyatt Regency Delhi","Taj Palace"], "Hyderabad":["The Westin Hyderabad","Novotel Hyderabad"], "Pune":["Hyatt Regency Pune","Sheraton Grand Pune"] },
  },
  "Wedding": {
    "Minimalistic": { "Delhi":["ITC Maurya","The Oberoi New Delhi"], "Mumbai":["ITC Maratha","JW Marriott Mumbai"], "Chennai":["ITC Grand Chola","Taj Coromandel"], "Bangalore":["Sheraton Grand Bangalore","Conrad Bangalore"], "Pune":["The Westin Pune","Hyatt Regency Pune"], "Hyderabad":["The Westin Hyderabad","Novotel Hyderabad"], "Kolkata":["ITC Royal Bengal","The Oberoi Grand"] },
    "Rustic": { "Pune":["JW Marriott Pune","Sheraton Grand Pune"], "Delhi":["The Oberoi New Delhi","Hyatt Regency Delhi"], "Coimbatore":["Vivanta Coimbatore","Hyatt Regency Coimbatore"], "Jaipur":["Rambagh Palace","Taj Jai Mahal Palace"], "Bangalore":["Conrad Bangalore","JW Marriott Bangalore"], "Mumbai":["ITC Maratha","JW Marriott Mumbai"] },
    "Grand Ballroom": { "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Bangalore":["The Ritz-Carlton Bangalore","Conrad Bangalore"], "Hyderabad":["Taj Falaknuma Palace","ITC Kohenur"], "Chennai":["ITC Grand Chola","Leela Palace Chennai"], "Kolkata":["JW Marriott Kolkata","The Oberoi Grand"] },
    "Floral": { "Hyderabad":["ITC Kohenur","Taj Falaknuma Palace"], "Kolkata":["ITC Royal Bengal","JW Marriott Kolkata"], "Pune":["JW Marriott Pune","Conrad Pune"], "Chennai":["Leela Palace Chennai","Park Hyatt Chennai"], "Bangalore":["The Leela Palace Bangalore","Sheraton Grand Bangalore"], "Mumbai":["Taj Mahal Palace","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi"] },
    "Candlelight": { "Hyderabad":["ITC Kohenur","Taj Falaknuma Palace"], "Pune":["Conrad Pune","JW Marriott Pune"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Kolkata":["The Oberoi Grand","JW Marriott Kolkata"], "Bangalore":["The Ritz-Carlton Bangalore"] },
    "Tropical Gala": { "Jaipur":["Rambagh Palace","Fairmont Jaipur"], "Kochi":["Taj Malabar Resort","Grand Hyatt Kochi"], "Chennai":["The Westin Chennai","Leela Palace Chennai"], "Mumbai":["Four Seasons Mumbai","JW Marriott Mumbai"] },
  },
  "Reception": {
    "Classic Reception": { "Coimbatore":["Radisson Blu Coimbatore","Vivanta Coimbatore","Le Meridien Coimbatore"], "Jaipur":["Rambagh Palace","Fairmont Jaipur"], "Kochi":["Taj Malabar Resort","Grand Hyatt Kochi"], "Bangalore":["JW Marriott Bangalore","The Leela Palace Bangalore","The Ritz-Carlton Bangalore"], "Delhi":["ITC Maurya","Taj Palace","The Oberoi New Delhi"], "Ahmedabad":["Courtyard by Marriott Ahmedabad","Hyatt Regency Ahmedabad"], "Mumbai":["Taj Mahal Palace","JW Marriott Mumbai"], "Chennai":["ITC Grand Chola","Leela Palace Chennai"], "Hyderabad":["ITC Kohenur","The Westin Hyderabad"], "Pune":["JW Marriott Pune","Conrad Pune"], "Kolkata":["JW Marriott Kolkata","ITC Royal Bengal"] },
    "Grand Ballroom": { "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Bangalore":["The Ritz-Carlton Bangalore","Conrad Bangalore"], "Hyderabad":["Taj Falaknuma Palace","ITC Kohenur"], "Chennai":["ITC Grand Chola","Leela Palace Chennai"], "Kolkata":["JW Marriott Kolkata"], "Jaipur":["Rambagh Palace","Taj Jai Mahal Palace"] },
    "Floral": { "Hyderabad":["ITC Kohenur","Park Hyatt Hyderabad"], "Kolkata":["ITC Royal Bengal","JW Marriott Kolkata"], "Pune":["JW Marriott Pune","Conrad Pune"], "Chennai":["Leela Palace Chennai","Park Hyatt Chennai"], "Bangalore":["The Leela Palace Bangalore","Sheraton Grand Bangalore"], "Mumbai":["Taj Mahal Palace","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi"] },
    "Candlelight": { "Hyderabad":["ITC Kohenur","Taj Falaknuma Palace"], "Pune":["Conrad Pune","JW Marriott Pune"], "Mumbai":["The St. Regis Mumbai","Four Seasons Mumbai"], "Delhi":["The Leela Palace Delhi","Hyatt Regency Delhi"], "Kolkata":["The Oberoi Grand"], "Bangalore":["The Ritz-Carlton Bangalore"] },
    "Tropical Gala": { "Jaipur":["Rambagh Palace","Fairmont Jaipur"], "Kochi":["Taj Malabar Resort","Grand Hyatt Kochi"], "Chennai":["The Westin Chennai"], "Mumbai":["Four Seasons Mumbai"] },
    "Rustic": { "Pune":["JW Marriott Pune","Sheraton Grand Pune"], "Delhi":["The Oberoi New Delhi"], "Coimbatore":["Vivanta Coimbatore"], "Jaipur":["Rambagh Palace","Taj Jai Mahal Palace"], "Bangalore":["Conrad Bangalore"] },
  },
};

const VenueSelection = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useEvent();
  const { eventType, theme, city } = formData;

  const experienced = experiencedVenues[eventType]?.[theme]?.[city] || [];
  const allInCity = venuesByCity[city] || [];
  const alternatives = allInCity.filter((v) => !experienced.includes(v));

  const VenueBtn = ({ venue, highlight }) => (
    <button onClick={() => { setFormData((p) => ({ ...p, venue })); navigate("/venue-catering"); }}
      style={{ background: highlight ? "#FFB347" : "rgba(255,179,71,0.55)",
        color:"#222", fontSize:"0.88rem", fontWeight:"600", padding:"16px 12px", borderRadius:"14px",
        cursor:"pointer", border: highlight ? "2px solid #D2691E" : "1px solid rgba(210,105,30,0.3)",
        display:"flex", alignItems:"center", justifyContent:"center",
        width:"175px", height:"70px", textAlign:"center", transition:"all 0.2s", lineHeight:"1.3" }}
      onMouseOver={(e) => { e.currentTarget.style.background="#D2691E"; e.currentTarget.style.color="#fff"; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseOut={(e) => { e.currentTarget.style.background=highlight?"#FFB347":"rgba(255,179,71,0.55)"; e.currentTarget.style.color="#222"; e.currentTarget.style.transform="none"; }}>
      {venue}
    </button>
  );

  return (
    <PageWrapper title={`Select Venue in ${city}`} onBack={() => navigate("/city-selection")}>
      <div style={{ width:"80%", height:"10px", background:"#FFB347", borderRadius:"5px", margin:"0 auto 20px", overflow:"hidden" }}>
        <div style={{ width:"44%", height:"100%", background:"#D2691E" }} />
      </div>
      {experienced.length > 0 && (
        <>
          <p style={{ textAlign:"center", color:"#111", fontWeight:"600", marginBottom:"12px" }}>
             These venues have hosted <strong>{theme}</strong> events before
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"14px", maxWidth:"80%", margin:"0 auto 20px" }}>
            {experienced.map((v, i) => <VenueBtn key={i} venue={v} highlight={true} />)}
          </div>
        </>
      )}
      {alternatives.length > 0 && (
        <>
          <p style={{ textAlign:"center", color:"#555", fontSize:"0.95rem", marginBottom:"12px" }}>
            {experienced.length > 0 ? ` More great venues in ${city}` : ` Bold choice — be the first to host ${theme} here!`}
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"14px", maxWidth:"80%", margin:"0 auto" }}>
            {alternatives.map((v, i) => <VenueBtn key={i} venue={v} highlight={false} />)}
          </div>
        </>
      )}
    </PageWrapper>
  );
};

export default VenueSelection;
