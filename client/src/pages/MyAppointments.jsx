import { useEffect, useState } from "react"
import API from "../services/api"

function MyAppointments(){

 const [appointments,setAppointments] = useState([])

 const fetchAppointments = async () => {

   const res = await API.get("/booking/user/user123")

   setAppointments(res.data)

 }

 useEffect(()=>{
  fetchAppointments()
 },[])

 const cancelAppointment = async (id) => {

 try{

    console.log("Cancel ID:", id)

  const res = await API.delete(`/appointments/${id}`)

  alert(res.data.message)

  fetchAppointments()

 }catch(err){

  console.log(err)

 }

}

 return(

  <div className="p-10">

   <h2 className="text-2xl font-bold mb-6">My Appointments</h2>

   {appointments.length === 0 ? (
     <p>No appointments found</p>
   ) : (

    appointments.map((a)=>(
  
 <div key={a._id} className="border p-4 mb-4 rounded">

  <h3>{a.doctorId.name}</h3>

  <p>Date: {a.date}</p>

  <p>Time: {a.time}</p>

  <button
   onClick={()=>cancelAppointment(a._id)}
   style={{
    background:"red",
    color:"white",
    padding:"5px 10px",
    marginTop:"10px"
   }}
  >
   Cancel Appointment
  </button>

 </div>

))

   )}

  </div>

 )

}

export default MyAppointments