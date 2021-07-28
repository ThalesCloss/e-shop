import { Customer, Gender } from '@shop/domain/entities/Customer';
import { DomainError } from '@shop/domain/base/DomainError';

describe('Unit test for Customer Entity', () => {
  it('should be return a new entity when the customer data is correct', () => {
    const customer = Customer.create({
      name: 'joao da silva',
      cpf: '99365027012',
      email: 'validemail@mail.com',
      gender: Gender.M,
    });
    expect(customer).toBeInstanceOf(Customer);
    expect((customer as Customer).id.value).not.toHaveLength(0);
  });

  it('should be return a DomainError when input a invalid customer data', () => {
    const customer = Customer.create({
      name: 'invalidname',
      cpf: '99365027342',
      email: 'validemail@mail',
      gender: Gender.M,
    });
    expect(customer).toBeInstanceOf(DomainError);
    expect((customer as DomainError).errorsDetail).toHaveLength(3);
  });

  it('should be return a DomainError when input a invalid entityId', () => {
    const customer = Customer.create(
      {
        name: 'joao da silva',
        cpf: '99365027012',
        email: 'validemail@mail.com',
        gender: Gender.M,
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
      gender: Gender.M,
    });
    const customer2 = Customer.create(
      {
        name: 'joao da silva',
        cpf: '99365027012',
        email: 'validemail@mail.com',
        gender: Gender.M,
      },
      (customer1 as Customer).id.value,
    );
    expect((customer1 as Customer).equals(customer2 as Customer));
  });

  it('should be return true when comparing different Customers', () => {
    const customer1 = Customer.create({
      name: 'joao da silva',
      cpf: '99365027012',
      email: 'validemail@mail.com',
      gender: Gender.M,
    });
    const customer2 = Customer.create({
      name: 'joao da silva',
      cpf: '99365027012',
      email: 'validemail@mail.com',
      gender: Gender.M,
    });
    expect((customer1 as Customer).equals(customer2 as Customer)).toBeFalsy();
  });
});
