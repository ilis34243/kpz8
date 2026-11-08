import { Hall } from 'orm/entities/leisure/Hall';

import { CrudDefinition, CrudService } from './CrudService';

const definition: CrudDefinition<Hall> = {
  resourceName: 'Hall',
  entity: Hall,
  relations: ['events'],
  scalarFields: ['name', 'capacity', 'description'],
  dateFields: [],
  foreignKeys: [],
};

export class HallService extends CrudService<Hall> {
  constructor() {
    super(definition);
  }
}
