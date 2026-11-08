import { AppError } from 'errors/AppError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const throwValidationError = (
  resourceName: string,
  action: 'create' | 'update',
  errorsValidation: ErrorValidation[],
): void => {
  if (errorsValidation.length !== 0) {
    throw new AppError(`${resourceName} ${action} validation error`, errorsValidation);
  }
};
