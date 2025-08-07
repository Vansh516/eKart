const error = (err, req, res, next) => {
  //! global error handler
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    obj: err,
  });
};

module.exports = { error };
