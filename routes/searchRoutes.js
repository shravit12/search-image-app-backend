import express from "express";
import { ensureAuth } from "../middleware/authMiddleware.js";
import { handleSearch } from "../controllers/searchController.js";
const router = express.Router();

router.post("/", ensureAuth, handleSearch);

export default router;
