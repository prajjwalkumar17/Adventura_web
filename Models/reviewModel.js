//review /rating /createdat/ref to tour / ref to user who wrote
const mongoose = require('mongoose');
const tourModel = require('./tourModel');
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

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await tourModel.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await tourModel.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.4,
    });
  }
};

reviewSchema.post('save', function () {
  //this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

//findByIdAndDelete
//findByIdAndUpdate
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.resource = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  //await this.findOne doesn't works here as at this point of time query has been already completed
  await this.resource.constructor.calcAverageRatings(this.resource.tour);
});

const Reviewmodel = new mongoose.model('Reviews', reviewSchema);
module.exports = Reviewmodel;

//POST /tour/tour_id/reviews
//GET /tour/id/reboews
//GET /tour/id/reboews/review_id
