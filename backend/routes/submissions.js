import express from "express";
import Submission from "../models/Submission.js";
import Practical from "../models/Practical.js";
import Evaluation from "../models/Evaluation.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// STUDENT SUBMIT CODE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { practicalId, code, language } = req.body;
    const studentId = req.user.id;

    const practical = await Practical.findById(practicalId);
    const isLate = practical?.deadline && new Date() > new Date(practical.deadline);

    let submission = await Submission.findOne({ studentId, practicalId });

    if (submission) {
      submission.code = code;
      submission.language = language || "python";
      submission.status = isLate ? "late" : "submitted";
      submission.submittedAt = new Date();
      await submission.save();
    } else {
      submission = await Submission.create({
        studentId,
        practicalId,
        code,
        language: language || "python",
        status: isLate ? "late" : "submitted",
        submittedAt: new Date()
      });
    }

    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SUBMISSION FOR STUDENT (for a specific practical) - with evaluation
router.get("/my/:practicalId", authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findOne({
      studentId: req.user.id,
      practicalId: req.params.practicalId
    });

    let evaluation = null;
    if (submission) {
      evaluation = await Evaluation.findOne({ submissionId: submission._id });
    }

    res.json({
      submission,
      evaluation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL MY SUBMISSIONS
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user.id })
      .populate("practicalId", "title deadline");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SUBMISSIONS BY PRACTICAL (TEACHER)
router.get("/practical/:practicalId", authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find({ practicalId: req.params.practicalId })
      .populate("studentId", "fullName rollNumber");

    const submissionIds = submissions.map(s => s._id);
    const evaluations = await Evaluation.find({ submissionId: { $in: submissionIds } });

    const evalMap = {};
    evaluations.forEach(e => { evalMap[e.submissionId.toString()] = e; });

    const result = submissions.map(s => ({
      ...s.toObject(),
      evaluation: evalMap[s._id.toString()] || null
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL SUBMISSIONS FOR A LAB (with evaluation)
router.get("/lab/:labId", authMiddleware, async (req, res) => {
  try {
    const practicals = await Practical.find({ labId: req.params.labId });
    const practicalIds = practicals.map(p => p._id);
    const submissions = await Submission.find({ practicalId: { $in: practicalIds } })
      .populate("studentId", "fullName rollNumber")
      .populate("practicalId", "title");

    const submissionIds = submissions.map(s => s._id);
    const evaluations = await Evaluation.find({ submissionId: { $in: submissionIds } });

    const evalMap = {};
    evaluations.forEach(e => { evalMap[e.submissionId.toString()] = e; });

    const result = submissions.map(s => ({
      ...s.toObject(),
      evaluation: evalMap[s._id.toString()] || null
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;