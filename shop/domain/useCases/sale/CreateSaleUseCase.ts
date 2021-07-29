import { Sale } from '@shop/domain/entities/Sale';

export interface CreateSaleUseCase<R> {
  create(createSaleData: CreateSaleUseCase.CreateSaleData): R;
}

export namespace CreateSaleUseCase {
  export interface CreateSaleData extends Omit<Sale.SaleData, 'products'> {
    products: ProductSale[];
  }
  export interface ProductSale {
    productId: string;
    quantity: number;
  }
}
