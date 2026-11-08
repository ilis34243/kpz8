import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/leisure/clients';
import { validatorCreateClient } from 'middleware/validation/leisure/client/validatorCreateClient';
import { validatorUpdateClient } from 'middleware/validation/leisure/client/validatorUpdateClient';
import { asyncHandler } from 'utils/asyncHandler';

const router = Router();

router.get('/', list);

router.get('/:id([0-9]+)', show);

router.post('/', asyncHandler(validatorCreateClient), create);

router.patch('/:id([0-9]+)', asyncHandler(validatorUpdateClient), edit);

router.delete('/:id([0-9]+)', destroy);

export default router;
