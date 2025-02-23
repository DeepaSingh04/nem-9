const express = require('express');
const Workout = require('../models/workout');

const router = express.Router();

// 1️ Add a new workout record
router.post('/workouts', async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 2️ Find top 3 most common workout types
router.get('/analytics/top-workouts', async (req, res) => {
  try {
    const topWorkouts = await Workout.aggregate([
      { $group: { _id: "$workoutType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);
    if (!topWorkouts.length) return res.status(404).json({ message: "No data found" });
    res.json(topWorkouts);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 3️ Calculate average calories burned per workout type
router.get('/analytics/average-calories', async (req, res) => {
  try {
    const avgCalories = await Workout.aggregate([
      { $group: { _id: "$workoutType", avgCalories: { $avg: "$caloriesBurned" } } }
    ]);
    if (!avgCalories.length) return res.status(404).json({ message: "No data found" });
    res.json(avgCalories);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 4️ Show distribution of workouts by intensity level
router.get('/analytics/intensity-distribution', async (req, res) => {
  try {
    const intensityDistribution = await Workout.aggregate([
      { $group: { _id: "$intensity", count: { $sum: 1 } } }
    ]);
    if (!intensityDistribution.length) return res.status(404).json({ message: "No data found" });
    res.json(intensityDistribution);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 5️ Count number of workouts done each week
router.get('/analytics/weekly-activity', async (req, res) => {
  try {
    const weeklyActivity = await Workout.aggregate([
      { $group: { _id: { $week: "$workoutDate" }, totalWorkouts: { $sum: 1 } } }
    ]);
    if (!weeklyActivity.length) return res.status(404).json({ message: "No data found" });
    res.json(weeklyActivity);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 6️ Get users with the highest total workout time
router.get('/analytics/top-performing-users', async (req, res) => {
  try {
    const topUsers = await Workout.aggregate([
      { $group: { _id: "$username", totalDuration: { $sum: "$duration" } } },
      { $sort: { totalDuration: -1 } },
      { $limit: 5 }
    ]);
    if (!topUsers.length) return res.status(404).json({ message: "No data found" });
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
