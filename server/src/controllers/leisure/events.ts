import { NextFunction, Request, Response } from 'express';

import { EventResponseDTO } from 'dtos/leisure/response/EventResponseDTO';
import { EventService } from 'services/leisure/EventService';

import { notFoundError, toCrudError } from './crudErrors';

const RESOURCE = 'Event';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const events = await new EventService().list();
    return res.customSuccess(
      200,
      'List of events.',
      events.map((event) => new EventResponseDTO(event)),
    );
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const event = await new EventService().show(id);
    if (!event) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} found.`, new EventResponseDTO(event));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const event = await new EventService().create(req.body);
    return res.customSuccess(201, `${RESOURCE} successfully created.`, new EventResponseDTO(event));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'create'));
  }
};

export const edit = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const event = await new EventService().update(id, req.body);
    if (!event) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully saved.`, new EventResponseDTO(event));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'update'));
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const event = await new EventService().remove(id);
    if (!event) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully deleted.`, new EventResponseDTO(event));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'delete'));
  }
};
