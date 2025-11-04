 import dotenv from "dotenv";
dotenv.config();

 import express from "express";
import passport from "passport";
const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL;

// Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: CLIENT_URL + "/login",
    session: true
  }),
  (req, res) => {
    console.log("user after login:", req.user); // <--- ADD THIS LINE
    res.redirect(CLIENT_URL + "/");
  }
);
// GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: CLIENT_URL + "/login", session: true }),
  (req, res) => res.redirect(CLIENT_URL + "/"));

// Facebook (optional)
router.get("/facebook", passport.authenticate("facebook"));

router.get("/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: CLIENT_URL + "/login", session: true }),
  
  (req, res) => res.redirect(CLIENT_URL + "/"));

// get current user
router.get("/current_user", (req, res) => {
  res.json({ user: req.user || null });
});

// logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(CLIENT_URL + "/");
  });
});

export default router;
