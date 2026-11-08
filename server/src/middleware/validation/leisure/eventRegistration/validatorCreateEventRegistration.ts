import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateCreateEventRegistrationDto } from 'dtos/leisure/eventRegistration.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorCreateEventRegistration(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;

  if (validator.isEmpty(String(body.event_id ?? ''))) {
    throw new AppError('Event registration event_id is required', [{ event_id: 'event_id is required' }]);
  }

  throwValidationError('Event registration', 'create', validateCreateEventRegistrationDto(body));

  return next();
}
