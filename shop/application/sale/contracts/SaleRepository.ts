import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { Sale } from '@shop/domain/entities/Sale';

export interface SaleRepository<R> {
  save(sale: Sale): R;
  delete(saleEntityId: EntityId): R;
  get(saleEntityId: EntityId): R;
}
