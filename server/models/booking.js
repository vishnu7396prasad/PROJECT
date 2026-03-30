const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  serviceName: {
    type: String,
    required: true
  },

  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);