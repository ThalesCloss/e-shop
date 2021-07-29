import { ProductSale, Sale } from '@shop/domain/entities/Sale';
import { Product } from '@shop/domain/entities/Product';
import { DomainError } from '@shop/domain/base/DomainError';
import { v4 } from 'uuid';

describe('Unit test for Sale', () => {
  const validInputSale: Omit<Sale.SaleData, 'products'> = {
    createdAt: new Date(),
    customerId: v4(),
    observations: 'obs sale',
    payment: 'CARD',
  };
  it('should be create a sale when valid input', () => {
    const sale = Sale.create(validInputSale);
    expect(sale).toBeInstanceOf(Sale);
  });

  it('should be return a domainError when invalid input', () => {
    const sale = Sale.create(
      {
        ...validInputSale,
        payment: 'OTHER' as Sale.SalePayment,
        customerId: 'invalid',
      },
      'invalid',
    );
    expect(sale).toBeInstanceOf(DomainError);
    expect((sale as DomainError).errorsDetail).toHaveLength(3);
  });

  it('should be insert a ProductSale on Sale', () => {
    const sale = Sale.create(validInputSale) as Sale;
    const product = Product.create({
      name: 'teste',
      color: 'teste',
      price: 100,
      size: 'large',
    }) as Product;
    const inserted = sale.addProduct(product, 2);
    const productSale = sale.getProduct(product.id);
    expect(inserted).toBeUndefined();
    expect(inserted).not.toBeInstanceOf(DomainError);
    expect(productSale).toBeInstanceOf(ProductSale);
    expect((productSale as ProductSale).productId).toEqual(product.id);
  });

  it('should be update quantity of ProductSale on Sale', () => {
    const sale = Sale.create(validInputSale) as Sale;
    const product = Product.create({
      name: 'teste',
      color: 'teste',
      price: 100,
      size: 'large',
    }) as Product;
    sale.addProduct(product, 1);
    const update = sale.addProduct(product, 4);
    expect(update).toBeUndefined();
    const productSale = sale.getProduct(product.id) as ProductSale;
    expect(productSale.quantity).toEqual(5);
  });

  it('should be decrease quantity of ProductSale', () => {
    const sale = Sale.create(validInputSale) as Sale;
    const product = Product.create({
      name: 'teste',
      color: 'teste',
      price: 100,
      size: 'large',
    }) as Product;
    sale.addProduct(product, 50);
    const decrease = sale.removeProductQuantity(product.id, 5);
    expect(decrease).toBeUndefined();
    const productSale = sale.getProduct(product.id);
    expect(productSale).toBeInstanceOf(ProductSale);
    expect((productSale as ProductSale).quantity).toEqual(50 - 5);
  });

  it('should update the quantity to zero when the removed quantity is greater than the product quantity', () => {
    const sale = Sale.create(validInputSale) as Sale;
    const product = Product.create({
      name: 'teste',
      color: 'teste',
      price: 100,
      size: 'large',
    }) as Product;
    sale.addProduct(product, 50);
    sale.removeProductQuantity(product.id, 55);
    const productSale = sale.getProduct(product.id);
    expect((productSale as ProductSale).quantity).toEqual(0);
  });

  it('should be return DomainError when updated quantity for missing ProductSale', () => {
    const sale = Sale.create(validInputSale) as Sale;
    const product = Product.create({
      name: 'teste',
      color: 'teste',
      price: 100,
      size: 'large',
    }) as Product;
    const update = sale.removeProductQuantity(product.id, 1);
    expect(update).toBeInstanceOf(DomainError);
  });

  it('should be return DomainError when removes missing ProductSale', () => {
    const sale = Sale.create(validInputSale) as Sale;
    const product = Product.create({
      name: 'teste',
      color: 'teste',
      price: 100,
      size: 'large',
    }) as Product;
    const update = sale.removeProduct(product.id);
    expect(update).toBeInstanceOf(DomainError);
  });

  it('should be return DomainError when add ProductSale and there is a Product with a different unit price', () => {
    const sale = Sale.create(validInputSale) as Sale;
    const product1 = Product.create({
      name: 'teste',
      color: 'teste',
      price: 100,
      size: 'large',
    }) as Product;
    const product2 = Product.create(
      {
        name: 'teste',
        color: 'teste',
        price: 10,
        size: 'large',
      },
      product1.id.value,
    ) as Product;
    sale.addProduct(product1, 2);
    const update = sale.addProduct(product2, 10);
    expect(update).toBeInstanceOf(DomainError);
  });
});
