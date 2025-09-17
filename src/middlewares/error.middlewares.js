const error = (err, req, res, next) => {

  let error = { ...err }
  if (error.code === 11000) {
    error.message = 'Email already in use';
    error.statusCode = 409;
  }

  if (error.name === 'CasteError') {
    error.message = 'Invalid Id, please provide correct Id';
    error.statusCode = 404;
  }
  //! global erroror handler
  error.message = error.message || 'Internal Server erroror';
  error.statusCode = error.statusCode || 500;

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    obj: err,
    errorLine: err.stack,
  });
};

module.exports = { error };
