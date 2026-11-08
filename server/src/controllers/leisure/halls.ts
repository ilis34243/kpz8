import { NextFunction, Request, Response } from 'express';

import { HallResponseDTO } from 'dtos/leisure/response/HallResponseDTO';
import { HallService } from 'services/leisure/HallService';

import { notFoundError, toCrudError } from './crudErrors';

const RESOURCE = 'Hall';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const halls = await new HallService().list();
    return res.customSuccess(
      200,
      'List of halls.',
      halls.map((hall) => new HallResponseDTO(hall)),
    );
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const hall = await new HallService().show(id);
    if (!hall) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} found.`, new HallResponseDTO(hall));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const hall = await new HallService().create(req.body);
    return res.customSuccess(201, `${RESOURCE} successfully created.`, new HallResponseDTO(hall));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'create'));
  }
};

export const edit = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const hall = await new HallService().update(id, req.body);
    if (!hall) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully saved.`, new HallResponseDTO(hall));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'update'));
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const hall = await new HallService().remove(id);
    if (!hall) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully deleted.`, new HallResponseDTO(hall));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'delete'));
  }
};
