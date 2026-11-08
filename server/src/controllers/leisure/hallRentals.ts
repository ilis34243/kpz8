import { NextFunction, Request, Response } from 'express';

import { HallRentalResponseDTO } from 'dtos/leisure/response/HallRentalResponseDTO';
import { HallRentalService } from 'services/leisure/HallRentalService';

import { notFoundError, toCrudError } from './crudErrors';

const RESOURCE = 'Hall rental';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const rentals = await new HallRentalService().list();
    return res.customSuccess(
      200,
      'List of hall rentals.',
      rentals.map((rental) => new HallRentalResponseDTO(rental)),
    );
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const rental = await new HallRentalService().show(id);
    if (!rental) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} found.`, new HallRentalResponseDTO(rental));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const rental = await new HallRentalService().create(req.body);
    return res.customSuccess(201, `${RESOURCE} successfully created.`, new HallRentalResponseDTO(rental));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'create'));
  }
};

export const edit = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const rental = await new HallRentalService().update(id, req.body);
    if (!rental) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully saved.`, new HallRentalResponseDTO(rental));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'update'));
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const rental = await new HallRentalService().remove(id);
    if (!rental) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully deleted.`, new HallRentalResponseDTO(rental));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'delete'));
  }
};
