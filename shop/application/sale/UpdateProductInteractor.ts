import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Currency } from '@shop/domain/base/valueObjects/Currency';
import { Product } from '@shop/domain/entities/Product';
import { GetProductUseCase } from '@shop/domain/useCases/product/GetProductUseCase';
import { UpdateProductUseCase } from '@shop/domain/useCases/product/UpdateProductUseCase';
import { ProductRepository } from '../product/contracts/ProductRepository';

export class UpdateProductInteractor
  implements UpdateProductUseCase<Promise<DomainReturn<void>>>
{
  constructor(
    private readonly productRepository: ProductRepository<
      Promise<DomainReturn<Product.CompleteProductData>>
    >,
    private readonly getProductUseCase: GetProductUseCase<
      Promise<DomainReturn<Product>>
    >,
  ) {}
  async update(
    updateProductData: Product.ProductData,
    productId: string,
  ): Promise<DomainReturn<void, DomainError>> {
    const product = await this.getProductUseCase.get(productId);
    if (product instanceof DomainError) return product;

    product.name = updateProductData.name ?? product.name;
    product.size = updateProductData.size ?? product.size;
    product.color = updateProductData.color ?? product.color;
    const price = updateProductData.price
      ? Currency.create(updateProductData.price)
      : undefined;
    if (price instanceof DomainError) return price;
    product.price = price ?? product.price;

    const updated = await this.productRepository.save(product);

    if (updated instanceof DomainError) return updated;
  }
}
