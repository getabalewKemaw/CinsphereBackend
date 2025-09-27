import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import session from "express-session";
import cookieParser from "cookie-parser";
dotenv.config();
import passport from "./config/passport.js";

connectDB();

const app = express();
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // <--- Parse urlencoded bodies as well!
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5174",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("/", cors());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/user", authRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => {
  res.send("Ciniphere backend is running ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});