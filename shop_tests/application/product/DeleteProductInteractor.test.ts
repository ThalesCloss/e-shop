import { ProductRepository } from '@shop/application/product/contracts/ProductRepository';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Product } from '@shop/domain/entities/Product';
import { DeleteProductInteractor } from '@shop/application/product/DeleteProductInteractor';
import { mock, mockReset } from 'jest-mock-extended';
import { DomainError } from '@shop/domain/base/DomainError';
import { v4 } from 'uuid';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';

describe('Unit test for DeleteProduct usecase', () => {
  const mockRepo =
    mock<
      ProductRepository<Promise<DomainReturn<Product.CompleteProductData>>>
    >();
  const deleteProduct = new DeleteProductInteractor(mockRepo);
  const productId = v4();
  const productEntityId = EntityId.create(productId);
  beforeEach(() => {
    mockReset(mockRepo);
  });

  it('should be return DomainError on try delete Product with invalid productId', () => {
    const deleted = deleteProduct.delete('invalid');
    expect(deleted).resolves.toBeInstanceOf(DomainError);
    expect(mockRepo.delete).not.toBeCalled();
  });

  it('should be return DomainError on try delete missing Product', () => {
    mockRepo.delete.mockResolvedValue(new DomainError('Product not found'));
    const deleted = deleteProduct.delete(productId);
    expect(deleted).resolves.toBeInstanceOf(DomainError);
    expect(mockRepo.delete).toBeCalledTimes(1);
    expect(mockRepo.delete).toBeCalledWith(productEntityId);
  });

  it('should be delete Product', () => {
    mockRepo.delete.mockResolvedValue({
      name: '',
      color: '',
      id: '',
      price: 0,
      size: '',
    });
    const deleted = deleteProduct.delete(productId);
    expect(deleted).resolves.toBeUndefined();
    expect(mockRepo.delete).toBeCalledTimes(1);
    expect(mockRepo.delete).toBeCalledWith(productEntityId);
  });
});
