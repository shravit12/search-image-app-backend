import express from "express";
import Search from "../models/Search.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const top = await Search.aggregate([
      { $group: { _id: "$term", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(top.map(t => ({ term: t._id, count: t.count })));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
