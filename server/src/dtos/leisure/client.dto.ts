import validator from 'validator';

import { requireAtLeastOne, requireText } from 'dtos/leisure/helpers';
import { ErrorValidation } from 'utils/response/custom-error/types';

export interface CreateClientDto {
  full_name: string;
  email: string;
  phone: string;
}

export interface UpdateClientDto {
  full_name?: string;
  email?: string;
  phone?: string;
}

const validateClient = (body: Record<string, unknown>, optional: boolean): ErrorValidation[] => {
  const errors: ErrorValidation[] = [];

  requireText(errors, 'full_name', body.full_name, 80, optional);
  requireText(errors, 'phone', body.phone, 20, optional);

  if (body.phone !== undefined && !validator.matches(String(body.phone), /^\+?[\d\s-]{6,20}$/)) {
    errors.push({ phone: 'phone must contain digits, optional leading + and spaces' });
  }

  if (body.email !== undefined && !validator.isEmail(String(body.email))) {
    errors.push({ email: 'Email is invalid' });
  }

  if (optional) {
    requireAtLeastOne(errors, body, ['full_name', 'email', 'phone']);
  }

  return errors;
};

export const validateCreateClientDto = (body: Record<string, unknown>): ErrorValidation[] =>
  validateClient(body, false);

export const validateUpdateClientDto = (body: Record<string, unknown>): ErrorValidation[] => validateClient(body, true);
