import { Client } from 'orm/entities/leisure/Client';
import { Hall } from 'orm/entities/leisure/Hall';
import { HallRental } from 'orm/entities/leisure/HallRental';

import { CrudDefinition, CrudService } from './CrudService';

const definition: CrudDefinition<HallRental> = {
  resourceName: 'Hall rental',
  entity: HallRental,
  relations: ['hall', 'client'],
  scalarFields: ['total_cost', 'status'],
  dateFields: ['start_datetime', 'end_datetime'],
  foreignKeys: [
    { bodyField: 'hall_id', relationName: 'hall', entity: Hall },
    { bodyField: 'client_id', relationName: 'client', entity: Client },
  ],
};

export class HallRentalService extends CrudService<HallRental> {
  constructor() {
    super(definition);
  }
}
