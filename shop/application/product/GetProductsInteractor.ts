import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { Product } from '@shop/domain/entities/Product';
import { GetProductsUseCase } from '@shop/domain/useCases/product/GetProductsUseCase';
import { GetProductsRepository } from './contracts/GetProductsRepository';

export class GetProductsInteractor
  implements GetProductsUseCase<Promise<DomainReturn<Product[]>>>
{
  constructor(
    private readonly productRepository: GetProductsRepository<
      Promise<DomainReturn<Product.CompleteProductData[]>>
    >,
  ) {}

  async get(productIds?: string[]): Promise<DomainReturn<Product[]>> {
    const productEntityIds: EntityId[] = [];
    if (productIds?.length) {
      const entityIds = productIds.map((productId) =>
        EntityId.create(productId),
      );
      const errors = entityIds.filter(
        (entity) => !(entity instanceof EntityId),
      );
      if (errors.length)
        return new DomainError(
          'Há produtos inválidos na solicitação',
          errors as DomainError[],
        );
      productEntityIds.push(...(entityIds as EntityId[]));
    }
    const products = await this.productRepository.get(productEntityIds);
    if (products instanceof DomainError) return products;

    const productEntities = products.map((product) =>
      Product.create(product, product.id),
    );
    const createErrors = productEntities.filter(
      (product) => !(product instanceof Product),
    );
    if (createErrors.length)
      return new DomainError(
        'Há produtos inválidos no retorno da consulta',
        createErrors as DomainError[],
      );
    return productEntities as Product[];
  }
}
