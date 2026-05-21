import express from "express";
import Lab from "../models/Lab.js";
import Practical from "../models/Practical.js";
import Submission from "../models/Submission.js";
import Marks from "../models/Marks.js";
import Attendance from "../models/Attendance.js";
import Evaluation from "../models/Evaluation.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// STUDENT PERFORMANCE REPORT
router.get("/student-performance/:labId", authMiddleware, async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.labId).populate("students", "fullName rollNumber");
    if (!lab) return res.status(404).json({ msg: "Lab not found" });

    const practicals = await Practical.find({ labId: req.params.labId });

    const report = [];

    for (const student of lab.students) {
      const studentMarks = await Marks.find({
        studentId: student._id,
        practicalId: { $in: practicals.map(p => p._id) }
      });

      const totalMarks = studentMarks.reduce((sum, m) => sum + m.total, 0);
      const avgMarks = studentMarks.length > 0 ? (totalMarks / studentMarks.length).toFixed(2) : 0;

      const attendanceRecords = await Attendance.find({
        studentId: student._id,
        labId: req.params.labId
      });
      const present = attendanceRecords.filter(r => r.status === "present").length;
      const attendancePercent = attendanceRecords.length > 0
        ? Math.round((present / attendanceRecords.length) * 100)
        : 0;

      report.push({
        student: { id: student._id, fullName: student.fullName, rollNumber: student.rollNumber },
        totalMarks,
        avgMarks: Number(avgMarks),
        practicalsCompleted: studentMarks.length,
        totalPracticals: practicals.length,
        attendancePercent
      });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SUBMISSION REPORT
router.get("/submissions/:labId", authMiddleware, async (req, res) => {
  try {
    const practicals = await Practical.find({ labId: req.params.labId });
    const practicalIds = practicals.map(p => p._id);

    const submissions = await Submission.find({ practicalId: { $in: practicalIds } })
      .populate("studentId", "fullName rollNumber")
      .populate("practicalId", "title");

    const report = practicals.map(p => {
      const subs = submissions.filter(s => s.practicalId._id.toString() === p._id.toString());
      return {
        practical: { id: p._id, title: p.title },
        submitted: subs.filter(s => s.status === "submitted").length,
        late: subs.filter(s => s.status === "late").length,
        pending: 0, // would need lab students count
        submissions: subs
      };
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MARKS ANALYSIS REPORT
router.get("/marks-analysis/:labId", authMiddleware, async (req, res) => {
  try {
    const practicals = await Practical.find({ labId: req.params.labId });
    const practicalIds = practicals.map(p => p._id);
    const allMarks = await Marks.find({ practicalId: { $in: practicalIds } });

    const analysis = practicals.map(p => {
      const pMarks = allMarks.filter(m => m.practicalId.toString() === p._id.toString());
      const totals = pMarks.map(m => m.total);
      return {
        practical: { id: p._id, title: p.title },
        highest: totals.length > 0 ? Math.max(...totals) : 0,
        lowest: totals.length > 0 ? Math.min(...totals) : 0,
        average: totals.length > 0 ? (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(2) : 0,
        submissions: totals.length
      };
    });

    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ATTENDANCE SUMMARY REPORT
router.get("/attendance-summary/:labId", authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { labId: req.params.labId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Attendance.find(filter);

    const labCount = records.filter(r => r.type === "lab").length;
    const lectureCount = records.filter(r => r.type === "lecture").length;
    const labPresent = records.filter(r => r.type === "lab" && r.status === "present").length;
    const lecturePresent = records.filter(r => r.type === "lecture" && r.status === "present").length;

    res.json({
      totalRecords: records.length,
      lab: { total: labCount, present: labPresent, percentage: labCount > 0 ? Math.round((labPresent / labCount) * 100) : 0 },
      lecture: { total: lectureCount, present: lecturePresent, percentage: lectureCount > 0 ? Math.round((lecturePresent / lectureCount) * 100) : 0 }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DASHBOARD STATS
router.get("/dashboard-stats", authMiddleware, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const labs = await Lab.find({ teacherId });
    const labIds = labs.map(l => l._id);

    const totalStudents = labs.reduce((sum, l) => sum + l.students.length, 0);
    const totalPracticals = await Practical.countDocuments({ labId: { $in: labIds } });
    const pendingEvaluations = await Evaluation.countDocuments({ teacherId, status: "pending" });

    res.json({
      totalLabs: labs.length,
      currentLabs: labs.filter(l => l.status === "current").length,
      totalStudents,
      totalPracticals,
      pendingEvaluations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;