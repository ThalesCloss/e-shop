import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { Product } from '@shop/domain/entities/Product';
import { GetProductUseCase } from '@shop/domain/useCases/product/GetProductUseCase';
import { ProductRepository } from './contracts/ProductRepository';

export class GetProductInteractor
  implements GetProductUseCase<Promise<DomainReturn<Product>>>
{
  constructor(
    private readonly productRepository: ProductRepository<
      Promise<DomainReturn<Product.CompleteProductData>>
    >,
  ) {}

  async get(productId: string): Promise<DomainReturn<Product>> {
    const productEntityId = EntityId.create(productId);
    if (productEntityId instanceof DomainError) return productEntityId;

    const product = await this.productRepository.get(productEntityId);
    if (product instanceof DomainError) return product;

    const productEntity = Product.create(product, product.id);
    return productEntity;
  }
}
