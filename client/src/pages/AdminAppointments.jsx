import { useEffect, useState } from "react";
import axios from "axios";

function AdminAppointments() {

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // fetch
  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // cancel
  const cancelAppointment = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/cancel/${id}`);
      fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔍 FILTER + SEARCH SAFE VERSION
  const filtered = appointments.filter((a) => {
    const userName = a.userId?.name?.toLowerCase() || "";
    const doctorName = a.doctorId?.name?.toLowerCase() || "";
    const text = search.toLowerCase();

    const matchSearch =
      userName.includes(text) || doctorName.includes(text);

    const matchStatus =
      filter === "all" ||
      (filter === "cancelled" && a.status === "cancelled") ||
      (filter === "booked" && a.status !== "cancelled");

    return matchSearch && matchStatus;
  });

  // styles
const card = {
  border: "1px solid #ddd",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "space-between"
};

const btn = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: "8px",
  borderRadius: "5px",
  cursor: "pointer"
};

const formatTime = (time) => {
  if (!time) return "";

  const [hour, minute] = time.split(":");
  let h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;

  return `${h}:${minute} ${ampm}`;
};

  return (
    <div style={{ padding: "20px" }}>

      <h2>All Appointments</h2>

      {/* SEARCH */}
      <input
        placeholder="Search user / doctor"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", width: "250px", marginBottom: "10px" }}
      />

      {/* FILTER */}
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="booked">Booked</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {/* LIST */}
      {filtered.map((a) => (
        <div key={a._id} style={card}>

          <div>
            <p><strong>User :</strong> {a.userId?.name}</p>
            <p><strong>Doctor :</strong> {a.doctorId?.name}</p>
           <p style={{ fontSize: "14px", color: "#0a0101" }}>
            <strong>Date & Time : </strong>
            {new Date(a.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })}
            {"  "}
         / {formatTime(a.time)}
         </p>
           
           <p>
            <strong>Status:</strong>{" "}
            <span style={{
                color: a.status === "cancelled" ? "red" : "green",
                fontWeight: "bold"
            }}>
                {a.status}
            </span>
            </p>

          </div>

          {a.status !== "cancelled" && (
            <button onClick={() => cancelAppointment(a._id)} style={btn}>
              Cancel
            </button>
          )}

        </div>
      ))}

    </div>
  );
}

export default AdminAppointments;


