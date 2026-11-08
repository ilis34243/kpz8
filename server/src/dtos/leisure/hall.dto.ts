import { isPositiveInt, requireAtLeastOne, requireText } from 'dtos/leisure/helpers';
import { ErrorValidation } from 'utils/response/custom-error/types';

export interface CreateHallDto {
  name: string;
  capacity: number;
  description?: string;
}

export interface UpdateHallDto {
  name?: string;
  capacity?: number;
  description?: string;
}

const validateHall = (body: Record<string, unknown>, optional: boolean): ErrorValidation[] => {
  const errors: ErrorValidation[] = [];

  requireText(errors, 'name', body.name, 80, optional);

  if ((body.capacity !== undefined || !optional) && !isPositiveInt(body.capacity)) {
    errors.push({ capacity: 'capacity must be a positive integer' });
  }

  requireText(errors, 'description', body.description, 500, true);

  if (optional) {
    requireAtLeastOne(errors, body, ['name', 'capacity', 'description']);
  }

  return errors;
};

export const validateCreateHallDto = (body: Record<string, unknown>): ErrorValidation[] => validateHall(body, false);

export const validateUpdateHallDto = (body: Record<string, unknown>): ErrorValidation[] => validateHall(body, true);
