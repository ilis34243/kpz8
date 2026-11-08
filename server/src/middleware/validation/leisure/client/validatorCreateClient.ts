import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateCreateClientDto } from 'dtos/leisure/client.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorCreateClient(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;

  if (validator.isEmpty(String(body.full_name ?? ''))) {
    throw new AppError('Client full_name is required', [{ full_name: 'full_name is required' }]);
  }

  throwValidationError('Client', 'create', validateCreateClientDto(body));

  return next();
}
