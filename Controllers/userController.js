const UserModel = require('./../Models/userModel');
const userModel = require('./../Models/userModel');

const filterBy = (obj, ...allowedFields) => {
  const newobj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newobj[el] = obj[el];
  });
  return newobj;
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      status: 'Success',
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
exports.updateme = async (req, res, next) => {
  //TODO Create error when there is password in the body
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      res.status(401).json({
        status: 'failed',
        message: "Password can't be changed here",
      })
    );
  }
  //TODO Filter  user query
  const filteredBody = filterBy(req.body, 'name', 'email');
  //TODO datatochange so that the fields we don't want doesn't gets changed
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  //TODO update user document
  res.status(200).json({
    status: 'sucessfull',
    data: {
      updatedUser,
    },
  });
};
exports.deleteMe = async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'Sucessfull',
    data: null,
  });
};
