const mongoose = require('mongoose');
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
    PasswordLastChangedAt: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
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

const UserModel = new mongoose.model('Users', userSchema);
module.exports = UserModel;
