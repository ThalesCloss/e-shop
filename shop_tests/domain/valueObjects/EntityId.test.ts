import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { DomainError } from '@shop/domain/base/DomainError';
import { v4 } from 'uuid';
describe('Unit test for valueObject EntityId', () => {
  it('should be return a new EntityId when input is empty', () => {
    const entityId = EntityId.create();
    expect(entityId).toBeInstanceOf(EntityId);
    expect((entityId as EntityId).value).not.toHaveLength(0);
  });

  it('should be return a DomainError when input is a invalid entityId', () => {
    const entityId = EntityId.create('invalid');
    expect(entityId).toBeInstanceOf(DomainError);
  });

  it('should be return a DomainError when input is a valid entityId', () => {
    const inputEntityId = v4();
    const entityId = EntityId.create(inputEntityId);
    expect(entityId).toBeInstanceOf(EntityId);
    expect((entityId as EntityId).value).toEqual(inputEntityId);
  });

  it('should be return true when comparing identical entityIds', () => {
    const inputEntityId1 = v4();
    const entityId1 = EntityId.create(inputEntityId1);
    const entityId2 = EntityId.create(inputEntityId1);
    expect((entityId1 as EntityId).equals(entityId2 as EntityId)).toBeTruthy();
  });

  it('should be return true when comparing different entityIds', () => {
    const inputEntityId1 = v4();
    const entityId1 = EntityId.create(inputEntityId1);
    const inputEntityId2 = v4();
    const entityId2 = EntityId.create(inputEntityId2);
    expect((entityId1 as EntityId).equals(entityId2 as EntityId)).toBeFalsy();
  });
});
