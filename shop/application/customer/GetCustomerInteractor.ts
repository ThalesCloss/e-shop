import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { Customer } from '@shop/domain/entities/Customer';
import { GetCustomerUseCase } from '@shop/domain/useCases/customer/GetCustomerUseCase';
import { CustomerRepository } from './contracts/CustomerRepository';

export class GetCustomerInteractor
  implements GetCustomerUseCase<Promise<DomainReturn<Customer>>>
{
  constructor(
    private readonly customerRepository: CustomerRepository<
      Promise<DomainReturn<Customer.CompleteCustomerData>>
    >,
  ) {}

  async get(customerId: string): Promise<DomainReturn<Customer>> {
    const customerEntityId = EntityId.create(customerId);
    if (customerEntityId instanceof DomainError) return customerEntityId;
    const customer = await this.customerRepository.get(customerEntityId);
    if (customer instanceof DomainError) return customer;
    const costumerEntity = Customer.create(customer, customer.id);
    return costumerEntity;
  }
}
