import { DomainError } from '../DomainError';
import { DomainReturn } from '../DomainReturn';
import { ValueObject } from '../ValueObject';
export class Currency extends ValueObject<number> {
  public static create(value: number): DomainReturn<Currency> {
    if (value < 0)
      return new DomainError('O valor monetário não pode ser negativo');
    return new Currency(value);
  }
}
