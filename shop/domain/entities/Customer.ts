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
    private _name: CompleteName,
    private _email: Email,
    private _gender: Customer.Gender,
    private _cpf: CPF,
  ) {
    super(entityId);
  }

  public static create(
    customer: Customer.CustomerData,
    id?: string,
  ): DomainReturn<Customer> {
    const name = CompleteName.create(customer.name);
    const email = Email.create(customer.email);
    const gender = customer.gender as Customer.Gender;
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
  get email() {
    return this._email;
  }
  get name() {
    return this._name;
  }
  get gender() {
    return this._gender;
  }
  get cpf() {
    return this._cpf;
  }

  public update(
    update: Partial<Omit<Customer.CustomerData, 'cpf'>>,
  ): DomainReturn<void> {
    let email, name;
    const errors: DomainError[] = [];

    if (update.email) email = Email.create(update.email);
    if (update.name) name = CompleteName.create(update.name);
    if (update.gender && !(update.gender in Customer.Gender)) {
      errors.push(new DomainError('Sexo inválido'));
    }
    if (email instanceof DomainError) errors.push(email);
    if (name instanceof DomainError) errors.push(name);
    if (errors.length)
      return new DomainError('Erro ao atualizar o cliente', errors);

    if (email) this._email = email as Email;
    this._gender = update.gender
      ? (update.gender as Customer.Gender)
      : this.gender;
    if (name) this._name = name as CompleteName;
    return;
  }
}

export namespace Customer {
  export type GenderString = 'M' | 'F' | 'O';
  export interface CustomerData {
    name: string;
    email: string;
    gender: GenderString;
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
