import { Customer } from '@shop/domain/entities/Customer';

export interface UpdateCustomerUseCase<R> {
  update(updateCustomerData: Customer.CustomerData, customerId: string): R;
}
