const reviewModel = require('./../Models/reviewModel');
const handler = require('./handlerFactory');

exports.setTourUserIdstoBody = async (req, res, next) => {
  //INIT allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getallReviews = handler.getAll(reviewModel);
exports.postreview = handler.createOne(reviewModel);
exports.getAreview = handler.getOne(reviewModel);
exports.deleteAreview = handler.deleteOne(reviewModel);
exports.updateAreview = handler.updateOne(reviewModel);
