import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("user");

  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/user/login",
      { email, password}
    );

    alert("Login Successful");
    console.log(res.data);

    // save token
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    //  correct role check
    console.log("Navigating...");
    if (res.data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }

  } catch (err) {
    console.log(err);
    alert("Login Failed");
  }
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  background: "#1e3a8a",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

return (
  <div style={{ display: "flex", height: "100vh" }}>

    {/* 🔷 LEFT SIDE */}
    <div style={{
      flex: 1,
      background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px"
    }}>
      
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
        Doctor App
      </h1>

      <p style={{ maxWidth: "400px", textAlign: "center", lineHeight: "1.6" }}>
        Book appointments with top doctors easily.  
        Manage your health with our smart scheduling system.  
        Fast, simple and secure.
      </p>

    </div>

    {/* RIGHT SIDE */}
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
          Login
        </h2>

        <form onSubmit={handleSubmit}>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

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

          <button type="submit" style={btnStyle}>
            Login
          </button>

        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              if (role === "admin") {
                alert("Admin cannot signup");
              } else {
                navigate("/register");
              }
            }}
          >
            Sign up
          </span>
        </p>

      </div>

    </div>

  </div>
);  

};

export default Login;