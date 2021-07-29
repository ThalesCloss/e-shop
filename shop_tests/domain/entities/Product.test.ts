import { Product } from '@shop/domain/entities/Product';
import { DomainError } from '@shop/domain/base/DomainError';

describe('Unit test for Product', () => {
  it('should be return a domain error when create product with invalid Price', () => {
    const product = Product.create({
      color: 'color',
      name: 'name',
      size: 'large',
      price: -10,
    });
    expect(product).toBeInstanceOf(DomainError);
    expect((product as DomainError).errorsDetail).toHaveLength(1);
  });

  it('should be return a new Product when input data is valid', () => {
    const product = Product.create({
      color: 'color',
      name: 'name',
      size: 'large',
      price: 10,
    });
    expect(product).toBeInstanceOf(Product);
    expect(product as Product).toHaveProperty('id');
  });

  it('should be return a domain error when create product with invalid ProductId', () => {
    const product = Product.create(
      {
        color: 'color',
        name: 'name',
        size: 'large',
        price: -10,
      },
      'invalid-key',
    );
    expect(product).toBeInstanceOf(DomainError);
    expect((product as DomainError).errorsDetail).toHaveLength(2);
  });
});
