import { NextFunction, Request, Response } from 'express';

import { ClientResponseDTO } from 'dtos/leisure/response/ClientResponseDTO';
import { ClientService } from 'services/leisure/ClientService';

import { notFoundError, toCrudError } from './crudErrors';

const RESOURCE = 'Client';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const clients = await new ClientService().list();
    return res.customSuccess(
      200,
      'List of clients.',
      clients.map((client) => new ClientResponseDTO(client)),
    );
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const client = await new ClientService().show(id);
    if (!client) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} found.`, new ClientResponseDTO(client));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const client = await new ClientService().create(req.body);
    return res.customSuccess(201, `${RESOURCE} successfully created.`, new ClientResponseDTO(client));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'create'));
  }
};

export const edit = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const client = await new ClientService().update(id, req.body);
    if (!client) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully saved.`, new ClientResponseDTO(client));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'update'));
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const client = await new ClientService().remove(id);
    if (!client) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully deleted.`, new ClientResponseDTO(client));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'delete'));
  }
};
