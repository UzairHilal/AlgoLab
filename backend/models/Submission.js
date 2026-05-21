import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  practicalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Practical",
    required: true
  },
  code: {
    type: String,
    default: ""
  },
  language: {
    type: String,
    default: "python"
  },
  files: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ["pending", "submitted", "late"],
    default: "pending"
  },
  submittedAt: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model("Submission", submissionSchema);