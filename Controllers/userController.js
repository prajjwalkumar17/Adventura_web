const userModel = require('./../Models/userModel');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      status: 'error',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'No users found',
    });
  }
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined as of now!',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined as of now!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined as of now!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined as of now!',
  });
};
