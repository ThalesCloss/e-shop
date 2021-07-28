export abstract class ValueObject<T> {
  protected constructor(protected readonly _value: T) {
    Object.freeze(this._value);
  }

  public equals(other: ValueObject<T>): boolean {
    return this._value === other._value;
  }

  get value(): T {
    return this._value;
  }
}
