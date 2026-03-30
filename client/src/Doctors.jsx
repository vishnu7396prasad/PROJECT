import { useEffect, useState } from "react"

function Doctors(){

  const [doctors,setDoctors] = useState([])
  const [selectedDoctor,setSelectedDoctor] = useState("")
  const [date,setDate] = useState("")
  const [time,setTime] = useState("")
  const [bookedSlots,setBookedSlots] = useState([])

  // time slots
  const timeSlots = [
    "09:00","09:10","09:20","09:30","09:40",
    "10:00","10:10","10:20","10:30"
  ]

  // get doctors
  const fetchDoctors = async () => {
    const res = await fetch("http://localhost:5000/api/doctors")
    const data = await res.json()
    setDoctors(data)
  }

  // get booked slots
  const fetchBookedSlots = async () => {

    if(!selectedDoctor || !date) return

    try{
      const res = await fetch(
        `http://localhost:5000/api/appointments/slots/${selectedDoctor}/${date}`
      )

      const data = await res.json()

      setBookedSlots(Array.isArray(data) ? data : [])

    }catch(err){
      console.log(err)
      setBookedSlots([])
    }
  }

  // book appointment
  const handleBooking = async () => {

    if(!selectedDoctor || !date || !time){
      alert("Select all fields")
      return
    }

    const res = await fetch("http://localhost:5000/api/appointments",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        userId:"user123",
        doctorId:selectedDoctor,
        date,
        time,
        serviceName:"consultation"
      })
    })

    const data = await res.json()
    alert(data.message)

    // refresh slots after booking
    fetchBookedSlots()
  }

  // load doctors
  useEffect(()=>{
    fetchDoctors()
  },[])

  // refresh slots when doctor/date changes
  useEffect(()=>{
    fetchBookedSlots()
  },[selectedDoctor,date])

  return(
    <div style={{padding:"20px"}}>

      <h2>Available Doctors</h2>

      <input
        type="date"
        onChange={(e)=>setDate(e.target.value)}
      />
      <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      {doctors.map((doc)=>(
        <div key={doc._id} style={{
          border:"1px solid gray",
          padding:"10px",
          marginTop:"10px"
        }}>

          <h3>{doc.name}</h3>

          <p>Specialization: {doc.specialization}</p>
          <p>Experience: {doc.experience} years</p>

          <button onClick={()=>setSelectedDoctor(doc._id)}>
            Select Doctor
          </button>

        </div>
      ))}

      {/* show time only after doctor selected */}
      {selectedDoctor && (
        <>
          <h3>Select Time</h3>

          <select onChange={(e)=>setTime(e.target.value)}>

            <option>Select Time</option>

            {timeSlots.map((t)=>(
              <option
                key={t}
                disabled={bookedSlots.includes(t)}
              >
                {t} {bookedSlots.includes(t) ? "(Booked)" : ""}
              </option>
            ))}

          </select>

          <br/><br/>

          <button onClick={handleBooking}>
            Book Appointment
          </button>
        </>
      )}

    </div>
  )
}

export default Doctors