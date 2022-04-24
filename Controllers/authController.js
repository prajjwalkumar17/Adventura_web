const User = require('./../Models/userModel');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    const token = jwt.sign({ id: newUser._id }, process.env.JWTSECRET, {
      expiresIn: process.env.EXPIRESIN,
    });
    res.status(201).json({
      status: 'sucess',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};
