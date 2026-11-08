import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateUpdateEventDto } from 'dtos/leisure/event.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorUpdateEvent(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;

  if (validator.isEmpty(JSON.stringify(body))) {
    throw new AppError('Event update validation error', [{ body: 'at least one field must be provided' }]);
  }

  throwValidationError('Event', 'update', validateUpdateEventDto(body));

  return next();
}
