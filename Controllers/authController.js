const User = require('./../Models/userModel');
const jwt = require('jsonwebtoken');

const TokenSigner = (Givenid) => {
  return jwt.sign({ id: Givenid }, process.env.JWTSECRET, {
    expiresIn: process.env.EXPIRESIN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    const token = TokenSigner(newUser._id);
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
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  //TODO check if email and passwords are filled in
  if (!email || !password) {
    res.status(400).json({
      status: 'failed',
      message: 'must enter email and password',
    });
  }
  //TODO check if email and password are correct
  const userCred = await User.findOne({ email }).select('+password');
  if (
    !userCred ||
    !(await userCred.loginPasswordChecker(password, userCred.password))
  ) {
    res.status(400).json({
      status: 'failed',
      message: 'The entered Password/Username is incorrect',
    });
  }

  //TODOLog in user by sending him toked
  const token = TokenSigner(userCred._id);
  res.status(200).json({
    status: 'success',
    data: {
      loggefIn: true,
      Token: token,
    },
  });
};
