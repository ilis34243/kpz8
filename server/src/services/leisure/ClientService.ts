import { Client } from 'orm/entities/leisure/Client';

import { CrudDefinition, CrudService } from './CrudService';

const definition: CrudDefinition<Client> = {
  resourceName: 'Client',
  entity: Client,
  relations: ['rentals'],
  scalarFields: ['full_name', 'email', 'phone'],
  dateFields: [],
  foreignKeys: [],
};

export class ClientService extends CrudService<Client> {
  constructor() {
    super(definition);
  }
}
