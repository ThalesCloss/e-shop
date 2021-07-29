import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Product } from '@shop/domain/entities/Product';
import { CreateProductUseCase } from '@shop/domain/useCases/product/CreateProductUseCase';
import { ProductRepository } from './contracts/ProductRepository';

export class CreateProductInteractor
  implements
    CreateProductUseCase<Promise<DomainReturn<Product.CompleteProductData>>>
{
  constructor(
    private readonly ProductRepository: ProductRepository<
      Promise<DomainReturn<Product.CompleteProductData>>
    >,
  ) {}
  async create(
    productData: Product.ProductData,
  ): Promise<DomainReturn<Product.CompleteProductData>> {
    const product = Product.create(productData);
    if (product instanceof DomainError) return product;

    const productSaved = await this.ProductRepository.save(product);
    return productSaved;
  }
}
