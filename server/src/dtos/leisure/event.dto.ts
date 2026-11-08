import {
  requireAtLeastOne,
  requireChronology,
  requireDate,
  requireEnum,
  requireForeignId,
  requireText,
} from 'dtos/leisure/helpers';
import { EventType } from 'orm/entities/leisure/types';
import { ErrorValidation } from 'utils/response/custom-error/types';

const EVENT_TYPES: string[] = ['MASTER_CLASS', 'CONCERT', 'EXHIBITION', 'TOURNAMENT', 'LESSON'];

export interface CreateEventDto {
  name: string;
  type: EventType;
  start_datetime: string;
  end_datetime: string;
  hall_id: number;
}

export interface UpdateEventDto {
  name?: string;
  type?: EventType;
  start_datetime?: string;
  end_datetime?: string;
  hall_id?: number;
}

const validateEvent = (body: Record<string, unknown>, optional: boolean): ErrorValidation[] => {
  const errors: ErrorValidation[] = [];

  requireText(errors, 'name', body.name, 120, optional);
  requireForeignId(errors, 'hall_id', body.hall_id, optional);
  requireDate(errors, 'start_datetime', body.start_datetime, optional);
  requireDate(errors, 'end_datetime', body.end_datetime, optional);
  requireChronology(errors, body.start_datetime, body.end_datetime);

  requireEnum(errors, 'type', body.type, EVENT_TYPES);

  if (optional) {
    requireAtLeastOne(errors, body, ['name', 'type', 'start_datetime', 'end_datetime', 'hall_id']);
  }

  return errors;
};

export const validateCreateEventDto = (body: Record<string, unknown>): ErrorValidation[] => validateEvent(body, false);

export const validateUpdateEventDto = (body: Record<string, unknown>): ErrorValidation[] => validateEvent(body, true);
