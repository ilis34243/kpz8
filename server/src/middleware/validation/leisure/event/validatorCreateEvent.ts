import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateCreateEventDto } from 'dtos/leisure/event.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorCreateEvent(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;

  if (validator.isEmpty(String(body.name ?? ''))) {
    throw new AppError('Event name is required', [{ name: 'name is required' }]);
  }

  throwValidationError('Event', 'create', validateCreateEventDto(body));

  return next();
}
