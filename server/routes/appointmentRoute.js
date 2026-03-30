const express = require("express")
const router = express.Router()

const Appointment = require("../models/Appointment")


/* BOOK APPOINTMENT */

router.post("/", async(req,res)=>{

 try{

  const appointment = new Appointment(req.body)

  await appointment.save()

  res.json({message:"Appointment booked successfully"})

 }catch(err){

  res.status(500).json({message:err.message})

 }

})


/* GET USER APPOINTMENTS */

router.get("/:userId", async(req,res)=>{

 try{

  const appointments = await Appointment.find({
   userId:req.params.userId
  }).populate("doctorId")

  res.json(appointments)

 }catch(err){

  res.status(500).json({message:err.message})

 }

})


/* GET BOOKED SLOTS */

router.get("/slots/:doctorId/:date", async(req,res)=>{

 try{

  const {doctorId ,date ,time} = req.params

  const appointments = await Appointment.find({
   doctorId,
   date,
   time
  })

  const bookedSlots = appointments.map(a=>a.time)

  res.json(bookedSlots)

 }catch(err){

  res.status(500).json({message:err.message})

 }

})


/* CANCEL APPOINTMENT */

router.delete("/:id", async(req,res)=>{

 try{

  await Appointment.findByIdAndDelete(req.params.id)

  res.json({message:"Appointment cancelled successfully"})

 }catch(err){

  res.status(500).json({message:err.message})

 }

})

router.get("/", async (req, res) => {
  const appointments = await Appointment.find().populate("doctorId")
  res.json(appointments)
})

router.put("/cancel/:id", async (req, res) => {
  await Appointment.findByIdAndUpdate(req.params.id, {
    status: "cancelled"
  });

  res.json({ message: "Cancelled" });
});

module.exports = router