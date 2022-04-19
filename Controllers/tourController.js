const tourModel = require('./../Models/tourModel');
const APIFeatures = require('./../Utils/APIFeatures');

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
    const idRequested = req.params.id;
    // const tourData = await tourModel.findById(idRequested);
    const tourData = await tourModel.findOne({ _id: idRequested });

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

exports.deleteTour = async (req, res) => {
  try {
    await tourModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      data: tourtoDelete,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'No such tour found',
    });
  }
};
