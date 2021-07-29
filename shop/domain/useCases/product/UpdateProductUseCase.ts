import { Product } from '@shop/domain/entities/Product';

export interface UpdateProductUseCase<R> {
  update(updateProductData: Product.ProductData, customerId: string): R;
}
