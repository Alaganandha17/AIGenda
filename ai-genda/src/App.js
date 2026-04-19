import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import HomePage from './components/homePage';
import LoginPage from "./components/LoginPage";
import SignUp from "./components/SignUp";  
import EventSelectionPage from "./components/EventSelectionPage";
import ThemeSelection from "./components/ThemeSelection";
import CitySelection from "./components/CitySelection";  
import VenueSelection from "./components/VenueSelection";  
import VenueCatering from "./components/VenueCatering";
import GuestSelection from "./components/GuestSelection";
import EntertainmentSelection from "./components/EntertainmentSelection";  
import PhotographySelection from "./components/PhotographySelection";  
import BudgetSelection from "./components/BudgetSelection";
import FinalPage from "./components/FinalPage";
import EventPlanPage from "./components/EventPlanPage";
import EventProvider from "./components/EventProvider"; 
import ExistingPlans from "./components/ExistingPlans";

function App() {
  return (
    <Router> 
      <EventProvider> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />  
          <Route path="/existing-plans" element={<ExistingPlans />} />  

          <Route path="/event-selection" element={<EventSelectionPage />} />
          <Route path="/theme-selection" element={<ThemeSelection />} />
          <Route path="/city-selection" element={<CitySelection />} />  
          <Route path="/venue-selection" element={<VenueSelection />} />  
          <Route path="/venue-catering" element={<VenueCatering />} />
          <Route path="/guest-selection" element={<GuestSelection />} />
          <Route path="/entertainment-selection" element={<EntertainmentSelection />} />
          <Route path="/photography-selection" element={<PhotographySelection />} />  
          <Route path="/budget-selection" element={<BudgetSelection />} />
          <Route path="/final" element={<FinalPage />} />
          <Route path="/event-plan" element={<EventPlanPage />} />
        </Routes>
      </EventProvider>
    </Router>
  );
}

export default App;
