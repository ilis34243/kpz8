import {
  isNonNegativeNumber,
  requireAtLeastOne,
  requireChronology,
  requireDate,
  requireEnum,
  requireForeignId,
} from 'dtos/leisure/helpers';
import { RentalStatus } from 'orm/entities/leisure/types';
import { ErrorValidation } from 'utils/response/custom-error/types';

const RENTAL_STATUSES: string[] = ['RESERVED', 'CONFIRMED', 'COMPLETED', 'CANCELED'];

export interface CreateHallRentalDto {
  hall_id: number;
  client_id: number;
  start_datetime: string;
  end_datetime: string;
  total_cost: number;
  status?: RentalStatus;
}

export interface UpdateHallRentalDto {
  hall_id?: number;
  client_id?: number;
  start_datetime?: string;
  end_datetime?: string;
  total_cost?: number;
  status?: RentalStatus;
}

const validateHallRental = (body: Record<string, unknown>, optional: boolean): ErrorValidation[] => {
  const errors: ErrorValidation[] = [];

  requireForeignId(errors, 'hall_id', body.hall_id, optional);
  requireForeignId(errors, 'client_id', body.client_id, optional);
  requireDate(errors, 'start_datetime', body.start_datetime, optional);
  requireDate(errors, 'end_datetime', body.end_datetime, optional);
  requireChronology(errors, body.start_datetime, body.end_datetime);

  if (body.total_cost === undefined) {
    if (!optional) {
      errors.push({ total_cost: 'total_cost is required' });
    }
  } else if (!isNonNegativeNumber(body.total_cost)) {
    errors.push({ total_cost: 'total_cost must be a number with up to two decimals' });
  }

  requireEnum(errors, 'status', body.status, RENTAL_STATUSES);

  if (optional) {
    requireAtLeastOne(errors, body, ['hall_id', 'client_id', 'start_datetime', 'end_datetime', 'total_cost', 'status']);
  }

  return errors;
};

export const validateCreateHallRentalDto = (body: Record<string, unknown>): ErrorValidation[] =>
  validateHallRental(body, false);

export const validateUpdateHallRentalDto = (body: Record<string, unknown>): ErrorValidation[] =>
  validateHallRental(body, true);
