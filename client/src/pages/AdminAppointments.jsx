import { useEffect, useState } from "react";

import API from "../services/api";

const cardStyle = {
  border: "1px solid #ddd",
  padding: "14px",
  marginTop: "10px",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  background: "#fff",
};

const buttonStyle = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  height: "fit-content",
};

const controlStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const formatAppointmentDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (time) => {
  if (!time) {
    return "";
  }

  const [hour, minute] = time.split(":");
  let normalizedHour = Number.parseInt(hour, 10);
  const suffix = normalizedHour >= 12 ? "PM" : "AM";

  normalizedHour = normalizedHour % 12 || 12;

  return `${normalizedHour}:${minute} ${suffix}`;
};

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchAppointments = async () => {
    try {
      const response = await API.get("/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to load appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    try {
      await API.put(`/appointments/cancel/${id}`);
      await fetchAppointments();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to cancel appointment");
    }
  };

  const normalizedSearch = search.trim().toLowerCase();

  const filteredAppointments = appointments.filter((appointment) => {
    const userName = appointment.userId?.name?.toLowerCase() || "";
    const doctorName = appointment.doctorId?.name?.toLowerCase() || "";

    const matchesSearch =
      !normalizedSearch ||
      userName.includes(normalizedSearch) ||
      doctorName.includes(normalizedSearch);

    const matchesStatus =
      filter === "all" ||
      (filter === "cancelled" && appointment.status === "cancelled") ||
      (filter === "booked" && appointment.status !== "cancelled");

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: "20px", background: "#f4f6f9", minHeight: "100vh" }}>
      <h2>All Appointments</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "14px",
        }}
      >
        <input
          placeholder="Search user / doctor"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ ...controlStyle, width: "250px" }}
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          style={controlStyle}
        >
          <option value="all">All</option>
          <option value="booked">Booked</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        filteredAppointments.map((appointment) => (
          <div key={appointment._id} style={cardStyle}>
            <div>
              <p>
                <strong>User:</strong> {appointment.userId?.name || "Unknown"}
              </p>
              <p>
                <strong>Doctor:</strong> {appointment.doctorId?.name || "Unknown"}
              </p>
              <p style={{ fontSize: "14px", color: "#0a0101" }}>
                <strong>Date & Time:</strong>{" "}
                {formatAppointmentDate(appointment.date)} /{" "}
                {formatTime(appointment.time)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      appointment.status === "cancelled" ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {appointment.status}
                </span>
              </p>
            </div>

            {appointment.status !== "cancelled" && (
              <button
                onClick={() => cancelAppointment(appointment._id)}
                style={buttonStyle}
              >
                Cancel
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminAppointments;
