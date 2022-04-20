const express = require('express');
const tourController = require('./../Controllers/tourController');

const router = express.Router();

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
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
