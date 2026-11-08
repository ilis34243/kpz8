import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/leisure/hallRentals';
import { validatorCreateHallRental } from 'middleware/validation/leisure/hallRental/validatorCreateHallRental';
import { validatorUpdateHallRental } from 'middleware/validation/leisure/hallRental/validatorUpdateHallRental';
import { asyncHandler } from 'utils/asyncHandler';

const router = Router();

router.get('/', list);

router.get('/:id([0-9]+)', show);

router.post('/', asyncHandler(validatorCreateHallRental), create);

router.patch('/:id([0-9]+)', asyncHandler(validatorUpdateHallRental), edit);

router.delete('/:id([0-9]+)', destroy);

export default router;
