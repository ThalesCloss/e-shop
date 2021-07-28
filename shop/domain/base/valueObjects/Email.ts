import { DomainError } from '../DomainError';
import { DomainReturn } from '../DomainReturn';
import { ValueObject } from '../ValueObject';
import { validateBr } from 'js-brasil';
export class Email extends ValueObject<string> {
  public static create(email: string): DomainReturn<Email> {
    if (!validateBr.email(email))
      return new DomainError('E-mail inválido informado');
    return new Email(email);
  }
}
