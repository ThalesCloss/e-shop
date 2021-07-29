import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Customer } from '@shop/domain/entities/Customer';
import { CreateCustomerUseCase } from '@shop/domain/useCases/customer/CreateCustomerUseCase';
import { CustomerRepository } from './contracts/CustomerRepository';

export class CreateCustomerInteractor
  implements
    CreateCustomerUseCase<Promise<DomainReturn<Customer.CompleteCustomerData>>>
{
  constructor(
    private readonly customerRepository: CustomerRepository<
      Promise<DomainReturn<Customer.CompleteCustomerData>>
    >,
  ) {}
  async create(
    customerData: Customer.CustomerData,
  ): Promise<DomainReturn<Customer.CompleteCustomerData>> {
    const customer = Customer.create(customerData);
    if (customer instanceof DomainError) return customer;
    const customerSaved = await this.customerRepository.save(customer);
    return customerSaved;
  }
}
