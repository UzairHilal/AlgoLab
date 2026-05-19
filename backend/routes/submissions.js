import express from "express";
import Submission from "../models/Submission.js";
import {
  authMiddleware,
  adminOnly
} from "../middleware/auth.js";

const router = express.Router();


// ================= SAVE / UPDATE =================

router.post(
  "/save",
  authMiddleware,
  async (req, res) => {

    try {

      const userId = req.user.id;

      const {
        algorithmSlug,
        code,
        language,
        passed
      } = req.body;

      let submission =
        await Submission.findOne({
          studentId: userId,
          algorithmSlug
        });

      if (submission) {

        submission.code = code;
        submission.language = language;
        submission.passed = passed;

        await submission.save();

      } else {

        submission =
          await Submission.create({
            studentId: userId,
            algorithmSlug,
            code,
            language,
            passed
          });
      }

      res.json({
        success: true,
        submission
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
);


// ================= GET SAVED CODE =================

router.get(
  "/:slug",
  authMiddleware,
  async (req, res) => {

    try {

      const submission =
        await Submission.findOne({
          studentId: req.user.id,
          algorithmSlug: req.params.slug
        });

        // console.log("Submission: ", submission)
      res.json({
        success: true,
        submission
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
);

router.delete(
  "/reset/:slug",
  authMiddleware,
  async (req, res) => {

    try {

      await Submission.findOneAndDelete({
        studentId: req.user.id,
        algorithmSlug: req.params.slug
      });

      res.json({
        success: true,
        message: "Submission reset"
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
);

// ================= ADMIN VIEW =================

router.get(
  "/",
  authMiddleware,
  adminOnly,
  async (req, res) => {

    const submissions =
      await Submission.find()
        .populate("studentId");

    res.json(submissions);
  }
);

export default router;