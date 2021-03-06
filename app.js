const path = require('path');
const express = require('express');
const tourRouter = require('./Routes/TourRoutes');
const userRouter = require('./Routes/UserRoutes');
const reviewRouter = require('./Routes/ReviewRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
// const appError = require('./Utils/appError');
// const globalErrorHandler = require('./Controllers/errorController');
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static('./public'));
app.use(express.static(path.join(__dirname, 'public')));

//INIT Global Middlewares
//TODO Sanitize global middleware
app.use(mongoSanitize());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'difficulty',
      'price',
      'maxGroupSize',
      'ratingsQuantity',
    ],
  })
);

app.use(compression());
//TODO set http headers
app.use(helmet());

//TODO Body parser reding data from body into req.body and limit data to only 10 kb
app.use(express.json({ limit: '10kb' }));

//TODO dev logger
const morgan = require('morgan');
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//TODO limit req from same IP
const IPlimit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many req from this ip please try after some time',
});
app.use('/api', IPlimit);

//TODO routes
app.get('/', (req, res) => {
  //wiil search it autoamtically in
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Pk',
  });
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//TODO test middlewares for non defined routes
app.all('*', (req, res, next) => {
  // next(
  //   new appError(`Can't find the url ${req.originalUrl} on this server!`, 404)
  // );
  res.status(400).json({
    status: 'Failed',
    message: 'Invalid Url',
  });
});

// app.use(globalErrorHandler);

module.exports = app;
