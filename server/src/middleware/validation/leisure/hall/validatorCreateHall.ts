import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateCreateHallDto } from 'dtos/leisure/hall.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorCreateHall(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;

  if (validator.isEmpty(String(body.name ?? ''))) {
    throw new AppError('Hall name is required', [{ name: 'name is required' }]);
  }

  throwValidationError('Hall', 'create', validateCreateHallDto(body));

  return next();
}
