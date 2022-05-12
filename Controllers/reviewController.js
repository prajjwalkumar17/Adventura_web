const reviewModel = require('./../Models/reviewModel');

exports.getallReviews = async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await reviewModel.find(filter);
  return res.status(200).json({
    status: 'sucess',
    data: {
      reviews,
    },
  });
};
exports.postreview = async (req, res) => {
  //INIT allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const createdReview = await reviewModel.create(req.body);
  return res.status(200).json({
    status: 'sucess',
    data: {
      createdReview,
    },
  });
};
