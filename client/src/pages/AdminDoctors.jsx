import { useEffect, useState } from "react";
import axios from "axios";

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);

  // fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // delete
  const deleteDoctor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`);
      fetchDoctors();
    } catch (err) {
      console.log(err);
    }
  };

  // edit
  const editDoctor = async (doc) => {
    const newName = prompt("Enter new name", doc.name);
    if (!newName) return;

    try {
      await axios.put(`http://localhost:5000/api/doctors/${doc._id}`, {
        ...doc,
        name: newName,
      });
      fetchDoctors();
    } catch (err) {
      console.log(err);
    }
  };

  const card = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  borderRadius: "10px",
  background: "#fff",
  marginBottom: "15px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const editBtn = {
  background: "#facc15",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer"
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer"
};

  return (
    <div style={{ padding: "20px", background: "#f4f6f9", minHeight: "100vh" }}>
      
      <h2 style={{ marginBottom: "20px" }}>Doctors</h2>

      {doctors.map((doc) => (
        <div key={doc._id} style={card}>
          
          <div>
            <h3>{doc.name}</h3>
            <p>{doc.specialization}</p>
            <small>{doc.experience} yrs experience</small>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button style={editBtn} onClick={() => editDoctor(doc)}>
              Edit
            </button>

            <button style={deleteBtn} onClick={() => deleteDoctor(doc._id)}>
              Delete
            </button>
          </div>

        </div>
      ))}

    </div>
  );
}

export default AdminDoctors;