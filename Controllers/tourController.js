const tourModel = require('./../Models/tourModel');
const handler = require('./handlerFactory');

exports.getMonthPlans = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const monthPlan = await tourModel.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarting: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarting: -1 },
      },
      // {
      //   $limit: 6,
      // },
    ]);

    res.status(200).json({
      status: 'sucess',
      data: {
        monthPlan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getStats = async (req, res) => {
  //get stats
  //this is a test comment
  //done
  try {
    const stats = await tourModel.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },

          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        },
      },
      {
        $sort: { avgPriceg: 1 },
      },
    ]);
    res.status(200).json({
      status: 'sucess',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid dataset',
    });
  }
};

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = handler.getAll(tourModel);
exports.getTour = handler.getOne(tourModel, {
  path: 'reviews',
});
exports.createTour = handler.createOne(tourModel);
exports.updateTour = handler.updateOne(tourModel);
exports.deleteTour = handler.deleteOne(tourModel);
