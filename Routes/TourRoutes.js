const express = require('express');
const tourController = require('./../Controllers/tourController');
const authController = require('./../Controllers/authController');
const reviewRouter = require('./ReviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.aliasTopTours,
    tourController.getMonthPlans
  );

router
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/tour-stats')
  .get(tourController.aliasTopTours, tourController.getStats);

router
  .route('/tours-within/:distance/location/:latlon/unit/:unit')
  .get(tourController.getToursWithin);

router
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// router.route('/:tourId/reviews').post(
//   authController.protect,
//   // authController.restrictTo('user'),
//   reviewController.postreview
// );

module.exports = router;
