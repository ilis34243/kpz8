import validator from 'validator';

import { requireAtLeastOne, requireForeignId, requireText } from 'dtos/leisure/helpers';
import { ErrorValidation } from 'utils/response/custom-error/types';

export interface CreateFeedbackDto {
  client_id: number;
  event_id: number;
  rating: number;
  comment?: string;
}

export interface UpdateFeedbackDto {
  client_id?: number;
  event_id?: number;
  rating?: number;
  comment?: string;
}

const validateFeedback = (body: Record<string, unknown>, optional: boolean): ErrorValidation[] => {
  const errors: ErrorValidation[] = [];

  requireForeignId(errors, 'client_id', body.client_id, optional);
  requireForeignId(errors, 'event_id', body.event_id, optional);
  requireText(errors, 'comment', body.comment, 500, true);

  if (body.rating === undefined) {
    if (!optional) {
      errors.push({ rating: 'rating is required' });
    }
  } else if (!validator.isInt(String(body.rating), { gt: 0, lt: 6 })) {
    errors.push({ rating: 'rating must be an integer between 1 and 5' });
  }

  if (optional) {
    requireAtLeastOne(errors, body, ['client_id', 'event_id', 'rating', 'comment']);
  }

  return errors;
};

export const validateCreateFeedbackDto = (body: Record<string, unknown>): ErrorValidation[] =>
  validateFeedback(body, false);

export const validateUpdateFeedbackDto = (body: Record<string, unknown>): ErrorValidation[] =>
  validateFeedback(body, true);
