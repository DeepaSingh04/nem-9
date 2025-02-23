const express = require('express');
const WatchHistory = require('../models/watchHistory');

const router = express.Router();

// 1️ Add a new watch record
router.post('/watch-history', async (req, res) => {
  try {
    const newRecord = new WatchHistory(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 2️ Find top 5 most-watched movies based on total watch time
router.get('/analytics/top-movies', async (req, res) => {
  try {
    const topMovies = await WatchHistory.aggregate([
      { $group: { _id: "$movie", totalWatchTime: { $sum: "$watchTime" } } },
      { $sort: { totalWatchTime: -1 } },
      { $limit: 5 }
    ]);
    if (!topMovies.length) return res.status(404).json({ message: "No data found" });
    res.json(topMovies);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 3️ Show total watch time per genre
router.get('/analytics/genre-popularity', async (req, res) => {
  try {
    const genrePopularity = await WatchHistory.aggregate([
      { $group: { _id: "$genre", totalWatchTime: { $sum: "$watchTime" } } }
    ]);
    if (!genrePopularity.length) return res.status(404).json({ message: "No data found" });
    res.json(genrePopularity);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 4️ Compute average watch time per user
router.get('/analytics/user-engagement', async (req, res) => {
  try {
    const userEngagement = await WatchHistory.aggregate([
      { $group: { _id: "$username", avgWatchTime: { $avg: "$watchTime" } } }
    ]);
    if (!userEngagement.length) return res.status(404).json({ message: "No data found" });
    res.json(userEngagement);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 5️ Compare watch time of Free vs Premium users
router.get('/analytics/subscription-watchtime', async (req, res) => {
  try {
    const subscriptionWatchTime = await WatchHistory.aggregate([
      { $group: { _id: "$subscriptionType", totalWatchTime: { $sum: "$watchTime" } } }
    ]);
    if (!subscriptionWatchTime.length) return res.status(404).json({ message: "No data found" });
    res.json(subscriptionWatchTime);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 6️ Get top 3 highest-rated movies based on average rating
router.get('/analytics/highest-rated-movies', async (req, res) => {
  try {
    const highestRatedMovies = await WatchHistory.aggregate([
      { $group: { _id: "$movie", avgRating: { $avg: "$rating" } } },
      { $sort: { avgRating: -1 } },
      { $limit: 3 }
    ]);
    if (!highestRatedMovies.length) return res.status(404).json({ message: "No data found" });
    res.json(highestRatedMovies);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
