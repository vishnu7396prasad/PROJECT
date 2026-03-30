const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({

 userId:{
  type:String,
  required:true
 },

 doctorId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Doctor"
 },

 serviceName:{
  type:String,
  required:true
 },

 date:{
  type:String,
  required:true
 },

 time:{
  type:String,
  required:true
 },

 status: {
  type: String,
  default: "booked"
}

},{timestamps:true})

module.exports = mongoose.model("Appointment",appointmentSchema)