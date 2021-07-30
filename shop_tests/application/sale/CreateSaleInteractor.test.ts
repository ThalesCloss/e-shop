import { CreateSaleInteractor } from '@shop/application/sale/CreateSaleInteractor';
import { SaleRepository } from '@shop/application/sale/contracts/SaleRepository';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Sale } from '@shop/domain/entities/Sale';
import { mock, mockReset } from 'jest-mock-extended';
import { DomainError } from '@shop/domain/base/DomainError';
import { GetProductsUseCase } from '@shop/domain/useCases/product/GetProductsUseCase';
import { Product } from '@shop/domain/entities/Product';
import { v4 } from 'uuid';
import { CreateSaleUseCase } from '@shop/domain/useCases/sale/CreateSaleUseCase';
describe('Unit test for CreateSale Interactor', () => {
  const mockRepo =
    mock<SaleRepository<Promise<DomainReturn<Sale.CompleteSaleData>>>>();
  const mockGetProducts = mock<GetProductsUseCase<Promise<Product[]>>>();
  const createSale = new CreateSaleInteractor(mockRepo, mockGetProducts);
  const productId = v4();
  const validInputData: CreateSaleUseCase.CreateSaleData = {
    createdAt: new Date(),
    customerId: v4(),
    observations: 'test',
    payment: 'CARD',
    products: [
      {
        productId,
        quantity: 1,
      },
    ],
  };
  beforeEach(() => {
    mockReset(mockRepo);
    mockReset(mockGetProducts);
  });

  it('should be create new sale', () => {
    mockGetProducts.get.mockResolvedValue([
      Product.create(
        {
          name: 'product name',
          color: 'color name',
          size: 'product size',
          price: 10,
        },
        productId,
      ) as Product,
    ]);
    mockRepo.save.mockImplementation((sale) =>
      Promise.resolve({
        createdAt: sale.createdAt,
        customerId: sale.customerId.value,
        observations: sale.observations,
        payment: sale.payment,
        id: sale.id.value,
        products: [
          {
            quantity: 1,
            unit_price: 10,
            productId: productId,
            name: 'product name',
          },
        ],
      }),
    );
    const sale = createSale.create(validInputData);
    expect(mockGetProducts.get).toBeCalledTimes(1);
    expect(sale).resolves.not.toBeInstanceOf(DomainError);
    expect(mockGetProducts.get).toBeCalledWith([productId]);
  });

  it('should be return a DomainError when missing Product', () => {
    mockGetProducts.get.mockResolvedValue([]);
    const sale = createSale.create(validInputData);
    expect(mockGetProducts.get).toBeCalledWith([productId]);
    expect(mockGetProducts.get).toBeCalledTimes(1);
    expect(sale).resolves.toBeInstanceOf(DomainError);
    expect(mockRepo.save).not.toBeCalled();
  });
});
