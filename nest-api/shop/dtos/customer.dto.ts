import { Customer } from '@shop/domain/entities/Customer';

export class CustomerDto implements Customer.CompleteCustomerData {
  id = '';
  name = '';
  email = '';
  gender: Customer.GenderString = 'O';
  cpf = '';

  constructor(customer: Partial<Customer.CompleteCustomerData>) {
    Object.assign(this, customer);
  }

  public static fromDomain(customer: Customer) {
    return new CustomerDto({
      cpf: customer.cpf.value,
      name: customer.name.value,
      email: customer.email.value,
      gender: customer.gender,
      id: customer.id.value,
    });
  }
}
