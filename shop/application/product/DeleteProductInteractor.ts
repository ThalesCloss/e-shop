import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { Product } from '@shop/domain/entities/Product';
import { DeleteProductUseCase } from '@shop/domain/useCases/product/DeleteProductUseCase';
import { ProductRepository } from './contracts/ProductRepository';

export class DeleteProductInteractor
  implements DeleteProductUseCase<Promise<DomainReturn<void>>>
{
  constructor(
    private readonly productRepository: ProductRepository<
      Promise<DomainReturn<Product.CompleteProductData>>
    >,
  ) {}

  async delete(ProductId: string): Promise<DomainReturn<void, DomainError>> {
    const productEntityId = EntityId.create(ProductId);
    if (productEntityId instanceof DomainError) return productEntityId;

    const deleted = await this.productRepository.delete(productEntityId);

    if (deleted instanceof DomainError) return deleted;
  }
}
