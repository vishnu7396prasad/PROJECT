import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#1e3a8a",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const leftPanelStyle = {
  flex: 1,
  background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
};

const rightPanelStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f5f5",
};

const cardStyle = {
  width: "350px",
  padding: "30px",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const getLoginErrorMessage = (error) => {
    if (!error.response) {
      return "Cannot connect to the server. Please make sure the backend is running on port 5000.";
    }

    if (error.response.status === 400) {
      if (error.response.data?.message === "User not found") {
        return "No account was found for this email. Please register first.";
      }

      if (error.response.data?.message === "Invalid password") {
        return "The password is incorrect. Please try again.";
      }
    }

    return error.response?.data?.message || "Login failed";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await API.post("/user/login", { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
      alert(getLoginErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", flexWrap: "wrap" }}>
      <div style={leftPanelStyle}>
        <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>Doctor App</h1>

        <p style={{ maxWidth: "400px", textAlign: "center", lineHeight: "1.6" }}>
          Book appointments with top doctors easily. Manage your health with a
          simple scheduling system that works for patients and admins.
        </p>
      </div>

      <div style={rightPanelStyle}>
        <div style={cardStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle} disabled={submitting}>
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "15px" }}>
            Don&apos;t have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
