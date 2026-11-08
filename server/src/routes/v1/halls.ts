import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/leisure/halls';
import { validatorCreateHall } from 'middleware/validation/leisure/hall/validatorCreateHall';
import { validatorUpdateHall } from 'middleware/validation/leisure/hall/validatorUpdateHall';
import { asyncHandler } from 'utils/asyncHandler';

const router = Router();

router.get('/', list);

router.get('/:id([0-9]+)', show);

router.post('/', asyncHandler(validatorCreateHall), create);

router.patch('/:id([0-9]+)', asyncHandler(validatorUpdateHall), edit);

router.delete('/:id([0-9]+)', destroy);

export default router;
