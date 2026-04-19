import { useState, useEffect } from "react";

const SignUp = () => {
  // Load users from localStorage (if available) or start with an empty array
  const [users, setUsers] = useState(() => {
    return JSON.parse(localStorage.getItem("users")) || [];
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  return (
    <div>
      {/* Signup Form Goes Here */}
    </div>
  );
};
export default SignUp;
