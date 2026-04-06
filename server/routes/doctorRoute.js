const express = require("express");

const Doctor = require("../models/Doctor");
const authMiddleware = require("../middleware/authmiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    return res.json(doctors);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, specialization, experience } = req.body;

    if (!name || !specialization || Number.isNaN(Number(experience))) {
      return res.status(400).json({
        message: "Name, specialization, and numeric experience are required",
      });
    }

    const doctor = new Doctor({
      name: name.trim(),
      specialization: specialization.trim(),
      experience: Number(experience),
    });

    await doctor.save();

    return res.status(201).json(doctor);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, specialization, experience } = req.body;

    if (!name || !specialization || Number.isNaN(Number(experience))) {
      return res.status(400).json({
        message: "Name, specialization, and numeric experience are required",
      });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        specialization: specialization.trim(),
        experience: Number(experience),
      },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.json(updatedDoctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
