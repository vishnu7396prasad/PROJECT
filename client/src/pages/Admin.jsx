import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Admin() {

  const [name, setName] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [experience, setExperience] = useState("")
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])

  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  // Admin check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))

    if (!user || user.role !== "admin") {
      navigate("/login")
    } else {
      setLoading(false)
      fetchDoctors()
      fetchAppointments()
    }
  }, [])

  // Fetch Doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors")
      setDoctors(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/appointments")
      setAppointments(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // Add Doctor
  const handleAddDoctor = async () => {
    try {
      await axios.post("http://localhost:5000/api/doctors", {
        name,
        specialization,
        experience: Number(experience)
      })

      alert("Doctor Added")

      setName("")
      setSpecialization("")
      setExperience("")

      fetchDoctors()

    } catch (err) {
      console.log(err)
      alert("Error adding doctor")
    }
  }

  // Delete Doctor
  const deleteDoctor = async (id) => {
    await axios.delete(`http://localhost:5000/api/doctors/${id}`)
    fetchDoctors()
  }

  // Edit Doctor
  const editDoctor = async (doc) => {
    const newName = prompt("New name", doc.name)
    if (!newName) return

    await axios.put(`http://localhost:5000/api/doctors/${doc._id}`, {
      ...doc,
      name: newName
    })

    fetchDoctors()
  }

  // Styles
  
  const cardBox = {
  background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
  color: "#fff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const section = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  flex: "1",
  minWidth: "150px"
};

const addBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "6px",
  cursor: "pointer"
};

const doctorCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  border: "1px solid #eee",
  borderRadius: "8px",
  marginTop: "10px"
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

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>

  return (
  <div style={{ padding: "20px", background: "#f4f6f9", minHeight: "100vh" }}>

    <h2 style={{ marginBottom: "20px" }}>Admin Dashboard</h2>

    {/* STATS CARDS */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "30px"
    }}>
      
      <div style={cardBox}>
        <h3>Total Doctors</h3>
        <p>{doctors.length}</p>
      </div>

      <div style={cardBox}>
        <h3>Total Appointments</h3>
        <p>0</p>
      </div>

      <div style={cardBox}>
        <h3>Today Bookings</h3>
        <p>0</p>
      </div>

    </div>

    {/* ADD DOCTOR */}
    <div style={section}>
      <h3>Add Doctor</h3>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} style={input}/>
        <input placeholder="Specialization" value={specialization} onChange={(e)=>setSpecialization(e.target.value)} style={input}/>
        <input placeholder="Experience" value={experience} onChange={(e)=>setExperience(e.target.value)} style={input}/>
        <button onClick={handleAddDoctor} style={addBtn}>Add</button>
      </div>
    </div>

    {/* DOCTOR LIST */}
    <div style={section}>
      <h3>Doctors</h3>

      {doctors.map((doc) => (
        <div key={doc._id} style={doctorCard}>
          
          <div>
            <h4>{doc.name}</h4>
            <p>{doc.specialization}</p>
            <small>{doc.experience} yrs experience</small>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={()=>editDoctor(doc)} style={editBtn}>Edit</button>
            <button onClick={()=>deleteDoctor(doc._id)} style={deleteBtn}>Delete</button>
          </div>

        </div>
      ))}

    </div>

  </div>
);
}

export default Admin