const express = require('express');
const reviewController = require('./../Controllers/reviewController');
const authController = require('./../Controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(reviewController.getallReviews).post(
  authController.protect,
  // authController.restrictTo('user'),
  reviewController.postreview
);
router.route('/:id').delete(reviewController.deleteAreview);
module.exports = router;
