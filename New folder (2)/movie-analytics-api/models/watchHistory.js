const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  username: String,
  movie: String,
  genre: String,
  watchTime: Number, // in minutes
  subscriptionType: String, // "Free", "Premium"
  watchedDate: Date,
  rating: Number, // Scale 1-5
});

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
