import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/leisure/eventRegistrations';
import { validatorCreateEventRegistration } from 'middleware/validation/leisure/eventRegistration/validatorCreateEventRegistration';
import { validatorUpdateEventRegistration } from 'middleware/validation/leisure/eventRegistration/validatorUpdateEventRegistration';
import { asyncHandler } from 'utils/asyncHandler';

const router = Router();

router.get('/', list);

router.get('/:id([0-9]+)', show);

router.post('/', asyncHandler(validatorCreateEventRegistration), create);

router.patch('/:id([0-9]+)', asyncHandler(validatorUpdateEventRegistration), edit);

router.delete('/:id([0-9]+)', destroy);

export default router;
