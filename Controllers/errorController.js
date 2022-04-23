module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.status).json({
    status: err.status,
    message: err.message,
  });
};
