import express from "express";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import Favorite from "../models/Favorite.js";

const router = express.Router();

// ✅ Get all favorites for a user
router.get("/", authMiddleWare, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id });
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while fetching favorites" });
  }
});

// ✅ Add a movie to favorites
router.post("/add", authMiddleWare, async (req, res) => {
  try {
    const { movieId, title ,posterPath,realeaseDate,rating} = req.body;

    // Check if already exists
    const existing = await Favorite.findOne({ user: req.user.id, movieId });
    if (existing) {
      return res.status(400).json({ msg: "Movie already in favorites" });
    }

    const newFavorite = new Favorite({
      user: req.user.id,
      movieId,
      title,
      posterPath,
      realeaseDate,
      rating

    });

    await newFavorite.save();
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while adding favorite" });
  }
});

// ✅ Remove a movie from favorites
router.delete("/remove", authMiddleWare, async (req, res) => {
  try {
    const { movieId } = req.body;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      movieId,
    });

    if (!favorite) {
      return res.status(404).json({ msg: "Favorite not found" });
    }

    res.json({ msg: `Movie ${movieId} removed from favorites` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while removing favorite" });
  }
});

export default router;
