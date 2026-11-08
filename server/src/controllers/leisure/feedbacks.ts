import { NextFunction, Request, Response } from 'express';

import { FeedbackResponseDTO } from 'dtos/leisure/response/FeedbackResponseDTO';
import { FeedbackService } from 'services/leisure/FeedbackService';

import { notFoundError, toCrudError } from './crudErrors';

const RESOURCE = 'Feedback';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const feedbacks = await new FeedbackService().list();
    return res.customSuccess(
      200,
      'List of feedbacks.',
      feedbacks.map((feedback) => new FeedbackResponseDTO(feedback)),
    );
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const feedback = await new FeedbackService().show(id);
    if (!feedback) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} found.`, new FeedbackResponseDTO(feedback));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const feedback = await new FeedbackService().create(req.body);
    return res.customSuccess(201, `${RESOURCE} successfully created.`, new FeedbackResponseDTO(feedback));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'create'));
  }
};

export const edit = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const feedback = await new FeedbackService().update(id, req.body);
    if (!feedback) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully saved.`, new FeedbackResponseDTO(feedback));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'update'));
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const feedback = await new FeedbackService().remove(id);
    if (!feedback) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} successfully deleted.`, new FeedbackResponseDTO(feedback));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'delete'));
  }
};
