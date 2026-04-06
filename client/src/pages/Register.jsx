import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#1e3a8a",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const getAgeFromDob = (dob) => {
  if (!dob) {
    return "";
  }

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
};

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const age = getAgeFromDob(form.dob);

  const getRegisterErrorMessage = (error) => {
    if (!error.response) {
      return "Cannot connect to the server. Please make sure the backend is running on port 5000.";
    }

    if (error.response.status === 400) {
      if (error.response.data?.message === "User already exists") {
        return "An account with this email already exists. Please log in instead.";
      }
    }

    return error.response?.data?.message || "Registration failed";
  };

  const updateField = (field) => (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, phone, dob, gender, address } = form;

    if (!name || !email || !password || !phone || !dob || !gender || !address) {
      alert("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      alert("Invalid email");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone must be 10 digits");
      return;
    }

    if (age === "" || age < 18) {
      alert("You must be at least 18 years old");
      return;
    }

    setSubmitting(true);

    try {
      await API.post("/user/register", {
        ...form,
        age,
      });

      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert(getRegisterErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "350px",
            padding: "30px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={updateField("name")}
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={updateField("email")}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={updateField("password")}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={updateField("phone")}
              style={inputStyle}
            />

            <input
              type="date"
              value={form.dob}
              max={new Date().toISOString().split("T")[0]}
              onChange={updateField("dob")}
              style={inputStyle}
            />

            <input
              type="text"
              value={age}
              placeholder="Age"
              readOnly
              style={{
                ...inputStyle,
                background: "#f1f5f9",
                fontWeight: "bold",
              }}
            />

            <select
              value={form.gender}
              onChange={updateField("gender")}
              style={inputStyle}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <textarea
              placeholder="Address"
              value={form.address}
              onChange={updateField("address")}
              style={{ ...inputStyle, height: "80px" }}
            />

            <button type="submit" style={buttonStyle} disabled={submitting}>
              {submitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "15px" }}>
            Already have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
