const reviewModel = require('./../Models/reviewModel');

exports.getallReviews = async (req, res) => {
  const reviews = await reviewModel.find();
  return res.status(200).json({
    status: 'sucess',
    data: {
      reviews,
    },
  });
};
exports.postreview = async (req, res) => {
  const createdReview = await reviewModel.create(req.body);
  return res.status(200).json({
    status: 'sucess',
    data: {
      createdReview,
    },
  });
};