import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true,
    trim: true
  },

  rollNumber: {
    type: String,

    required: function () {
      return this.role === "student";
    },

    unique: true,
    sparse: true,

    uppercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  }

}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);