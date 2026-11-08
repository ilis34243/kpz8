import { Router } from 'express';

import auth from './auth';
import clients from './clients';
import eventRegistrations from './eventRegistrations';
import events from './events';
import feedbacks from './feedbacks';
import hallRentals from './hallRentals';
import halls from './halls';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);

router.use('/halls', halls);
router.use('/clients', clients);
router.use('/events', events);
router.use('/event-registrations', eventRegistrations);
router.use('/hall-rentals', hallRentals);
router.use('/feedbacks', feedbacks);

export default router;
