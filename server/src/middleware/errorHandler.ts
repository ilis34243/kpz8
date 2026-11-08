import { NextFunction, Request, Response } from 'express';

import { AppError } from 'errors/AppError';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    const validationError = new CustomError(
      err.statusCode,
      'Validation',
      err.message,
      null,
      null,
      err.errorsValidation,
    );
    return res.status(validationError.HttpStatusCode).json(validationError.JSON);
  }

  if (err instanceof CustomError) {
    return res.status(err.HttpStatusCode).json(err.JSON);
  }

  const unexpectedError = new CustomError(500, 'General', 'Internal server error', [err.message]);
  return res.status(unexpectedError.HttpStatusCode).json(unexpectedError.JSON);
};
