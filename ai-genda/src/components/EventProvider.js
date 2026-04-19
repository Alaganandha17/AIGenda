import { useState } from "react";
import { EventContext } from "./EventContext";

const EventProvider = ({ children }) => {
    const [formData, setFormData] = useState(() => {
        try {
            const saved = localStorage.getItem("aigenda_formData");
            return saved ? JSON.parse(saved) : { eventType:"", theme:"", guestCount:"", catering:"" };
        } catch {
            return { eventType:"", theme:"", guestCount:"", catering:"" };
        }
    });

    const [eventPlanResponse, setEventPlanResponse] = useState(null);

    const setFormDataPersisted = (updater) => {
        setFormData((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            localStorage.setItem("aigenda_formData", JSON.stringify(next));
            return next;
        });
    };

    return (
        <EventContext.Provider value={{ formData, setFormData: setFormDataPersisted, eventPlanResponse, setEventPlanResponse }}>
            {children}
        </EventContext.Provider>
    );
};

export default EventProvider;
