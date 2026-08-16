const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Something went wrong';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map(item => item.message).join(', ');
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${error.path}`;
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'This record already exists';
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message
  });
};

export default errorHandler;
