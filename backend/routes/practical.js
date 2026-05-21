import express from "express";
import Practical from "../models/Practical.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// CREATE PRACTICAL
router.post("/", authMiddleware, async (req, res) => {
  try {
    const practical = await Practical.create(req.body);
    res.json(practical);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL PRACTICALS FOR A LAB
router.get("/lab/:labId", authMiddleware, async (req, res) => {
  try {
    const practicals = await Practical.find({ labId: req.params.labId }).sort({ order: 1 });
    res.json(practicals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE PRACTICAL
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const practical = await Practical.findById(req.params.id);
    if (!practical) return res.status(404).json({ msg: "Practical not found" });
    res.json(practical);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PRACTICAL
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const practical = await Practical.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(practical);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE PRACTICAL
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Practical.findByIdAndDelete(req.params.id);
    res.json({ msg: "Practical deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;