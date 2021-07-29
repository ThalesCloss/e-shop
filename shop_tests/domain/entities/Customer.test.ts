import { Customer } from '@shop/domain/entities/Customer';
import { DomainError } from '@shop/domain/base/DomainError';

describe('Unit test for Customer Entity', () => {
  it('should be return a new entity when the customer data is correct', () => {
    const customer = Customer.create({
      name: 'joao da silva',
      cpf: '99365027012',
      email: 'validemail@mail.com',
      gender: 'M',
    });
    expect(customer).toBeInstanceOf(Customer);
    expect((customer as Customer).id.value).not.toHaveLength(0);
  });

  it('should be return a DomainError when input a invalid customer data', () => {
    const customer = Customer.create({
      name: 'invalidname',
      cpf: '99365027342',
      email: 'validemail@mail',
      gender: 'K' as 'M',
    });
    expect(customer).toBeInstanceOf(DomainError);
    expect((customer as DomainError).errorsDetail).toHaveLength(4);
  });

  it('should be return a DomainError when input a invalid entityId', () => {
    const customer = Customer.create(
      {
        name: 'joao da silva',
        cpf: '99365027012',
        email: 'validemail@mail.com',
        gender: 'M',
      },
      'invalidEntityId',
    );
    expect(customer).toBeInstanceOf(DomainError);
    expect((customer as DomainError).errorsDetail).toHaveLength(1);
  });

  it('should be return true when comparing identical Customers', () => {
    const customer1 = Customer.create({
      name: 'joao da silva',
      cpf: '99365027012',
      email: 'validemail@mail.com',
      gender: 'M',
    });
    const customer2 = Customer.create(
      {
        name: 'joao da silva',
        cpf: '99365027012',
        email: 'validemail@mail.com',
        gender: 'M',
      },
      (customer1 as Customer).id.value,
    );
    expect(customer1).toBeInstanceOf(Customer);
    expect(customer2).toBeInstanceOf(Customer);
    expect((customer1 as Customer).equals(customer2 as Customer));
  });

  it('should be return true when comparing different Customers', () => {
    const customer1 = Customer.create({
      name: 'joao da silva',
      cpf: '99365027012',
      email: 'validemail@mail.com',
      gender: 'M',
    });
    const customer2 = Customer.create({
      name: 'joao da silva',
      cpf: '99365027012',
      email: 'validemail@mail.com',
      gender: 'M',
    });
    expect(customer1).toBeInstanceOf(Customer);
    expect(customer2).toBeInstanceOf(Customer);
    expect((customer1 as Customer).equals(customer2 as Customer)).toBeFalsy();
  });
  it('should be update customer with valid data', () => {
    const customer = Customer.create({
      name: 'joao da silva',
      cpf: '99365027012',
      email: 'validemail@mail.com',
      gender: 'M',
    });
    expect(customer).toBeInstanceOf(Customer);
    expect((customer as Customer).id.value).not.toHaveLength(0);
    const update = (customer as Customer).update({
      email: 'mail.valid@mail.com',
      gender: 'O',
      name: 'joao da silva cunha',
    });
    expect(update).not.toBeInstanceOf(DomainError);
  });

  it('should be not update customer with invalid data', () => {
    const customer = Customer.create({
      name: 'joao da silva',
      cpf: '99365027012',
      email: 'validemail@mail.com',
      gender: 'M',
    });
    expect(customer).toBeInstanceOf(Customer);
    expect((customer as Customer).id.value).not.toHaveLength(0);
    const update = (customer as Customer).update({
      email: 'invalidemails',
      gender: 'K' as Customer.Gender,
      name: 'invalidName',
    });
    expect(update).toBeInstanceOf(DomainError);
    expect((update as DomainError).errorsDetail).toHaveLength(3);
  });
});
