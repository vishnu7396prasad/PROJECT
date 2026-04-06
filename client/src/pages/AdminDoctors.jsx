import { useEffect, useState } from "react";

import API from "../services/api";

const pageStyle = {
  padding: "20px",
  background: "#f4f6f9",
  minHeight: "100vh",
};

const cardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "15px",
  borderRadius: "10px",
  background: "#fff",
  marginBottom: "15px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const response = await API.get("/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to load doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const deleteDoctor = async (id) => {
    try {
      await API.delete(`/doctors/${id}`);
      await fetchDoctors();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to delete doctor");
    }
  };

  const editDoctor = async (doctor) => {
    const newName = prompt("Enter new name", doctor.name);

    if (!newName || !newName.trim()) {
      return;
    }

    try {
      await API.put(`/doctors/${doctor._id}`, {
        name: newName,
        specialization: doctor.specialization,
        experience: doctor.experience,
      });

      await fetchDoctors();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to update doctor");
    }
  };

  return (
    <div style={pageStyle}>
      <h2 style={{ marginBottom: "20px" }}>Doctors</h2>

      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        doctors.map((doctor) => (
          <div key={doctor._id} style={cardStyle}>
            <div>
              <h3 style={{ margin: "0 0 6px" }}>{doctor.name}</h3>
              <p style={{ margin: "0 0 6px" }}>{doctor.specialization}</p>
              <small>{doctor.experience} yrs experience</small>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={editButtonStyle}
                onClick={() => editDoctor(doctor)}
              >
                Edit
              </button>

              <button
                style={deleteButtonStyle}
                onClick={() => deleteDoctor(doctor._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDoctors;
