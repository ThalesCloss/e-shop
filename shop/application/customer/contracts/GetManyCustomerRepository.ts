import { EntityId } from '@shop/domain/base/valueObjects/EntityId';

export interface GetManyCustomerRepository<R> {
  getMany(customerEntityId?: EntityId[]): R;
}
