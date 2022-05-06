const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
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
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      description: String,
      address: String,
    },
    //TODO embedding
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
        address: String,
        day: Number,
      },
    ],
    //TODO embedding
    // guidesIds: Array,
    //TODO referencing & populating
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        //This is the table connection
        ref: 'Users',
      },
    ],
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

//INIT virtually populating the review in tour and not doing child ref as it could grow infnite
toursSchema.virtual('reviews', {
  ref: 'Reviews',
  foreignField: 'tour',
  localField: '_id',
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
//INIT for embedding the guides works only for creating new doc
// toursSchema.pre('save', async function (next) {
//   const guidesPromises = this.guidesIds.map(
//     async (id) => await User.findById(id)
//   );
//   this.guidesIds = await Promise.all(guidesPromises);
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
//INIT populating guide details
toursSchema.pre(/^find/, function (next) {
  //this points to current query and populates all the docs
  this.populate({
    path: 'guides',
    select: '-__v -PasswordLastChangedAt',
  });
  next();
});

//TODO aggregation middleware
toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const TourModel = new mongoose.model('Tours', toursSchema);
module.exports = TourModel;
