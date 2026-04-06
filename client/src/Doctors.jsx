import { useEffect, useState } from "react";

import API from "./services/api";

const timeSlots = [
  "09:00",
  "09:10",
  "09:20",
  "09:30",
  "09:40",
  "10:00",
  "10:10",
  "10:20",
  "10:30",
];

const pageStyle = {
  padding: "20px",
  background: "#f4f6f9",
  minHeight: "100vh",
};

const doctorCardStyle = {
  border: "1px solid #d6d6d6",
  background: "#fff",
  padding: "16px",
  marginTop: "12px",
  borderRadius: "10px",
};

const primaryButtonStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "10px 14px",
  cursor: "pointer",
};

const controlStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const fetchDoctors = async () => {
    try {
      const response = await API.get("/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load doctors");
    }
  };

  const fetchBookedSlots = async () => {
    if (!selectedDoctor || !date) {
      setBookedSlots([]);
      return;
    }

    try {
      const response = await API.get(`/appointments/slots/${selectedDoctor}/${date}`);
      setBookedSlots(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
      setBookedSlots([]);
    }
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !date || !time) {
      alert("Select a doctor, date, and time");
      return;
    }

    try {
      const response = await API.post("/appointments", {
        doctorId: selectedDoctor,
        date,
        time,
        serviceName: "Consultation",
      });

      alert(response.data.message);
      setTime("");
      await fetchBookedSlots();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to book appointment");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchBookedSlots();
  }, [selectedDoctor, date]);

  return (
    <div style={pageStyle}>
      <h2>Available Doctors</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          style={controlStyle}
        />

        {selectedDoctor && (
          <select
            value={time}
            onChange={(event) => setTime(event.target.value)}
            style={controlStyle}
          >
            <option value="">Select Time</option>
            {timeSlots.map((slot) => (
              <option
                key={slot}
                value={slot}
                disabled={bookedSlots.includes(slot)}
              >
                {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
              </option>
            ))}
          </select>
        )}

        {selectedDoctor && (
          <button onClick={handleBooking} style={primaryButtonStyle}>
            Book Appointment
          </button>
        )}
      </div>

      {doctors.map((doctor) => (
        <div key={doctor._id} style={doctorCardStyle}>
          <h3 style={{ marginTop: 0 }}>{doctor.name}</h3>
          <p>Specialization: {doctor.specialization}</p>
          <p>Experience: {doctor.experience} years</p>

          <button
            onClick={() => {
              setSelectedDoctor(doctor._id);
              setTime("");
            }}
            style={primaryButtonStyle}
          >
            {selectedDoctor === doctor._id ? "Selected" : "Select Doctor"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Doctors;
