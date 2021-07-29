import { CreateProductInteractor } from '@shop/application/product/CreateProductInteractor';
import { ProductRepository } from '@shop/application/product/contracts/ProductRepository';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Product } from '@shop/domain/entities/Product';
import { mock, mockReset } from 'jest-mock-extended';
import { DomainError } from '@shop/domain/base/DomainError';
describe('Unit test for CreateProduct Interactor', () => {
  const mockRepo =
    mock<
      ProductRepository<Promise<DomainReturn<Product.CompleteProductData>>>
    >();
  const createProduct = new CreateProductInteractor(mockRepo);
  const validInputData: Product.ProductData = {
    color: 'test-color',
    name: 'test-name',
    price: 10,
    size: 'test-size',
  };
  beforeEach(() => {
    mockReset(mockRepo);
  });

  it('a domain error should be returned when trying to create a product with invalid data and cannot call save', () => {
    const created = createProduct.create({
      ...validInputData,
      price: -10,
    });
    expect(created).resolves.toBeInstanceOf(DomainError);
    expect(mockRepo.save).not.toBeCalled();
  });

  it('should be create new Product and return ProductCompleteData', () => {
    mockRepo.save.mockImplementation(async (product) => ({
      color: product.color,
      id: product.id.value,
      name: product.name,
      price: product.price.value,
      size: product.size,
    }));
    const created = createProduct.create(validInputData);
    expect(mockRepo.save).toBeCalledTimes(1);
    expect(created).resolves.not.toBeInstanceOf(DomainError);
    expect(created).resolves.toHaveProperty('id');
  });

  // it('should be called repository and get a persistence layer error', () => {
  //   mockRepo.save.mockResolvedValue(new DomainError('Persistence layer error'));
  //   const error = createProduct.create(validInputData);
  //   expect(mockRepo.save).toBeCalledTimes(1);
  //   expect(error).resolves.toBeInstanceOf(DomainError);
  // });
});
