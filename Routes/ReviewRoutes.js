const express = require('express');
const reviewController = require('./../Controllers/reviewController');
const authController = require('./../Controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getallReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIdstoBody,
    reviewController.postreview
  );
router
  .route('/:id')
  .get(reviewController.getAreview)
  .delete(
    authController.restrictTo('user', 'sdmin'),
    reviewController.deleteAreview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateAreview
  );
module.exports = router;
