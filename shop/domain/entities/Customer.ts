import { DomainReturn } from './../base/DomainReturn';
import { Entity } from '../base/Entity';
import { EntityId } from '../base/valueObjects/EntityId';
import { DomainError } from '../base/DomainError';
import { CompleteName } from '../base/valueObjects/CompleteName';
import { CPF } from '../base/valueObjects/CPF';
import { Email } from '../base/valueObjects/Email';

export class Customer extends Entity<EntityId> {
  public static create(
    customer: createCustomer,
    id?: string,
  ): DomainReturn<Customer> {
    const name = CompleteName.create(customer.name);
    const email = Email.create(customer.email);
    const gender = customer.gender as Gender;
    const cpf = CPF.create(customer.cpf);
    const entityId = EntityId.create(id);
    const errors: DomainError[] = [];
    if (name instanceof DomainError) errors.push(name);
    if (email instanceof DomainError) errors.push(email);
    if (cpf instanceof DomainError) errors.push(cpf);
    if (entityId instanceof DomainError) errors.push(entityId);
    if (errors.length)
      return new DomainError('Erro ao criar o cliente', errors);
    return new Customer(
      entityId as EntityId,
      name as CompleteName,
      email as Email,
      gender,
      cpf as CPF,
    );
  }

  private constructor(
    entityId: EntityId,
    public name: CompleteName,
    public email: Email,
    public gender: string,
    public cpf: CPF,
  ) {
    super(entityId);
  }

  public equals(other: Customer): boolean {
    return this._id.equals(other.id) && this.cpf.equals(other.cpf);
  }
}

type createCustomer = {
  name: string;
  email: string;
  gender: Gender;
  cpf: string;
};

export enum Gender {
  M = 'm',
  F = 'f',
  O = 'o',
}
