import axios from "axios";
import Search from "../models/Search.js";
import dotenv from "dotenv";
dotenv.config();
export const handleSearch = async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) return res.status(400).json({ error: "term required" });

    // save to DB
    await Search.create({ userId: req.user._id, term, timestamp: new Date() });

    // call Unsplash
    const resp = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: term, per_page: 30 },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    });

    return res.json({ total: resp.data.total, results: resp.data.results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
