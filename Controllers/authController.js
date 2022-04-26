const User = require('./../Models/userModel');
const { promisify } = require('util');
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
exports.protect = async (req, res, next) => {
  //TODO 1 get token and check if its there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(`♠️ ${token}`);
  if (!token) {
    return next(
      res.status(401).json({
        status: 'failed',
        message: 'No token found',
      })
    );
  }

  //TODO 2 validate the token
  let decodedPayload;
  try {
    decodedPayload = await promisify(jwt.verify)(token, process.env.JWTSECRET);
    // console.log(decodedPayload);
  } catch (err) {
    return next(
      res.status(401).json({
        status: 'failed',
        message: 'Not a valid Token',
      })
    );
  }
  //TODO 3 check if user still exists
  const currUser = await User.findById(decodedPayload);
  if (!currUser) {
    return next(
      res.status(401).json({
        status: 'failed',
        message: "The user belonging to the token  doesn't exists",
      })
    );
  }
  //TODO 4 check if user changed password after token was issued

  // if (currUser.changedPasswordAfter(decodedPayload.iat)) {
  //   return next(
  //     res.status(401).json({
  //       status: 'failed',
  //       message: 'The Password was changed after the token was issued',
  //     })
  //   );
  // }

  //GRANT Access to the Protected route
  req.user = currUser;
  next();
};
