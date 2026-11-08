import validator from 'validator';

import { ErrorValidation } from 'utils/response/custom-error/types';

export const isPositiveInt = (value: unknown): boolean => validator.isInt(String(value), { gt: 0 });

export const isParsableDate = (value: unknown): boolean => validator.isISO8601(String(value));

export const isNonNegativeNumber = (value: unknown): boolean =>
  validator.isFloat(String(value), { min: 0 }) && validator.matches(String(value), /^\d+(\.\d{1,2})?$/);

export const requireText = (
  errors: ErrorValidation[],
  field: string,
  value: unknown,
  maxLength: number,
  optional: boolean,
): void => {
  const text = value === undefined || value === null ? '' : String(value).trim();

  if (validator.isEmpty(text)) {
    if (!optional) {
      errors.push({ [field]: `${field} is required` });
    }
    return;
  }

  if (!validator.isLength(text, { max: maxLength })) {
    errors.push({ [field]: `${field} must be shorter than ${maxLength} characters` });
  }
};

export const requireForeignId = (errors: ErrorValidation[], field: string, value: unknown, optional: boolean): void => {
  if (value === undefined && optional) {
    return;
  }
  if (!isPositiveInt(value)) {
    errors.push({ [field]: `${field} must be an existing ${field.replace('_id', '')} id` });
  }
};

export const requireDate = (errors: ErrorValidation[], field: string, value: unknown, optional: boolean): void => {
  if (value === undefined && optional) {
    return;
  }
  if (!isParsableDate(value)) {
    errors.push({ [field]: `${field} must be a valid ISO 8601 date` });
  }
};

export const requireEnum = (errors: ErrorValidation[], field: string, value: unknown, allowed: string[]): void => {
  if (value === undefined) {
    return;
  }
  if (!validator.isIn(String(value), allowed)) {
    errors.push({ [field]: `${field} must be one of ${allowed.join(', ')}` });
  }
};

export const requireChronology = (errors: ErrorValidation[], start: unknown, end: unknown): void => {
  if (!isParsableDate(start) || !isParsableDate(end)) {
    return;
  }
  if (Date.parse(String(start)) >= Date.parse(String(end))) {
    errors.push({ end_datetime: 'end_datetime must be after start_datetime' });
  }
};

export const requireAtLeastOne = (errors: ErrorValidation[], body: Record<string, unknown>, fields: string[]): void => {
  const provided = fields.filter((field) => body[field] !== undefined);
  if (provided.length === 0) {
    errors.push({ body: `at least one of [${fields.join(', ')}] must be provided` });
  }
};
