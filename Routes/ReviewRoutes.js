const express = require('express');
const reviewController = require('./../Controllers/reviewController');
const authController = require('./../Controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(reviewController.getallReviews).post(
  authController.protect,
  // authController.restrictTo('user'),
  reviewController.setTourUserIdstoBody,
  reviewController.postreview
);
router
  .route('/:id')
  .delete(reviewController.deleteAreview)
  .get(reviewController.getAreview)
  .patch(reviewController.updateAreview);
module.exports = router;
