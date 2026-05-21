import mongoose from "mongoose";

const labSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subjectCode: {
    type: String,
    required: true,
    trim: true
  },
  session: {
    type: String,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  status: {
    type: String,
    enum: ["current", "previous"],
    default: "current"
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  batches: [{
    name: String,
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  }]
}, { timestamps: true });

export default mongoose.model("Lab", labSchema);