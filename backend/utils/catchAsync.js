/**
 * Centralized Async Error Handler
 * Wraps async functions to catch errors and pass them to the global error handler
 * Eliminates the need for repeated try-catch blocks
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
