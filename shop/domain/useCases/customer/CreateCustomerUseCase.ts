import { Customer } from '@shop/domain/entities/Customer';

export interface CreateCustomerUseCase<R> {
  create(customerData: Customer.CustomerData): R;
}
