const express = require("express");

const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authmiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { doctorId, serviceName, date, time } = req.body;

    if (!doctorId || !serviceName || !date || !time) {
      return res.status(400).json({
        message: "Doctor, service, date, and time are required",
      });
    }

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const appointment = await Appointment.create({
      userId: req.userId,
      doctorId,
      serviceName: serviceName.trim(),
      date,
      time,
    });

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    return res.status(500).json({ message: error.message });
  }
});

router.get("/slots/:doctorId/:date", async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    const appointments = await Appointment.find({
      doctorId,
      date,
      status: { $ne: "cancelled" },
    }).select("time");

    const bookedSlots = appointments.map((appointment) => appointment.time);

    return res.json(bookedSlots);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId })
      .populate("doctorId")
      .sort({ date: 1, time: 1 });

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId")
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const canManageAppointment =
      req.role === "admin" || appointment.userId.toString() === req.userId;

    if (!canManageAppointment) {
      return res.status(403).json({ message: "Access denied" });
    }

    await appointment.deleteOne();

    return res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/cancel/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.json({ message: "Appointment cancelled", appointment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
