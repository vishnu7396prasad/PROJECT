const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone:{
    type: String
  },
  dob: {
    type: Date
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  },
  address: {
    type: String
  },
  role: {
    type: String,
    enum:["user","admin"],
    default:"user"
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;