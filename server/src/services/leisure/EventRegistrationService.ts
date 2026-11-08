import { Client } from 'orm/entities/leisure/Client';
import { Event } from 'orm/entities/leisure/Event';
import { EventRegistration } from 'orm/entities/leisure/EventRegistration';

import { CrudDefinition, CrudService } from './CrudService';

const definition: CrudDefinition<EventRegistration> = {
  resourceName: 'Event registration',
  entity: EventRegistration,
  relations: ['event', 'event.hall', 'client'],
  scalarFields: ['seats'],
  dateFields: [],
  foreignKeys: [
    { bodyField: 'event_id', relationName: 'event', entity: Event },
    { bodyField: 'client_id', relationName: 'client', entity: Client },
  ],
};

export class EventRegistrationService extends CrudService<EventRegistration> {
  constructor() {
    super(definition);
  }
}
