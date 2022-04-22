const express = require('express');
const tourRouter = require('./Routes/TourRoutes');
const userRouter = require('./Routes/UserRoutes');
const appError = require('./Utils/appError');
const globalError = require('./Controllers/errorController');
const app = express();
app.use(express.json());
app.use(express.static('./public'));
const morgan = require('morgan');
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(
  //   `Can't find the url ${req.originalUrl} on this server!`
  // );
  // err.statusCode = 404;
  // err.status = 'failed';
  // next(err);
  next(
    new appError(`Can't find the url ${req.originalUrl} on this server!`, 404)
  );
});

app.use();

module.exports = app;
