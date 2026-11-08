import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/leisure/feedbacks';
import { validatorCreateFeedback } from 'middleware/validation/leisure/feedback/validatorCreateFeedback';
import { validatorUpdateFeedback } from 'middleware/validation/leisure/feedback/validatorUpdateFeedback';
import { asyncHandler } from 'utils/asyncHandler';

const router = Router();

router.get('/', list);

router.get('/:id([0-9]+)', show);

router.post('/', asyncHandler(validatorCreateFeedback), create);

router.patch('/:id([0-9]+)', asyncHandler(validatorUpdateFeedback), edit);

router.delete('/:id([0-9]+)', destroy);

export default router;
