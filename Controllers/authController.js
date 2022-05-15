const User = require('./../Models/userModel');
const sendEmail = require('./../Utils/email');
const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const TokenSigner = (Givenid) => {
  return jwt.sign({ id: Givenid }, process.env.JWTSECRET, {
    expiresIn: process.env.EXPIRESIN,
  });
};
const createAndSendToken = (user, statusCode, res) => {
  const token = TokenSigner(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIEEXPIRESIN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //Sets password to be not visible in output
  user.password = undefined;
  user.__v = undefined;
  if (process.NODE_ENV === 'production') coolieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'sucess',
    token,
    data: {
      user,
    },
  });
};
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    createAndSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  //TODO check if email and passwords are filled in
  if (!email || !password) {
    return next(
      res.status(400).json({
        status: 'failed',
        message: 'must enter email and password',
      })
    );
  }
  //TODO check if email and password are correct
  const userCred = await User.findOne({ email }).select('+password');
  if (
    !userCred ||
    !(await userCred.loginPasswordChecker(password, userCred.password))
  ) {
    return next(
      res.status(400).json({
        status: 'failed',
        message: 'The entered Password/Username is incorrect',
      })
    );
  }

  //TODOLog in user by sending him toked
  createAndSendToken(userCred, 200, res);
};
exports.protect = async (req, res, next) => {
  //TODO 1 get token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

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
  } catch (err) {
    return next(
      res.status(401).json({
        status: 'failed',
        message: 'Not a valid Token',
        err,
      })
    );
  }
  //TODO 3 check if user still exists
  const currUser = await User.findById(decodedPayload.id);
  if (!currUser) {
    return next(
      res.status(401).json({
        status: 'failed',
        message: "The user belonging to the token  doesn't exists",
      })
    );
  }
  //TODO 4 check if user changed password after token was issued

  const passChanged = await currUser.changedPasswordAfter(decodedPayload.iat);
  if (passChanged) {
    return next(
      res.status(401).json({
        status: 'failed',
        message: 'The Password was changed after the token was issued',
      })
    );
  }

  //TODOGRANT Access to the Protected route
  req.user = currUser;
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles['admin','user','lead-guide','guide'] role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          status: 'failed',
          message: 'not enough permissions',
        })
      );
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  //TODO get user from the speacified management
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      res.status(404).json({
        status: 'failed',
        message: 'No user found with this email address',
      })
    );
  }
  //TODO generate random reset token
  const resetToken = user.createPasswordResetToken();
  // console.log(`😉 ${resetToken}`);
  await user.save({ validateBeforeSave: false });
  //TODO send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot your password we are here to help\n
  Patch request with your new password and password confirm to:\n\n${resetURL}\nIf you didn't requested this please ignore!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'password token (Valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'Success',
      message: 'Token sent to email',
    });
  } catch (err) {
    console.log(err);
    user.PasswordResetToken = undefined;
    user.PasswordResetTokenExpiresIn = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      res.status(500).json({
        status: 'failed',
        message: 'There was an error sending the email',
      })
    );
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    //TODO get user based on token
    const hashOfRecievedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      PasswordResetToken: hashOfRecievedToken,
      PasswordResetTokenExpiresIn: { $gt: Date.now() },
    });

    //TODO if token has not expired and there is user set the new password
    if (!user)
      return next(
        res.status(500).json({
          status: 'failed',
          message: 'There is no such user or token already expired',
        })
      );
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.PasswordResetToken = undefined;
    user.PasswordResetTokenExpiresIn = undefined;
    await user.save();
    //TODO update changedPasswordAt property of user
    //done in the model
    //TODO log the user in send JWT
    createAndSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: 'There is some server related issue',
      err,
    });
  }
};
exports.updatePassword = async (req, res, next) => {
  //TODO get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //TODO if the supplied current password is correct
  if (
    !(await user.loginPasswordChecker(req.body.passwordCurrent, user.password))
  ) {
    return next(
      res.status(401).json({
        status: 'failed',
        message: 'The current password was wrong',
      })
    );
  }

  //TODO update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //TODO login user and send jWT
  createAndSendToken(user, 200, res);
};
