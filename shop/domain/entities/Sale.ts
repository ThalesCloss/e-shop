import { DomainError } from '../base/DomainError';
import { DomainReturn } from '../base/DomainReturn';
import { Entity } from '../base/Entity';
import { Currency } from '../base/valueObjects/Currency';
import { EntityId } from '../base/valueObjects/EntityId';
import { Product } from './Product';

export class Sale extends Entity<EntityId> {
  private products: Map<string, ProductSale>;
  private constructor(id: EntityId) {
    super(id);
    this.products = new Map();
  }
  public static create(id?: string) {
    return new Sale(EntityId.create(id) as EntityId);
  }

  public addProduct(product: Product, quantity = 1): DomainReturn<void> {
    if (this.products.has(product.id.value)) {
      if (!this.products.get(product.id.value)?.unitPrice.equals(product.price))
        return new DomainError(
          'Já existe um produto adicionado com preço diferente do atual',
        );

      (this.products.get(product.id.value) as ProductSale).increaseQuantity(
        quantity,
      );

      return;
    }
    this.products.set(
      product.id.value,
      new ProductSale(product.id, product.name, product.price, quantity),
    );
    return;
  }

  public removeProductQuantity(
    productId: EntityId,
    decreaseQuantity: number,
  ): DomainReturn<void> {
    if (!this.products.has(productId.value))
      return new DomainError('Nenhum produto para reduzir na lista');

    this.products.get(productId.value)?.decreaseQuantity(decreaseQuantity);
  }

  public removeProduct(productId: EntityId): DomainReturn<void> {
    if (!this.products.delete(productId.value))
      return new DomainError('O produto não estava na lista');
  }

  public getProduct(productId: EntityId): DomainReturn<ProductSale> {
    return (
      this.products.get(productId.value) ??
      new DomainError('Produto não encontrado')
    );
  }

  public equals(other: Entity<EntityId>): boolean {
    return this.id.equals(other.id);
  }
}
export class ProductSale {
  constructor(
    private _productId: EntityId,
    private _name: string,
    private _unitPrice: Currency,
    private _quantity: number,
  ) {}

  get productId() {
    return this._productId;
  }
  get name() {
    return this._name;
  }
  get unitPrice() {
    return this._unitPrice;
  }
  get quantity() {
    return this._quantity;
  }

  public increaseQuantity(quantity: number): void {
    this._quantity += quantity;
  }
  public decreaseQuantity(quantity: number): void {
    this._quantity = quantity > this._quantity ? 0 : this._quantity - quantity;
  }

  get totalPrice() {
    return Currency.create(this._quantity * this._unitPrice.value);
  }
}

export namespace Sale {
  export interface SaleData {
    createdAt: Date;
    payment: SalePayment;
    observations: string;
    customerId: string;
    products: SaleProductData[];
  }
  export interface SaleProductData {
    productId: string;
    name: string;
    quantity: number;
    unit_price: number;
  }
  export interface CompleteSaleData extends SaleData {
    id: string;
  }
  export enum SalePayment {
    MONEY = 'money',
    CARD = 'card',
    CHECK = 'check',
  }
}
