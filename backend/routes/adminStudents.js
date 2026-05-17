import express from "express";

import User from "../models/User.js";
import Algorithm from "../models/Algorithm.js";
import UserProgress from "../models/UserProgress.js";

import {
  authMiddleware,
  adminOnly
} from "../middleware/auth.js";

const router = express.Router();

router.get("/",authMiddleware,adminOnly,
  async (req, res) => {

    try {

      const students =
        await User.find({
          role: "student"
        });

      const totalAlgorithms =
        await Algorithm.countDocuments();

      const data = await Promise.all(

        students.map(async (student) => {

          const progress =
            await UserProgress.find({
              userId: student._id,
              completed: true
            })
              .sort({ completedAt: -1 });

          return {

            id: student._id,

            username:
              student.username,

            completedCount:
              progress.length,

            percentage:
              totalAlgorithms === 0
                ? 0
                : Math.round(
                    (
                      progress.length /
                      totalAlgorithms
                    ) * 100
                  ),

            latestAlgorithm:
              progress[0]?.algorithmSlug ||
              "None",

            completedAlgorithms:
              progress.map((p) => ({
                slug: p.algorithmSlug,
                completedAt: p.completedAt
              }))
          };
        })
      );

      res.json(data);

    } catch (err) {

      res.status(500).json({
        error: err.message
      });

    }
  }
);

router.get("/:id",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {

        const id = req.params.id

        console.log(`recived id: ${id}`)
      const student = await User.findById(req.params.id)
        .select("-password");

      if (!student) {
        return res.status(404).json({
          msg: "Student not found"
        });
      }

      const algorithms = await Algorithm.find();

      const progress = await UserProgress.find({
        userId: student._id,
        completed: true
      });

      const completedSlugs = progress.map(
        (p) => p.algorithmSlug
      );

      const completed = algorithms.filter((algo) =>
        completedSlugs.includes(algo.slug)
      );

      const pending = algorithms.filter(
        (algo) => !completedSlugs.includes(algo.slug)
      );

      const progressPercent =
        algorithms.length === 0
          ? 0
          : Math.round(
              (completed.length / algorithms.length) * 100
            );

      res.json({
        student,
        totalAlgorithms: algorithms.length,
        completed,
        pending,
        progressPercent
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        msg: "Server error"
      });
    }
  }
);

export default router;