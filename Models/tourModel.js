const mongoose = require('mongoose');
const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
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
});

const TourModel = new mongoose.model('Tour', toursSchema);
module.exports = TourModel;
