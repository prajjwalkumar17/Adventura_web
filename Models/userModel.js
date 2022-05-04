const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'An email is req for auth'],
    trim: true,
    unique: [true, 'Email already registered'],
    lowercase: true,
    validate: [validator.isEmail, 'Not a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Provide a password of 8 min length '],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'lead-guide', 'guide'],
    default: 'user',
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirm the password'],
    //on;y works on save
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not same',
    },
  },
  PasswordLastChangedAt: Date,
  PasswordResetTokenExpiresIn: Date,
  PasswordResetToken: String,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  //for password changed
  this.PasswordLastChangedAt = Date.now() - 1000;
  return next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.loginPasswordChecker = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function (JWTTimeStamp) {
  if (this.PasswordLastChangedAt) {
    const changedTimeStamp = parseInt(
      this.PasswordLastChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.PasswordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.PasswordResetToken);
  this.PasswordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const UserModel = new mongoose.model('Users', userSchema);
module.exports = UserModel;
