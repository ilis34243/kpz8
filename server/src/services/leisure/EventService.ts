import { Event } from 'orm/entities/leisure/Event';
import { Hall } from 'orm/entities/leisure/Hall';

import { CrudDefinition, CrudService } from './CrudService';

const definition: CrudDefinition<Event> = {
  resourceName: 'Event',
  entity: Event,
  relations: ['hall', 'registrations', 'registrations.client', 'feedbacks'],
  scalarFields: ['name', 'type'],
  dateFields: ['start_datetime', 'end_datetime'],
  foreignKeys: [{ bodyField: 'hall_id', relationName: 'hall', entity: Hall }],
};

export class EventService extends CrudService<Event> {
  constructor() {
    super(definition);
  }
}
