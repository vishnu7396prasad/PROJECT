import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");

 if (
  location.pathname === "/" ||
  location.pathname.includes("login") ||
  location.pathname.includes("register")
) {
  return null;
}

  if (!user) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ background: "#1e3a8a", padding: "15px", color: "#fff", display: "flex", justifyContent: "space-between" }}>
      
      <h2>Doctor App</h2>

      <div style={{ display: "flex", gap: "15px" }}>
        
        {user.role === "user" && (
          <>
            <Link to="/home" style={link}>Home</Link>
            <Link to="/doctors" style={link}>Doctors</Link>
            <Link to="/my-appointments" style={link}>My Appointments</Link>
          </>
        )}

        {user.role === "admin" && (
          <>
            <Link to="/admin" style={link}>Dashboard</Link>
            <Link to="/admin/appointments" style={link}>Appointments</Link>
            <Link to="/admin/doctors" style={link}>Doctors</Link>
          </>
        )}

        <button onClick={handleLogout}>Logout</button>

      </div>
    </div>
  );
}

const link = { color: "#fff", textDecoration: "none" };

export default Navbar;