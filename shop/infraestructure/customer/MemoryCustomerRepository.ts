import { CustomerRepository } from '@shop/application/customer/contracts/CustomerRepository';
import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { Customer } from '@shop/domain/entities/Customer';

export class MemoryCustomerRepository
  implements
    CustomerRepository<Promise<DomainReturn<Customer.CompleteCustomerData>>>
{
  public customers: Map<string, Customer.CompleteCustomerData> = new Map();
  async save(
    customer: Customer,
  ): Promise<DomainReturn<Customer.CompleteCustomerData, DomainError>> {
    this.customers.set(customer.id.value, {
      cpf: customer.cpf.value,
      email: customer.email.value,
      name: customer.name.value,
      gender: customer.gender,
      id: customer.id.value,
    });
    return (
      this.customers.get(customer.id.value) ?? new DomainError('Erro ao salvar')
    );
  }

  async delete(
    customerEntityId: EntityId,
  ): Promise<DomainReturn<Customer.CompleteCustomerData>> {
    if (!this.customers.has(customerEntityId.value))
      return new DomainError('Cliente não encontrado');
    const customer = this.customers.get(
      customerEntityId.value,
    ) as Customer.CompleteCustomerData;
    return customer;
  }

  async get(
    customerEntityId: EntityId,
  ): Promise<DomainReturn<Customer.CompleteCustomerData, DomainError>> {
    return (
      this.customers.get(customerEntityId.value) ??
      new DomainError('Cliente não encontrado')
    );
  }
}
