//review /rating /createdat/ref to tour / ref to user who wrote
const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      requires: [true, "Review can't be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tours',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: [true, 'Review must belong to a author'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//BUG to remove the chain of populate
// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'tour',
//     select: 'name',
//   }).populate({
//     path: 'user',
//     select: 'name photo',
//   });
//   next();
// });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Reviewmodel = new mongoose.model('Reviews', reviewSchema);
module.exports = Reviewmodel;

//POST /tour/tour_id/reviews
//GET /tour/id/reboews
//GET /tour/id/reboews/review_id
