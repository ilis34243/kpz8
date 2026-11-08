import { getRepository, ObjectType } from 'typeorm';

export interface ForeignKeyDefinition {
  bodyField: string;
  relationName: string;
  entity: ObjectType<unknown>;
}

export interface CrudDefinition<T> {
  resourceName: string;
  entity: ObjectType<T>;
  relations: string[];
  scalarFields: string[];
  dateFields: string[];
  foreignKeys: ForeignKeyDefinition[];
}

export class UnknownForeignKeyError extends Error {
  public readonly bodyField: string;
  public readonly referencedId: unknown;

  constructor(bodyField: string, referencedId: unknown) {
    super(`There is no record with ${bodyField} = ${String(referencedId)}`);
    this.name = 'UnknownForeignKeyError';
    this.bodyField = bodyField;
    this.referencedId = referencedId;
  }
}

export class CrudService<T> {
  private readonly definition: CrudDefinition<T>;

  constructor(definition: CrudDefinition<T>) {
    this.definition = definition;
  }

  get resourceName(): string {
    return this.definition.resourceName;
  }

  private repository() {
    return getRepository(this.definition.entity);
  }

  async list(): Promise<T[]> {
    return this.repository().find({
      relations: this.definition.relations,
      order: { id: 'ASC' } as never,
    });
  }

  async show(id: string): Promise<T | undefined> {
    return this.repository().findOne(id, { relations: this.definition.relations });
  }

  async create(body: Record<string, unknown>): Promise<T> {
    await this.checkForeignKeys(body);

    const entity = new (this.definition.entity as unknown as new () => Record<string, unknown>)();
    this.assignFields(entity, body);

    const saved = (await this.repository().save(entity as any)) as unknown as T;
    return (await this.reload(saved)) ?? saved;
  }

  async update(id: string, body: Record<string, unknown>): Promise<T | undefined> {
    await this.checkForeignKeys(body);

    const entity = (await this.show(id)) as unknown as Record<string, unknown>;
    if (!entity) {
      return undefined;
    }
    this.assignFields(entity, body);

    const saved = (await this.repository().save(entity as any)) as unknown as T;
    return (await this.reload(saved)) ?? saved;
  }

  private async reload(entity: T): Promise<T | undefined> {
    const { id } = entity as unknown as { id: number };
    return this.show(String(id));
  }

  async remove(id: string): Promise<T | undefined> {
    const entity = await this.show(id);
    if (!entity) {
      return undefined;
    }
    await this.repository().remove(entity);
    return entity;
  }

  private assignFields(entity: Record<string, unknown>, body: Record<string, unknown>): void {
    this.definition.scalarFields.forEach((field) => {
      if (body[field] !== undefined) {
        entity[field] = body[field];
      }
    });

    this.definition.dateFields.forEach((field) => {
      if (body[field] !== undefined) {
        entity[field] = new Date(String(body[field]));
      }
    });

    this.definition.foreignKeys.forEach((foreignKey) => {
      if (body[foreignKey.bodyField] !== undefined) {
        entity[foreignKey.relationName] = { id: Number(body[foreignKey.bodyField]) };
      }
    });
  }

  private async checkForeignKeys(body: Record<string, unknown>): Promise<void> {
    for (const foreignKey of this.definition.foreignKeys) {
      const value = body[foreignKey.bodyField];
      if (value === undefined) {
        continue;
      }
      const referenced = await getRepository(foreignKey.entity).findOne(Number(value));
      if (!referenced) {
        throw new UnknownForeignKeyError(foreignKey.bodyField, value);
      }
    }
  }
}
