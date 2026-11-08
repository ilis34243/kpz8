import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/leisure/events';
import { validatorCreateEvent } from 'middleware/validation/leisure/event/validatorCreateEvent';
import { validatorUpdateEvent } from 'middleware/validation/leisure/event/validatorUpdateEvent';
import { asyncHandler } from 'utils/asyncHandler';

const router = Router();

router.get('/', list);

router.get('/:id([0-9]+)', show);

router.post('/', asyncHandler(validatorCreateEvent), create);

router.patch('/:id([0-9]+)', asyncHandler(validatorUpdateEvent), edit);

router.delete('/:id([0-9]+)', destroy);

export default router;
