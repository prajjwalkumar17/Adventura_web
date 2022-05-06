//review /rating /createdat/ref to tour / ref to user who wrote
const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    requires: [true, "Review can't be empty"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  tour: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
  ],
  reviewwer: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
