import { isPositiveInt, requireAtLeastOne, requireForeignId } from 'dtos/leisure/helpers';
import { ErrorValidation } from 'utils/response/custom-error/types';

export interface CreateEventRegistrationDto {
  event_id: number;
  client_id: number;
  seats?: number;
}

export interface UpdateEventRegistrationDto {
  event_id?: number;
  client_id?: number;
  seats?: number;
}

const validateEventRegistration = (body: Record<string, unknown>, optional: boolean): ErrorValidation[] => {
  const errors: ErrorValidation[] = [];

  requireForeignId(errors, 'event_id', body.event_id, optional);
  requireForeignId(errors, 'client_id', body.client_id, optional);

  if (body.seats !== undefined && !isPositiveInt(body.seats)) {
    errors.push({ seats: 'seats must be a positive integer' });
  }

  if (optional) {
    requireAtLeastOne(errors, body, ['event_id', 'client_id', 'seats']);
  }

  return errors;
};

export const validateCreateEventRegistrationDto = (body: Record<string, unknown>): ErrorValidation[] =>
  validateEventRegistration(body, false);

export const validateUpdateEventRegistrationDto = (body: Record<string, unknown>): ErrorValidation[] =>
  validateEventRegistration(body, true);
