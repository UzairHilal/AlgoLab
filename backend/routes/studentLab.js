import express from "express";
import Lab from "../models/Lab.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET LABS WHERE STUDENT IS ENROLLED
router.get("/labs", authMiddleware, async (req, res) => {
  try {
    const studentId = req.user.id;
    const labs = await Lab.find({ students: studentId }).populate("teacherId", "fullName email");
    res.json(labs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;