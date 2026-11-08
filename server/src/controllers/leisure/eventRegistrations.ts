import { NextFunction, Request, Response } from 'express';

import { EventRegistrationResponseDTO } from 'dtos/leisure/response/EventRegistrationResponseDTO';
import { EventRegistrationService } from 'services/leisure/EventRegistrationService';

import { notFoundError, toCrudError } from './crudErrors';

const RESOURCE = 'Event registration';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const registrations = await new EventRegistrationService().list();
    return res.customSuccess(
      200,
      'List of event registrations.',
      registrations.map((registration) => new EventRegistrationResponseDTO(registration)),
    );
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const registration = await new EventRegistrationService().show(id);
    if (!registration) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} found.`, new EventRegistrationResponseDTO(registration));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const registration = await new EventRegistrationService().create(req.body);
    return res.customSuccess(201, `${RESOURCE} successfully created.`, new EventRegistrationResponseDTO(registration));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'create'));
  }
};

export const edit = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const registration = await new EventRegistrationService().update(id, req.body);
    if (!registration) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully saved.`, new EventRegistrationResponseDTO(registration));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'update'));
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const registration = await new EventRegistrationService().remove(id);
    if (!registration) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully deleted.`, new EventRegistrationResponseDTO(registration));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'delete'));
  }
};
