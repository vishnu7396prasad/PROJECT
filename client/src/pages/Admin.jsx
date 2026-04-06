import { useEffect, useState } from "react";

import API from "../services/api";

const pageStyle = {
  padding: "20px",
  background: "#f4f6f9",
  minHeight: "100vh",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const cardBoxStyle = {
  background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
  color: "#fff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const sectionStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const formRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  flex: 1,
  minWidth: "150px",
};

const addButtonStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "6px",
  cursor: "pointer",
};

const doctorCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "15px",
  border: "1px solid #eee",
  borderRadius: "8px",
  marginTop: "10px",
  flexWrap: "wrap",
};

const editButtonStyle = {
  background: "#facc15",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

const emptyStateStyle = {
  color: "#666",
  marginTop: "10px",
};

const getTodayBookingsCount = (appointments) => {
  const today = new Date().toISOString().slice(0, 10);

  return appointments.filter(
    (appointment) =>
      appointment.date === today && appointment.status !== "cancelled"
  ).length;
};

function Admin() {
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    experience: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [doctorResponse, appointmentResponse] = await Promise.all([
        API.get("/doctors"),
        API.get("/appointments"),
      ]);

      setDoctors(doctorResponse.data);
      setAppointments(appointmentResponse.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      specialization: "",
      experience: "",
    });
  };

  const handleAddDoctor = async () => {
    if (!form.name.trim() || !form.specialization.trim() || !form.experience) {
      alert("Please fill all doctor fields");
      return;
    }

    setSubmitting(true);

    try {
      await API.post("/doctors", {
        name: form.name,
        specialization: form.specialization,
        experience: Number(form.experience),
      });

      resetForm();
      await fetchDashboardData();
      alert("Doctor added successfully");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error adding doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await API.delete(`/doctors/${id}`);
      await fetchDashboardData();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error deleting doctor");
    }
  };

  const editDoctor = async (doctor) => {
    const newName = prompt("New name", doctor.name);

    if (!newName || !newName.trim()) {
      return;
    }

    try {
      await API.put(`/doctors/${doctor._id}`, {
        name: newName,
        specialization: doctor.specialization,
        experience: doctor.experience,
      });

      await fetchDashboardData();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error updating doctor");
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h2>;
  }

  return (
    <div style={pageStyle}>
      <h2 style={{ marginBottom: "20px" }}>Admin Dashboard</h2>

      <div style={gridStyle}>
        <div style={cardBoxStyle}>
          <h3>Total Doctors</h3>
          <p>{doctors.length}</p>
        </div>

        <div style={cardBoxStyle}>
          <h3>Total Appointments</h3>
          <p>{appointments.length}</p>
        </div>

        <div style={cardBoxStyle}>
          <h3>Today Bookings</h3>
          <p>{getTodayBookingsCount(appointments)}</p>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3>Add Doctor</h3>

        <div style={formRowStyle}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={handleChange("name")}
            style={inputStyle}
          />
          <input
            placeholder="Specialization"
            value={form.specialization}
            onChange={handleChange("specialization")}
            style={inputStyle}
          />
          <input
            type="number"
            min="0"
            placeholder="Experience"
            value={form.experience}
            onChange={handleChange("experience")}
            style={inputStyle}
          />
          <button
            onClick={handleAddDoctor}
            style={addButtonStyle}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Add"}
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3>Doctors</h3>

        {doctors.length === 0 ? (
          <p style={emptyStateStyle}>No doctors found.</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor._id} style={doctorCardStyle}>
              <div>
                <h4 style={{ margin: "0 0 6px" }}>{doctor.name}</h4>
                <p style={{ margin: "0 0 6px" }}>{doctor.specialization}</p>
                <small>{doctor.experience} yrs experience</small>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => editDoctor(doctor)}
                  style={editButtonStyle}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteDoctor(doctor._id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;
