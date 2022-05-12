const tourModel = require('./../Models/tourModel');
const APIFeatures = require('./../Utils/APIFeatures');
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

exports.getAllTours = async (req, res) => {
  try {
    //Execute query
    const features = new APIFeatures(tourModel.find(), req.query)
      .filter()
      .sortQuery()
      .limitFields()
      .paginate();

    const allTourData = await features.query;

    //send result
    res.status(200).json({
      status: 'sucess',
      results: allTourData.length,
      data: {
        tours: allTourData,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // const tourData = await tourModel.findById(idRequested);
    //TODO pupulating req tours with the guides data by adding populate in query and not in actual database
    const tourData = await tourModel
      .findById(req.params.id)
      .populate('reviews');
    //poipulating the reviews for only get of one tour by virtual populate
    //we only populate the references in model with the guide details using middle ware

    res.status(200).json({
      status: 'sucess',
      results: 1,
      data: {
        tour: tourData,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newCreatedTour = await tourModel.create(req.body);

    // console.log(newCreatedTour);
    res.status(201).json({
      status: 'sucess',
      data: {
        tours: newCreatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: 'Invalid data received',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await tourModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(202).json({
      data: updatedTour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'Invalid request',
    });
  }
};

exports.deleteTour = handler.deleteOne(tourModel);
