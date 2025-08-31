const error = (err, req, res, next) => {
  if (err.code === 11000) {
    err.message = 'Email already in use';
    err.statusCode = 409;
  }

  if (err.name === 'CastError') {
    err.message = 'Invalid Id, please provide correct Id';
    err.statusCode = 404;
  }
  //! global error handler
  err.message = err.message || 'Internal Server Error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    obj: err,
    errLine: err.stack,
  });
};

module.exports = { error };
