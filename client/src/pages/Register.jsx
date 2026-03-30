import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  // STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  // AUTO AGE CALCULATE
  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // SUBMIT
 const handleSubmit = async (e) => {
  e.preventDefault();

  // EMPTY CHECK
  if (!name || !email || !password || !phone || !day || !month || !year || !gender || !address) {
    alert("Please fill all fields");
    return;
  }

  // EMAIL CHECK
  if (!email.includes("@")) {
    alert("Invalid email");
    return;
  }

  // PASSWORD CHECK
  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  // PHONE CHECK (10 digits)
  if (phone.length !== 10) {
    alert("Phone must be 10 digits");
    return;
  }

  // DOB VALIDATION
  const monthIndex = months.indexOf(month);
  const dobDate = new Date(year, monthIndex, day);
  const today = new Date();

  if (dobDate > today) {
    alert("Invalid DOB (future not allowed)");
    return;
  }

  // AGE CHECK
  const userAge = calculateAge(year, monthIndex, day);

  if (userAge < 18) {
    alert("You must be at least 18 years old");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/user/register", {
      name,
      email,
      password,
      phone,
      dob: `${year}-${monthIndex + 1}-${day}`,
      age: userAge,
      gender,
      address
    });

    alert("Registration Successful");
    navigate("/login");

  } catch (err) {
    console.log(err);
    alert("Registration Failed");
  }
};

  // STYLES
  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  };

  const btnStyle = {
    width: "100%",
    padding: "12px",
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh"
    }}>

      {/* RIGHT SIDE (FORM) */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5"
      }}>

        <div style={{
          width: "350px",
          padding: "30px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>

          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Register
          </h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />

            {/* DOB */}

        {/* DOB */}
        <input
          type="date"
          value={dob}
          max={new Date().toISOString().split("T")[0]} // ❌ future block
          onChange={(e) => {
            const selectedDate = e.target.value;
            setDob(selectedDate);
            setAge(calculateAge(selectedDate));
          }}
          style={inputStyle}
        />

        {/* AGE AUTO */}
        <input
          type="text"
          value={age}
          placeholder="Age"
          readOnly
          style={{
            ...inputStyle,
            background: "#f1f5f9",
            fontWeight: "bold"
          }}
        />           

            {/* GENDER */}
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {/* ADDRESS */}
            <textarea
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ ...inputStyle, height: "80px" }}
            />

            <button type="submit" style={btnStyle}>
              Register
            </button>

          </form>

          <p style={{ textAlign: "center", marginTop: "15px" }}>
            Already have account?{" "}
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