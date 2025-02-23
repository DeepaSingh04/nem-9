const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  username: String,
  workoutType: String, // "Cardio", "Strength", "Yoga", etc.
  duration: Number, // in minutes
  caloriesBurned: Number,
  workoutDate: Date,
  intensity: String, // "Low", "Medium", "High"
});

module.exports = mongoose.model('Workout', workoutSchema);
