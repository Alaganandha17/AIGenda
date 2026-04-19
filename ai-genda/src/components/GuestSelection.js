import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext";
import PageWrapper from "./PageWrapper";

// Guest count data (adjusted to multiples of 5)
const guest_count_by_city = {
    "Kochi": { min_guests: 115, max_guests: 745, average_guests: 480 },
    "Bangalore": { min_guests: 100, max_guests: 825, average_guests: 415 },
    "Kolkata": { min_guests: 230, max_guests: 720, average_guests: 475 },
    "Chennai": { min_guests: 235, max_guests: 945, average_guests: 585 },
    "Hyderabad": { min_guests: 155, max_guests: 955, average_guests: 555 },
    "Coimbatore": { min_guests: 105, max_guests: 935, average_guests: 520 },
    "Mumbai": { min_guests: 100, max_guests: 970, average_guests: 490 },
    "Pune": { min_guests: 225, max_guests: 820, average_guests: 475 },
    "Jaipur": { min_guests: 340, max_guests: 730, average_guests: 485 },
    "Ahmedabad": { min_guests: 65, max_guests: 925, average_guests: 425 },
    "Delhi": { min_guests: 115, max_guests: 840, average_guests: 500 }
};

const GuestSelection = () => {
    const navigate = useNavigate();
    const { formData, setFormData } = useEvent();
    const { city } = formData;

    // Get city-specific guest count data
    const cityGuestData = guest_count_by_city[city] || { min_guests: 50, max_guests: 500, average_guests: 275 };

    // Define dynamic ranges based on min, max, and average guests (rounded to multiples of 5)
    const guestCounts = [
        `Below ${cityGuestData.min_guests}`,
        `${cityGuestData.min_guests}-${cityGuestData.average_guests}`,
        `${cityGuestData.average_guests}-${cityGuestData.max_guests}`,
        `Above ${cityGuestData.max_guests}`
    ];

    return (
        <PageWrapper title={`Select Guest Count `} onBack={() => navigate("/photography-selection")}>
            
            {/* Progress Bar */}
            <div
                style={{
                    width: "80%",
                    height: "10px",
                    background: "#FFB347",
                    borderRadius: "5px",
                    margin: "0 auto 20px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: "90%",  // Adjusted for progress tracking
                        height: "100%",
                        background: "#D2691E",
                    }}
                ></div>
            </div>

            {/* Guest Count Selection */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "20px",
                    maxWidth: "80%",
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                {guestCounts.map((count, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setFormData((prev) => ({ ...prev, guestCount: count }));
                            navigate("/final"); //  Updated to navigate to Final Page
                        }}
                        style={{
                            background: "#FFB347",
                            color: "#222",
                            fontSize: "0.9rem",
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
                            textTransform: "uppercase",
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
                        {count}
                    </button>
                ))}
            </div>
        </PageWrapper>
    );
};

export default GuestSelection;
