import { useEffect, useState } from "react";

import API from "../services/api";

const cardStyle = {
  border: "1px solid #d9d9d9",
  background: "#fff",
  padding: "16px",
  marginBottom: "14px",
  borderRadius: "10px",
};

const buttonStyle = {
  background: "red",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "8px 12px",
  marginTop: "10px",
  cursor: "pointer",
};

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const response = await API.get("/appointments/me");
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
      const response = await API.delete(`/appointments/${id}`);
      alert(response.data.message);
      await fetchAppointments();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to cancel appointment");
    }
  };

  return (
    <div style={{ padding: "20px", background: "#f4f6f9", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>My Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment._id} style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>
              {appointment.doctorId?.name || "Doctor unavailable"}
            </h3>
            <p>Date: {appointment.date}</p>
            <p>Time: {appointment.time}</p>
            <p>Status: {appointment.status}</p>

            {appointment.status !== "cancelled" && (
              <button
                onClick={() => cancelAppointment(appointment._id)}
                style={buttonStyle}
              >
                Cancel Appointment
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyAppointments;
