import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { Product } from '@shop/domain/entities/Product';

export interface ProductRepository<R> {
  save(product: Product): R;
  delete(productEntityId: EntityId): R;
  get(productEntityId: EntityId): R;
  getProducts<T>(productEntityIds?: EntityId[]): T;
}
