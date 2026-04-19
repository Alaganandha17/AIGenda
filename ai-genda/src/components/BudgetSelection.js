import { useNavigate } from "react-router-dom";
import { useEvent } from "./EventContext";
import PageWrapper from "./PageWrapper";

const BudgetSelection = () => {
    const navigate = useNavigate();
    const { formData, setFormData } = useEvent();

    const budgetRanges = [
        "< ₹20L",
        "₹20L-₹40L",
        "₹40L-₹60L",
        "₹60L-₹80L",
        "₹80L-₹1Cr"
    ];

    const handleSelect = (range) => {
        setFormData({ ...formData, budgetRange: range });
        navigate("/entertainment-selection"); //  Updated to Guest Selection Page
    };

    return (
        <PageWrapper title="Select Your Budget Range" onBack={() => navigate("/city-selection")}> 
            
            {/* Progress Bar (4/9 completion) */}
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
                        width: "44%", // Adjust progress to reflect step completion
                        height: "100%",
                        background: "#D2691E",
                        transition: "width 0.5s ease-in-out",
                    }}
                ></div>
            </div>

            {/* Budget Selection Heading */}
            <p style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "600", marginBottom: "20px" }}>
                Choose a budget range that best fits your event.
            </p>

            {/* Budget Buttons */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                    maxWidth: "90%",
                    margin: "0 auto",
                }}
            >
                {budgetRanges.map((range, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(range)}
                        style={{
                            background: "#FFB347",
                            color: "#222",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                            padding: "15px 30px",
                            borderRadius: "10px",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "background 0.2s ease-in-out, color 0.2s ease-in-out",
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
                        {range}
                    </button>
                ))}
            </div>
        </PageWrapper>
    );
};

export default BudgetSelection;
