import express from "express";
import Lab from "../models/Lab.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ADD STUDENT TO LAB (by roll number)
router.post("/:labId/enroll", authMiddleware, async (req, res) => {
  try {
    const { rollNumber } = req.body;
    const lab = await Lab.findById(req.params.labId);

    if (!lab) return res.status(404).json({ msg: "Lab not found" });

    if (!rollNumber) {
      return res.status(400).json({ msg: "Roll number is required" });
    }

    // Find student by roll number
    const student = await User.findOne({ rollNumber: rollNumber.toUpperCase() });

    if (!student) {
      return res.status(404).json({ msg: "Student not found with that roll number" });
    }

    const studentId = student._id.toString();

    if (!lab.students.map(s => s.toString()).includes(studentId)) {
      lab.students.push(student._id);
      await lab.save();
    }

    // Return populated lab
    const updatedLab = await Lab.findById(req.params.labId).populate("students", "fullName rollNumber");
    res.json({ msg: "Student enrolled", lab: updatedLab });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE STUDENT FROM LAB
router.delete("/:labId/remove/:studentId", authMiddleware, async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.labId);
    if (!lab) return res.status(404).json({ msg: "Lab not found" });

    lab.students = lab.students.filter(s => s.toString() !== req.params.studentId);
    await lab.save();

    const updatedLab = await Lab.findById(req.params.labId).populate("students", "fullName rollNumber");
    res.json(updatedLab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BULK UPLOAD STUDENTS (by roll numbers)
router.post("/:labId/bulk-enroll", authMiddleware, async (req, res) => {
  try {
    const { rollNumbers } = req.body;

    const lab = await Lab.findById(req.params.labId);
    if (!lab) return res.status(404).json({ msg: "Lab not found" });

    if (!rollNumbers || rollNumbers.length === 0) {
      return res.status(400).json({ msg: "Roll numbers are required" });
    }

    // Normalize roll numbers
    const normalizedRolls = rollNumbers.map(r => r.trim().toUpperCase());

    // Find students by roll numbers
    const students = await User.find({ rollNumber: { $in: normalizedRolls } });

    if (students.length === 0) {
      return res.status(404).json({ msg: "No students found with those roll numbers" });
    }

    const existingIds = lab.students.map(s => s.toString());
    let addedCount = 0;

    students.forEach(student => {
      if (!existingIds.includes(student._id.toString())) {
        lab.students.push(student._id);
        addedCount++;
      }
    });

    await lab.save();

    const updatedLab = await Lab.findById(req.params.labId).populate("students", "fullName rollNumber");
    res.json({ enrolled: addedCount, total: students.length, lab: updatedLab });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ENROLLED STUDENTS
router.get("/:labId", authMiddleware, async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.labId).populate("students", "fullName rollNumber");
    if (!lab) return res.status(404).json({ msg: "Lab not found" });
    res.json(lab.students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BATCH MANAGEMENT - CREATE
router.post("/:labId/batches", authMiddleware, async (req, res) => {
  try {
    const { name, studentIds } = req.body;
    const lab = await Lab.findById(req.params.labId);
    if (!lab) return res.status(404).json({ msg: "Lab not found" });

    lab.batches.push({ name, students: studentIds });
    await lab.save();
    res.json(lab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;