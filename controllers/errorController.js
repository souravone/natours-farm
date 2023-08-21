const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  console.log(value);
  const message = `Duplicate field value: '${value}'. Please use another name`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input date. ${errors.join('. ')} `;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token is expired, please login again', 401);

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //Render website
  console.error('Error', err);
  return res.status(err.statusCode).render('error', {
    title: 'Somehting went wrong',
    msg: err.message,
  });
};

const sendErrProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error('Error', err);
    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }
  //Rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Somehting went wrong',
      msg: err.message,
    });
  }
  console.error('Error', err);
  return res.status(err.statusCode).render('error', {
    title: 'Somehting went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production ') {
    // let error = { ...err };
    let error = Object.create(err);
    // error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);
    if ((error.name = 'JsonWebTokenError')) error = handleJWTError();
    if ((error.name = 'TokenExpiredError')) error = handleJWTExpiredError();
    sendErrProd(error, req, res);
  }
};
