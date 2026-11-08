import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateUpdateEventRegistrationDto } from 'dtos/leisure/eventRegistration.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorUpdateEventRegistration(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;

  if (validator.isEmpty(JSON.stringify(body))) {
    throw new AppError('Event registration update validation error', [{ body: 'at least one field must be provided' }]);
  }

  throwValidationError('Event registration', 'update', validateUpdateEventRegistrationDto(body));

  return next();
}
