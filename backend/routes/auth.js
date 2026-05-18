import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import dotconf from "dotenv"
dotconf.config();

import User from "../models/User.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/users.json");

router.post("/register", async (req, res) => {
  try {

    const { username, password, role } = req.body;

   
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

  
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashed,
      role: role || "student"
    });

    user.save()
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRECT_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: user.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({username})

  if (!user) return res.status(400).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.SECRECT_KEY
  );

  res.json({ token, role: user.role });
});

export default router;