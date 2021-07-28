export abstract class Entity<T> {
  protected _id: T;

  protected constructor(id: T) {
    this._id = id;
  }

  public abstract equals(other: Entity<T>): boolean;

  get id(): T {
    return this._id;
  }
}
