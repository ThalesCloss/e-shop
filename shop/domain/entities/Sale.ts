import { DomainError } from '../base/DomainError';
import { DomainReturn } from '../base/DomainReturn';
import { Entity } from '../base/Entity';
import { Currency } from '../base/valueObjects/Currency';
import { EntityId } from '../base/valueObjects/EntityId';
import { Product } from './Product';

export class Sale extends Entity<EntityId> {
  private products: Map<string, ProductSale>;
  private constructor(
    id: EntityId,
    private _customerId: EntityId,
    public createdAt: Date,
    public observations: string,
    public payment: Sale.SalePayment,
  ) {
    super(id);
    this.products = new Map();
  }
  public static create(saleData: Omit<Sale.SaleData, 'products'>, id?: string) {
    const entityId = EntityId.create(id);
    const customerId = EntityId.create(saleData.customerId);
    const errors: DomainError[] = [];

    if (entityId instanceof DomainError) errors.push(entityId);
    if (customerId instanceof DomainError) errors.push(customerId);
    if (!(saleData.payment in Sale.SalePayment))
      errors.push(new DomainError('Metodo de pagamento inválido'));
    if (errors.length) return new DomainError('Erro ao criar a venda', errors);

    return new Sale(
      entityId as EntityId,
      customerId as EntityId,
      saleData.createdAt,
      saleData.observations,
      saleData.payment as Sale.SalePayment,
    );
  }

  get customerId() {
    return this._customerId;
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

  get totalSale() {
    return 0;
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
    payment: SalePaymentType;
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
  export type SalePaymentType = 'MONEY' | 'CARD' | 'CHECK';
  export enum SalePayment {
    MONEY = 'MONEY',
    CARD = 'CARD',
    CHECK = 'CHECK',
  }
}
