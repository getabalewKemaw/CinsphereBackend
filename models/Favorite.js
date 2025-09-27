import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  posterPath: {  // ✅ Store poster for rendering
    type: String,
    required: true,
  },
  rating: {      // ✅ Store vote_average (optional)
    type: Number,
  },
  releaseDate: { // ✅ Store release_date (optional)
    type: String,
  },
  originalLanguage: { // ✅ Store original language (optional)
    type: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;
