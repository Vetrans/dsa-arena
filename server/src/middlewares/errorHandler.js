export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500; let code = err.code || 'INTERNAL_ERROR'; let message = err.message || 'Internal Server Error'; let errors = err.details || null;
  if (err.name === 'ValidationError') { statusCode = 400; code = 'VALIDATION_ERROR'; message = 'Validation error'; errors = Object.values(err.errors).map((e) => e.message); }
  if (err.code === 11000) { statusCode = 409; code = 'CONFLICT'; message = 'A record with this value already exists'; }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') { statusCode = 401; code = 'AUTH_REQUIRED'; message = 'Authentication is invalid or expired'; }
  req.log?.error({ err, code, statusCode }, 'Request failed');
  res.status(statusCode).json({ success: false, code, message, errors, requestId: req.id, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) });
};
