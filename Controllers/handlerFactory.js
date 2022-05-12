exports.deleteOne = (Model) => async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'No such tour found',
    });
  }
};
