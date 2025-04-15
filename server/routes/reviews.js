const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const authenticateUser = require("../middleware/authenticateUser"); // Import the authenticateUser middleware

// GET reviews by movieId
router.get("/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// POST review (requires auth)
router.post("/", authenticateUser, async (req, res) => {
  const { movieId, reviewText } = req.body;

  if (!movieId || !reviewText) {
    return res.status(400).json({ message: "Missing movieId or reviewText" });
  }

  try {
    const newReview = new Review({
      movieId,
      reviewText,
      userEmail: req.user.email, // Use the user's email from the decoded token
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: "Error saving review" });
  }
});

module.exports = router;
