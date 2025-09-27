import express from 'express';
import passport from "passport";
import jwt from "jsonwebtoken"


import { signUp, login } from '../controllers/authController.js';

const router = express.Router();
router.post('/signup', signUp);
router.post('/login',login);

// Step 1: Redirect user to Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Google redirects back
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // ✅ Issue JWT in cookie here
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("http://localhost:5000"); // frontend
  }
);



export default router;

