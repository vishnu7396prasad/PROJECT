import { Link, useLocation, useNavigate } from "react-router-dom";

import { clearAuth, getStoredUser } from "../utils/auth";

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
};

const containerStyle = {
  background: "#1e3a8a",
  padding: "15px 20px",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
};

const navLinksStyle = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
  flexWrap: "wrap",
};

const logoutButtonStyle = {
  border: "none",
  borderRadius: "6px",
  background: "#fff",
  color: "#1e3a8a",
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: 600,
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  if (
    location.pathname === "/" ||
    location.pathname.includes("login") ||
    location.pathname.includes("register")
  ) {
    return null;
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ margin: 0 }}>Doctor App</h2>

      <div style={navLinksStyle}>
        {user.role === "user" && (
          <>
            <Link to="/home" style={linkStyle}>
              Home
            </Link>
            <Link to="/doctors" style={linkStyle}>
              Doctors
            </Link>
            <Link to="/my-appointments" style={linkStyle}>
              My Appointments
            </Link>
          </>
        )}

        {user.role === "admin" && (
          <>
            <Link to="/admin" style={linkStyle}>
              Dashboard
            </Link>
            <Link to="/admin/appointments" style={linkStyle}>
              Appointments
            </Link>
            <Link to="/admin/doctors" style={linkStyle}>
              Doctors
            </Link>
          </>
        )}

        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
