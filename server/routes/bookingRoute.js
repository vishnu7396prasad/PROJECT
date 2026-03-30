const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

// create booking
router.post("/", async (req, res) => {
  try {

    const { doctorId, userId, serviceName, date, time } = req.body;

    const existing = await Booking.findOne({
      doctorId,
      date,
      time
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const newBooking = new Booking({
      doctorId,
      userId,
      serviceName,
      date,
      time
    });

    await newBooking.save();

    res.json({ message: "Appointment booked successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET bookings by user
router.get("/user/:userId", async (req, res) => {
  try {

    const bookings = await Booking.find({
      userId: req.params.userId
    }).populate("doctorId");

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET booked slots for a doctor and date

router.get("/slots/:doctorId/:date", async (req, res) => {
  try {

    const { doctorId, date } = req.params;

    const appointments = await Booking.find({
 doctorId: doctorId,
 date: date
})

const bookedSlots = appointments.map(a => a.time);

    // const bookedSlots = bookings.map(b => b.time);

    res.json(bookedSlots);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {

    const deleted = await
     Booking.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    res.json({ message: "Appointment cancelled successfully" })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router;