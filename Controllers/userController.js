const UserModel = require('./../Models/userModel');
const userModel = require('./../Models/userModel');
const handler = require('./handlerFactory');

const filterBy = (obj, ...allowedFields) => {
  const newobj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newobj[el] = obj[el];
  });
  return newobj;
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined! Use signUp for this',
  });
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
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
  return next(
    res.status(204).json({
      status: 'Sucessfull',
      data: null,
    })
  );
};
exports.getAllUsers = handler.getAll(userModel);
exports.getUser = handler.getOne(userModel);
exports.updateUser = handler.updateOne(userModel);
exports.deleteUser = handler.deleteOne(userModel);
