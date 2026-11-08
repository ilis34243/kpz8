import { Client } from 'orm/entities/leisure/Client';
import { Event } from 'orm/entities/leisure/Event';
import { Feedback } from 'orm/entities/leisure/Feedback';

import { CrudDefinition, CrudService } from './CrudService';

const definition: CrudDefinition<Feedback> = {
  resourceName: 'Feedback',
  entity: Feedback,
  relations: ['client', 'event', 'event.hall'],
  scalarFields: ['rating', 'comment'],
  dateFields: [],
  foreignKeys: [
    { bodyField: 'client_id', relationName: 'client', entity: Client },
    { bodyField: 'event_id', relationName: 'event', entity: Event },
  ],
};

export class FeedbackService extends CrudService<Feedback> {
  constructor() {
    super(definition);
  }
}
