import { DomainError } from '../DomainError';
import { DomainReturn } from '../DomainReturn';
import { ValueObject } from '../ValueObject';

export class CompleteName extends ValueObject<string> {
  private static readonly parts = ['de', 'do', 'das', 'dos', 'da'];
  public static create(name: string): DomainReturn<CompleteName> {
    const nameParts = name.toLowerCase().split(' ');
    if (nameParts.length < 2)
      return new DomainError(`Nome completo ${name} inválido`);
    name = nameParts
      .map((part) =>
        this.parts.includes(part) || part.length === 1
          ? part
          : `${part[0].toUpperCase()}${part.slice(1)}`,
      )
      .join(' ');

    return new CompleteName(name);
  }
}
