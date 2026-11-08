import { ErrorValidation } from 'utils/response/custom-error/types';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorsValidation: ErrorValidation[];

  constructor(message: string, errorsValidation: ErrorValidation[] = [], statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorsValidation = errorsValidation;
  }
}
