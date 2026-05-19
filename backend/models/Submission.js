import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    algorithmSlug: {
      type: String,
      required: true
    },

    language: {
      type: String,
      default: "python"
    },

    code: {
      type: String,
      required: true
    },

    passed: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    feedback: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Submission", submissionSchema);