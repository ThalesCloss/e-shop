import { DomainReturn } from './../base/DomainReturn';
import { Entity } from '../base/Entity';
import { EntityId } from '../base/valueObjects/EntityId';
import { DomainError } from '../base/DomainError';
import { CompleteName } from '../base/valueObjects/CompleteName';
import { CPF } from '../base/valueObjects/CPF';
import { Email } from '../base/valueObjects/Email';

export class Customer extends Entity<EntityId> {
  private constructor(
    entityId: EntityId,
    public name: CompleteName,
    public email: Email,
    public gender: string,
    public cpf: CPF,
  ) {
    super(entityId);
  }

  public static create(
    customer: Customer.CustomerData,
    id?: string,
  ): DomainReturn<Customer> {
    const name = CompleteName.create(customer.name);
    const email = Email.create(customer.email);
    const gender = customer.gender;
    const cpf = CPF.create(customer.cpf);
    const entityId = EntityId.create(id);
    const errors: DomainError[] = [];
    if (!(customer.gender in Customer.Gender))
      errors.push(new DomainError('Sexo inválido'));
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

  public equals(other: Customer): boolean {
    return this._id.equals(other.id) && this.cpf.equals(other.cpf);
  }
}

export namespace Customer {
  export interface CustomerData {
    name: string;
    email: string;
    gender: 'M' | 'F' | 'O';
    cpf: string;
  }

  export interface CompleteCustomerData extends CustomerData {
    id: string;
  }

  export enum Gender {
    M = 'M',
    F = 'F',
    O = 'O',
  }
}
