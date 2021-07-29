import { EntityId } from '@shop/domain/base/valueObjects/EntityId';

export interface GetProductsRepository<R> {
  get(productEntityIds?: EntityId[]): R;
}
