import { Product } from '@shop/domain/entities/Product';

export interface CreateProductUseCase<R> {
  create(productData: Product.ProductData): R;
}
