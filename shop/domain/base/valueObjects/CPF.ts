import { DomainError } from '../DomainError';
import { DomainReturn } from '../DomainReturn';
import { ValueObject } from '../ValueObject';
import { validateBr } from 'js-brasil';
export class CPF extends ValueObject<string> {
  public static create(cpf: string): DomainReturn<CPF> {
    if (!validateBr.cpf(cpf)) return new DomainError('CPF inválido');
    return new CPF(cpf.replace(/\D/g, ''));
  }
}
