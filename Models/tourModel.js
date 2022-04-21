const mongoose = require('mongoose');
const slugify = require('slugify');
const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Duration must be there'],
    },
    maxGroupSize: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    difficulty: {
      type: String,
      required: [true, 'Group-size must be there'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.4,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a fixed price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//TODO virtual property
toursSchema.virtual('durationWeeks').get(function () {
  return `${Math.round(this.duration / 7)} Week`;
});

//TODO document middleware:runs before save and create()
const tourpre1 = toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// const tourpre2 = toursSchema.pre('save', function (next) {
//   console.log(this);
//   next();
// });
// const tourpost = toursSchema.pre('save', function (next) {
//   console.log(this);
//   next();
// });
//TODO query middleware find hook
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
// toursSchema.post(/^find/, function (doc, next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

//TODO aggregation middleware
toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const TourModel = new mongoose.model('Tour', toursSchema);
module.exports = TourModel;
