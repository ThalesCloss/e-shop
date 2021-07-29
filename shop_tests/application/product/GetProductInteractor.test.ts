import { ProductRepository } from '@shop/application/product/contracts/ProductRepository';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Product } from '@shop/domain/entities/Product';
import { mock, mockReset } from 'jest-mock-extended';
import { DomainError } from '@shop/domain/base/DomainError';
import { GetProductInteractor } from '@shop/application/product/GetProductInteractor';
import { v4 } from 'uuid';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
describe('Unit test for GetProduct Interactor', () => {
  const mockRepo =
    mock<
      ProductRepository<Promise<DomainReturn<Product.CompleteProductData>>>
    >();
  const getProduct = new GetProductInteractor(mockRepo);
  const validInputData: Product.ProductData = {
    color: 'test-color',
    name: 'test-name',
    price: 10,
    size: 'test-size',
  };
  const productId = v4();
  beforeEach(() => {
    mockReset(mockRepo);
  });

  it('should be return a DomainError on try get Product with invalid EntityId', () => {
    const created = getProduct.get('invalid-uuid');
    expect(created).resolves.toBeInstanceOf(DomainError);
    expect(mockRepo.get).not.toBeCalled();
  });

  it('should be get a Product and return ProductEntity', () => {
    const entityId = EntityId.create(productId);
    mockRepo.get.mockImplementation(async (productEntityId) => ({
      ...validInputData,
      id: productEntityId.value,
    }));
    const product = getProduct.get(productId);
    expect(product).resolves.toBeInstanceOf(Product);
    expect(mockRepo.get).toHaveBeenCalledWith(entityId);
    expect(mockRepo.get).toBeCalledTimes(1);
  });

  it('should be called repository and get a persistence layer error', () => {
    mockRepo.get.mockResolvedValue(new DomainError('Persistence layer error'));
    const error = getProduct.get(productId);
    expect(mockRepo.get).toBeCalledTimes(1);
    expect(error).resolves.toBeInstanceOf(DomainError);
  });
});
