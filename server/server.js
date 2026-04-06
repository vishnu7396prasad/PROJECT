require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const doctorRoutes = require("./routes/doctorRoute");
const appointmentRoute = require("./routes/appointmentRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoute);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoute);

// Test Route
app.get("/", (req, res) => {
  res.send("Booking API is running");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));



// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
