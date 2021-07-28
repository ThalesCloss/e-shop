import { v4 as uuidV4, validate } from 'uuid';
import { DomainError } from '../DomainError';
import { DomainReturn } from '../DomainReturn';
import { ValueObject } from '../ValueObject';

export class EntityId extends ValueObject<string> {
  public static create(id?: string): DomainReturn<EntityId> {
    if (id?.trim()?.length && !validate(id))
      return new DomainError(`Identificador de entidade inválido ${id}`);
    if (id?.length) return new EntityId(id);
    return new EntityId(uuidV4({}));
  }

  constructor(id: string) {
    super(id);
  }
}
