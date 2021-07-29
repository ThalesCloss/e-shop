import { ProductRepository } from '@shop/application/product/contracts/ProductRepository';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Product } from '@shop/domain/entities/Product';
import { mock, mockReset } from 'jest-mock-extended';
import { DomainError } from '@shop/domain/base/DomainError';
import { UpdateProductInteractor } from '@shop/application/product/UpdateProductInteractor';
import { GetProductUseCase } from '@shop/domain/useCases/product/GetProductUseCase';
import { v4 } from 'uuid';
describe('Unit test for UpdateProduct Interactor', () => {
  const mockRepo =
    mock<
      ProductRepository<Promise<DomainReturn<Product.CompleteProductData>>>
    >();

  const mockGetUseCase =
    mock<GetProductUseCase<Promise<DomainReturn<Product>>>>();

  const updateProduct = new UpdateProductInteractor(mockRepo, mockGetUseCase);
  const validInputData: Product.ProductData = {
    color: 'test-color',
    name: 'test-name',
    price: 10,
    size: 'test-size',
  };
  const productId = v4();
  beforeEach(() => {
    mockReset(mockRepo);
    mockReset(mockGetUseCase);
  });

  it('should be return a DomainError on try update invalid ProductEntityId', () => {
    mockGetUseCase.get.mockResolvedValue(new DomainError('invalid entity id'));

    const updated = updateProduct.update(validInputData, 'invalid-Product-id');

    expect(updated).resolves.toBeInstanceOf(DomainError);
    expect(mockGetUseCase.get).toBeCalledWith('invalid-Product-id');
    expect(mockGetUseCase.get).toBeCalledTimes(1);
    expect(mockRepo.save).not.toBeCalled();
  });

  it('should be return a DomainError on try update Product with invalid data', () => {
    const invalidInputData: Product.ProductData = {
      ...validInputData,
      price: -10,
    };
    mockGetUseCase.get.mockImplementation(async (productId) =>
      Product.create(validInputData, productId),
    );

    const updated = updateProduct.update(invalidInputData, productId);
    expect(mockGetUseCase.get).toBeCalledWith(productId);
    expect(mockGetUseCase.get).toBeCalledTimes(1);
    expect(updated).resolves.toBeInstanceOf(DomainError);
    expect(mockRepo.save).not.toBeCalled();
  });

  it('should be update a valid Product with valid data', () => {
    const product = Product.create(validInputData, productId) as Product;
    mockGetUseCase.get.mockResolvedValue(product);
    mockRepo.save.mockImplementation(async (product) => ({
      color: product.color,
      id: product.id.value,
      name: product.name,
      price: product.price.value,
      size: product.size,
    }));

    const updated = updateProduct.update(validInputData, productId);
    expect(updated).resolves.toBeUndefined();
    expect(mockGetUseCase.get).toHaveBeenCalledTimes(1);
    expect(mockGetUseCase.get).toHaveBeenLastCalledWith(productId);
  });

  it('should be called repository and get a persistence layer error', () => {
    const product = Product.create(validInputData, productId) as Product;
    mockGetUseCase.get.mockResolvedValue(product);
    mockRepo.save.mockResolvedValue(new DomainError('Persistence layer error'));

    const error = updateProduct.update(validInputData, productId);
    mockRepo.save(product);
    expect(mockGetUseCase.get).toBeCalledTimes(1);
    expect(mockRepo.save).toBeCalledTimes(1);
    expect(error).resolves.toBeInstanceOf(DomainError);
  });
});
