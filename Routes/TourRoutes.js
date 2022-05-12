const express = require('express');
const tourController = require('./../Controllers/tourController');
const authController = require('./../Controllers/authController');
const reviewRouter = require('./ReviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/plan/:year')
  .get(tourController.aliasTopTours, tourController.getMonthPlans);

router
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/tour-stats')
  .get(tourController.aliasTopTours, tourController.getStats);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// router.route('/:tourId/reviews').post(
//   authController.protect,
//   // authController.restrictTo('user'),
//   reviewController.postreview
// );

module.exports = router;
