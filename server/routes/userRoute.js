const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER

router.post("/register", async (req, res) => {

  const {
    name,
    email,
    password,
    phone,
    dob,
    age,
    gender,
    address
  } = req.body;

  try {

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
      dob,
      age,
      gender,
      address,
      role: "user"
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // user not found
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // wrong password
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // success
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;