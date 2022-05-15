const express = require('express');
const router = express.Router();
const userController = require('./../Controllers/userController');
const authController = require('./../Controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

//auth required
router.use(authController.protect);
router.patch('/updateme', userController.updateme);
router.delete('/deleteme', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMyPassword', authController.updatePassword);

//restricted only to admins
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
