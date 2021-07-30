import { CustomerRepository } from '@shop/application/customer/contracts/CustomerRepository';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Customer as CustomerDomain } from '@shop/domain/entities/Customer';
import { DomainError } from '@shop/domain/base/DomainError';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { Customer } from './customer.entity';
import { EntityManager, getManager } from 'typeorm';
import { GetManyCustomerRepository } from '@shop/application/customer/contracts/GetManyCustomerRepository';

export class OrmCustomerRepository
  implements
    CustomerRepository<
      Promise<DomainReturn<CustomerDomain.CompleteCustomerData>>
    >,
    GetManyCustomerRepository<
      Promise<DomainReturn<CustomerDomain.CompleteCustomerData[]>>
    >
{
  private em: EntityManager;
  constructor() {
    this.em = getManager();
  }
  async getMany(
    customerEntityId?: EntityId[],
  ): Promise<DomainReturn<CustomerDomain.CompleteCustomerData[], DomainError>> {
    try {
      if (customerEntityId?.length)
        return this.em.findByIds(
          Customer,
          customerEntityId.map((i) => i.value),
        );
      return this.em.find(Customer);
    } catch (err) {
      return new DomainError(err.message);
    }
  }
  async get(
    customerEntityId: EntityId,
  ): Promise<DomainReturn<CustomerDomain.CompleteCustomerData, DomainError>> {
    try {
      const customer = await this.em.findOne(Customer, customerEntityId.value);
      if (!customer) return new DomainError('Not Found');
      return customer;
    } catch (err) {
      return new DomainError(err.message);
    }
  }

  async save(customer: CustomerDomain) {
    try {
      const saved = await this.em.save(Customer, {
        cpf: customer.cpf.value,
        email: customer.email.value,
        gender: customer.gender,
        name: customer.name.value,
        id: customer.id.value,
      });
      return saved;
    } catch (err) {
      return new DomainError(err.message);
    }
  }
  async delete(customerEntityId: EntityId) {
    try {
      await this.em.delete(Customer, customerEntityId.value);
      return {
        id: customerEntityId.value,
        cpf: '',
        email: '',
        gender: CustomerDomain.Gender.O,
        name: '',
      };
    } catch (err) {
      return new DomainError(err.message);
    }
  }
}
