import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { Customer } from '@shop/domain/entities/Customer';

export interface CustomerRepository<R> {
  save(customer: Customer): R;
  delete(customerEntityId: EntityId): R;
  get(customerEntityId: EntityId): R;
}
