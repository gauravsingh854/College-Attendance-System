import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (validatorFn) => {
  return (req, res, next) => {
    const { error, value } = validatorFn(req.body);
    if (error) {
      const errorDetails = Array.isArray(error) ? error : [error];
      return next(new ApiError(400, 'Validation Error', errorDetails));
    }
    req.validatedBody = value;
    next();
  };
};
