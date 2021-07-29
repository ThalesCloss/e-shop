import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { Customer } from '@shop/domain/entities/Customer';
import { DeleteCustomerUseCase } from '@shop/domain/useCases/customer/DeleteCustomerUseCase';
import { CustomerRepository } from './contracts/CustomerRepository';

export class DeleteCustomerInteractor
  implements DeleteCustomerUseCase<Promise<DomainReturn<void>>>
{
  constructor(
    private readonly customerRepository: CustomerRepository<
      Promise<DomainReturn<Customer.CompleteCustomerData>>
    >,
  ) {}

  async delete(customerId: string): Promise<DomainReturn<void, DomainError>> {
    const customerEntityId = EntityId.create(customerId);
    if (customerEntityId instanceof DomainError) return customerEntityId;

    const deleted = await this.customerRepository.delete(customerEntityId);

    if (deleted instanceof DomainError) return deleted;
  }
}
