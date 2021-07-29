import { DomainError } from '../base/DomainError';
import { DomainReturn } from '../base/DomainReturn';
import { Entity } from '../base/Entity';
import { Currency } from '../base/valueObjects/Currency';
import { EntityId } from '../base/valueObjects/EntityId';

export class Product extends Entity<EntityId> {
  private constructor(
    id: EntityId,
    public name: string,
    public color: string,
    public size: string,
    public price: Currency,
  ) {
    super(id);
  }

  public static create(
    productData: Product.ProductData,
    id?: string,
  ): DomainReturn<Product> {
    const entityId = EntityId.create(id);
    const price = Currency.create(productData.price);
    const errors: DomainError[] = [];
    if (entityId instanceof DomainError) errors.push(entityId);
    if (price instanceof DomainError) errors.push(price);
    if (errors.length)
      return new DomainError('Erro ao criar o produto', errors);

    return new Product(
      entityId as EntityId,
      productData.name,
      productData.color,
      productData.size,
      price as Currency,
    );
  }

  public equals(other: Entity<EntityId>): boolean {
    return this.id.equals(other.id);
  }
}

export namespace Product {
  export interface ProductData {
    name: string;
    color: string;
    size: string;
    price: number;
  }
  export interface CompleteProductData extends ProductData {
    id: string;
  }
}
