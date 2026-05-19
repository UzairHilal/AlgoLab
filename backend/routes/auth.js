import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../models/User.js";

dotenv.config();

const router = express.Router();

// ================= REGISTER =================

router.post("/register", async (req, res) => {

  try {

    const {
      fullName,
      rollNumber,
      password,
      role
    } = req.body;

    // ================= VALIDATION =================

    if (!fullName || !password || !role) {

      return res.status(400).json({
        msg: "Missing required fields"
      });

    }

    if (
      role === "student" &&
      !rollNumber
    ) {

      return res.status(400).json({
        msg: "Roll number is required for students"
      });

    }

    // ================= CHECK EXISTING =================

    let existingUser = null;

    if (role === "student") {

      existingUser =
        await User.findOne({
          rollNumber:
            rollNumber.toUpperCase()
        });

    } else {

      existingUser =
        await User.findOne({
          fullName
        });

    }

    if (existingUser) {

      return res.status(400).json({
        msg: "User already exists"
      });

    }

=
    const hashed =
      await bcrypt.hash(
        password,
        10
      );


    const user =
      await User.create({

        fullName,

        rollNumber:
          role === "student"
            ? rollNumber.toUpperCase()
            : undefined,

        password: hashed,

        role
      });

    // ================= JWT =================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },

      process.env.SECRET_KEY,

      {
        expiresIn: "7d"
      }
    );

  
    res.json({

      token,

      role: user.role,

      user: {

        id: user._id,

        fullName:
          user.fullName,

        rollNumber:
          user.rollNumber,

        role:
          user.role
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Server error"
    });

  }
});



router.post("/login", async (req, res) => {

  try {

    const {
      rollNumber,
      fullName,
      password
    } = req.body;

    let user = null;

    // ================= STUDENT LOGIN =================

    if (rollNumber) {

      user = await User.findOne({
        rollNumber:
          rollNumber.toUpperCase()
      });

    }

    // ================= ADMIN LOGIN =================

    else if (fullName) {

      user = await User.findOne({
        fullName
      });

    }

    if (!user) {

      return res.status(400).json({
        msg: "User not found"
      });

    }

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {

      return res.status(400).json({
        msg: "Wrong password"
      });

    }

  
    const token = jwt.sign(

      {
        id: user._id,
        role: user.role
      },

      process.env.SECRET_KEY,

      {
        expiresIn: "7d"
      }
    );

    res.json({

      token,

      role: user.role,

      user: {

        fullName:
          user.fullName,

        rollNumber:
          user.rollNumber,

        role:
          user.role
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Server error"
    });

  }
});

export default router;