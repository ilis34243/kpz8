import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateCreateHallRentalDto } from 'dtos/leisure/hallRental.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorCreateHallRental(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const totalCost = String(body.total_cost ?? '');

  if (validator.isEmpty(totalCost)) {
    throw new AppError('Hall rental total_cost is required', [{ total_cost: 'total_cost is required' }]);
  }

  if (!validator.isFloat(totalCost, { min: 0 })) {
    throw new AppError('Hall rental total_cost must be a non-negative number', [
      { total_cost: 'total_cost must be a non-negative number' },
    ]);
  }

  throwValidationError('Hall rental', 'create', validateCreateHallRentalDto(body));

  return next();
}
