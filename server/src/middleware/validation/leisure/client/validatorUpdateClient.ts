import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateUpdateClientDto } from 'dtos/leisure/client.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorUpdateClient(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;

  if (validator.isEmpty(JSON.stringify(body))) {
    throw new AppError('Client update validation error', [{ body: 'at least one field must be provided' }]);
  }

  throwValidationError('Client', 'update', validateUpdateClientDto(body));

  return next();
}
