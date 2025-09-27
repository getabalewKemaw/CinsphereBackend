// routes/favoriteRoutes.js
import express from "express";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import Favorite from "../models/Favorite.js";

const router = express.Router();

// -----------------------------
// GET all favorites for logged-in user
// -----------------------------
router.get("/", authMiddleWare, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ addedAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while fetching favorites" });
  }
});

// -----------------------------
// ADD a movie to favorites
// -----------------------------
router.post("/add", authMiddleWare, async (req, res) => {
  try {
    const { movieId, title, posterPath, releaseDate, rating, originalLanguage } = req.body;

    if (!movieId || !title || !posterPath) {
      return res.status(400).json({ msg: "Movie ID, title, and posterPath are required" });
    }

    const existing = await Favorite.findOne({ user: req.user._id, movieId });
    if (existing) {
      return res.status(400).json({ msg: "Movie already in favorites" });
    }

    const newFavorite = new Favorite({
      user: req.user._id,
      movieId,
      title,
      posterPath,
      releaseDate: releaseDate || null,
      rating: rating || null,
      originalLanguage: originalLanguage || null,
    });

    await newFavorite.save();

    // Return updated favorites list
    const updatedFavorites = await Favorite.find({ user: req.user._id }).sort({ addedAt: -1 });
    res.status(201).json({
      msg: "Movie added to favorites",
      favorite: newFavorite,
      favorites: updatedFavorites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while adding favorite" });
  }
});

// -----------------------------
// REMOVE a movie from favorites
// -----------------------------
router.delete("/remove", authMiddleWare, async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ msg: "Movie ID required" });
    }

    const favorite = await Favorite.findOneAndDelete({ user: req.user._id, movieId });
    if (!favorite) {
      return res.status(404).json({ msg: "Favorite not found" });
    }

    // Return updated favorites list
    const updatedFavorites = await Favorite.find({ user: req.user._id }).sort({ addedAt: -1 });
    res.json({
      msg: `Movie ${movieId} removed from favorites`,
      favorites: updatedFavorites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while removing favorite" });
  }
});

export default router;
