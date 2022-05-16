const APIFeatures = require('./../Utils/APIFeatures');
exports.deleteOne = (Model) => async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'failed',
      message: 'No such tour found',
    });
  }
};
exports.updateOne = (Model) => async (req, res) => {
  try {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(202).json({
      status: 'sucess',
      data: {
        updatedDoc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid request',
    });
  }
};
exports.createOne = (Model) => async (req, res) => {
  try {
    const newCreateddoc = await Model.create(req.body);
    return res.status(201).json({
      status: 'sucess',
      data: {
        data: newCreateddoc,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Invalid data received',
      err,
    });
  }
};
exports.getOne = (Model, populateOptions) => async (req, res) => {
  try {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    //TODO pupulating req tours with the guides data by adding populate in query and not in actual database
    // const doc = await Model.findById(req.params.id).populate('reviews');
    const doc = await query;
    //poipulating the reviews for only get of one tour by virtual populate
    //we only populate the references in model with the guide details using middle ware

    return res.status(200).json({
      status: 'sucess',
      results: 1,
      data: {
        data: doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }
};
exports.getAll = (Model) => async (req, res) => {
  //to allow for nested GET reviews for tours(hack)
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  try {
    //Execute query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sortQuery()
      .limitFields()
      .paginate();

    // const allData = await features.query.explain();
    const allData = await features.query;

    return res.status(200).json({
      status: 'sucess',
      results: allData.length,
      data: {
        data: allData,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
