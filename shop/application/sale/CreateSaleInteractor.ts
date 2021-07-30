import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Product } from '@shop/domain/entities/Product';
import { Sale } from '@shop/domain/entities/Sale';
import { GetProductsUseCase } from '@shop/domain/useCases/product/GetProductsUseCase';
import { CreateSaleUseCase } from '@shop/domain/useCases/sale/CreateSaleUseCase';
import { SaleRepository } from './contracts/SaleRepository';

export class CreateSaleInteractor
  implements CreateSaleUseCase<Promise<DomainReturn<Sale.CompleteSaleData>>>
{
  constructor(
    private readonly saleRepository: SaleRepository<
      Promise<DomainReturn<Sale.CompleteSaleData>>
    >,
    private readonly getProductsUseCase: GetProductsUseCase<Promise<Product[]>>,
  ) {}
  async create(
    saleData: CreateSaleUseCase.CreateSaleData,
  ): Promise<DomainReturn<Sale.CompleteSaleData>> {
    const sale = Sale.create(saleData);
    if (sale instanceof DomainError) return sale;

    const mapProductQuantity: Map<string, number> = new Map(
      saleData.products.map((product) => [product.productId, product.quantity]),
    );
    const products = await this.getProductsUseCase.get(
      Array.from(mapProductQuantity.keys()),
    );

    if (products instanceof DomainError) return products;
    if (products.length !== mapProductQuantity.size) {
      const inputProduct = Array.from(mapProductQuantity.keys());
      const productIds = products.map((product) => product.id.value);
      const unavailable = inputProduct.filter(
        (inputId) => !productIds.includes(inputId),
      );
      return new DomainError(
        'Os seguintes produtos não estão disponiveis',
        unavailable.map((id) => new DomainError(id)),
      );
    }
    products.forEach((product) => {
      sale.addProduct(product, mapProductQuantity.get(product.id.value));
    });
    console.log('salvando');
    const saleSaved = await this.saleRepository.save(sale);
    console.log('salvou');

    return saleSaved;
  }
}
