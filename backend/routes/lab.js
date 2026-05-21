import express from "express";
import Lab from "../models/Lab.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// CREATE LAB
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, subjectCode, session } = req.body;
    const teacherId = req.user.id;

    const lab = await Lab.create({ name, subjectCode, session, teacherId });
    res.json(lab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL LABS FOR TEACHER
router.get("/", authMiddleware, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const labs = await Lab.find({ teacherId }).populate("students", "fullName rollNumber");
    res.json(labs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE LAB
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id)
      .populate("students", "fullName rollNumber")
      .populate("batches.students", "fullName rollNumber");
    if (!lab) return res.status(404).json({ msg: "Lab not found" });
    res.json(lab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE LAB
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const lab = await Lab.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE LAB
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Lab.findByIdAndDelete(req.params.id);
    res.json({ msg: "Lab deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MARK LAB AS PREVIOUS/CURRENT
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const lab = await Lab.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(lab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;