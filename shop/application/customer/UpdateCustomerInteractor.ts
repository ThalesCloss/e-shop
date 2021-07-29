import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Customer } from '@shop/domain/entities/Customer';
import { GetCustomerUseCase } from '@shop/domain/useCases/customer/GetCustomerUseCase';
import { UpdateCustomerUseCase } from '@shop/domain/useCases/customer/UpdateCustomerUseCase';
import { CustomerRepository } from './contracts/CustomerRepository';

export class UpdateCustomerInteractor
  implements UpdateCustomerUseCase<Promise<DomainReturn<void>>>
{
  constructor(
    private readonly customerRepository: CustomerRepository<
      Promise<DomainReturn<Customer.CompleteCustomerData>>
    >,
    private readonly getCustomerUseCase: GetCustomerUseCase<
      Promise<DomainReturn<Customer>>
    >,
  ) {}
  async update(
    updateCustomerData: Customer.CustomerData,
    customerId: string,
  ): Promise<DomainReturn<void, DomainError>> {
    const customer = await this.getCustomerUseCase.get(customerId);
    if (customer instanceof DomainError) return customer;

    const canUpdate = customer.update(updateCustomerData);

    if (canUpdate instanceof DomainError) return canUpdate;

    const updated = await this.customerRepository.save(customer);

    if (updated instanceof DomainError) return updated;
  }
}
