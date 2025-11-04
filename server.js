
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";

// routes
import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import topSearchesRoutes from "./routes/topSearchesRoutes.js";


import "./config/passport.js"; // must import after env loaded
// console.log("GOOGLE_CLIENT_ID    =", process.env.GOOGLE_CLIENT_ID);
// console.log("GOOGLE_CALLBACK_URL =", process.env.GOOGLE_CALLBACK_URL);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// CORS - allow client origin
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
// console.log("GOOGLE CALLBACK:", process.env.GOOGLE_CALLBACK_URL);


// cookie session for passport
app.set("trust proxy", 1);

app.use(session({
  secret: process.env.SESSION_SECRET || "session_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
  secure: process.env.NODE_ENV === "production", // true only on HTTPS
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
}

}));

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/top-searches", topSearchesRoutes);

app.get("/", (req, res) => res.send("Image Search API running"));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,
  useUnifiedTopology: true})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
