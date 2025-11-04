import express from "express";
import { ensureAuth } from "../middleware/authMiddleware.js";
import Search from "../models/Search.js";

const router = express.Router();

router.get("/", ensureAuth, async (req, res) => {
  try {
    const history = await Search.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(100);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
