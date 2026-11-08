import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateUpdateFeedbackDto } from 'dtos/leisure/feedback.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorUpdateFeedback(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;

  if (validator.isEmpty(JSON.stringify(body))) {
    throw new AppError('Feedback update validation error', [{ body: 'at least one field must be provided' }]);
  }

  throwValidationError('Feedback', 'update', validateUpdateFeedbackDto(body));

  return next();
}
