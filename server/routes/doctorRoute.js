const express = require("express");
const router = express.Router();

const Doctor = require("../models/Doctor");
const authMiddleware = require("../middleware/authmiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Add Doctors

router.post("/", authMiddleware, adminMiddleware,  async (req, res) => {
  try {
    const { name, specialization, experience } = req.body;

    const doctor = new Doctor({
      name,
      specialization,
      experience
    });

    await doctor.save();

    res.json({ message: "Doctor Added Successfully" });

  } catch (err) { console.log(err)
    res.status(500).json({ message: "err.message" });
  }
});

// Delete Doctors

router.delete("/:id",authMiddleware , async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id)
    res.json({ message: "Doctor deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Edit / Update Doctors

router.put("/:id", authMiddleware , async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router;