import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateUpdateHallDto } from 'dtos/leisure/hall.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorUpdateHall(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;

  if (validator.isEmpty(JSON.stringify(body))) {
    throw new AppError('Hall update validation error', [{ body: 'at least one field must be provided' }]);
  }

  throwValidationError('Hall', 'update', validateUpdateHallDto(body));

  return next();
}
