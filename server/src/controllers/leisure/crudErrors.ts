import { UnknownForeignKeyError } from 'services/leisure/CrudService';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const toCrudError = (err: any, resourceName: string, action: string): CustomError => {
  if (err instanceof UnknownForeignKeyError) {
    const errorsValidation: ErrorValidation[] = [{ [err.bodyField]: err.message }];
    return new CustomError(400, 'Validation', err.message, null, null, errorsValidation);
  }

  if (err.code === '23505') {
    return new CustomError(
      409,
      'Validation',
      `Can't ${action} ${resourceName}: a record with the same unique value already exists.`,
      null,
      err,
    );
  }

  if (err.code === '23503') {
    return new CustomError(
      409,
      'Validation',
      `Can't ${action} ${resourceName}: other records still reference it.`,
      null,
      err,
    );
  }

  return new CustomError(400, 'Raw', `Can't ${action} ${resourceName}.`, null, err);
};

export const notFoundError = (resourceName: string, id: string): CustomError =>
  new CustomError(404, 'General', `${resourceName} with id:${id} not found.`, [`${resourceName} not found.`]);
