import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateCreateFeedbackDto } from 'dtos/leisure/feedback.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorCreateFeedback(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;

  if (!validator.isInt(String(body.rating ?? ''), { gt: 0, lt: 6 })) {
    throw new AppError('Feedback rating must be an integer between 1 and 5', [
      { rating: 'rating must be an integer between 1 and 5' },
    ]);
  }

  throwValidationError('Feedback', 'create', validateCreateFeedbackDto(body));

  return next();
}
