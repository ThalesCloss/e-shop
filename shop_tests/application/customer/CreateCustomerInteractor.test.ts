import { CreateCustomerInteractor } from '@shop/application/customer/CreateCustomerInteractor';
import { CustomerRepository } from '@shop/application/customer/contracts/CustomerRepository';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Customer } from '@shop/domain/entities/Customer';
import { mock, mockReset } from 'jest-mock-extended';
import { DomainError } from '@shop/domain/base/DomainError';
describe('Unit test for CreateCustomer Interactor', () => {
  const mockRepo =
    mock<
      CustomerRepository<Promise<DomainReturn<Customer.CompleteCustomerData>>>
    >();
  const createCustomer = new CreateCustomerInteractor(mockRepo);
  const validInputData: Customer.CustomerData = {
    cpf: '99365027012',
    name: 'joao da silva',
    email: 'joao.valido@email.valido.com',
    gender: 'M',
  };
  beforeEach(() => {
    mockReset(mockRepo);
  });

  it('a domain error should be returned when trying to create a client with invalid data and cannot call save', () => {
    const created = createCustomer.create({
      cpf: '1234',
      name: 'dasd',
      gender: 'M',
      email: 'djkas',
    });
    expect(created).resolves.toBeInstanceOf(DomainError);
    expect(mockRepo.save).not.toBeCalled();
  });

  it('should be create new Customer and return CustomerCompleteData', () => {
    mockRepo.save.mockImplementation(async (customer) => ({
      cpf: customer.cpf.value,
      email: customer.email.value,
      gender: customer.gender,
      id: customer.id.value,
      name: customer.name.value,
    }));
    const created = createCustomer.create(validInputData);
    expect(mockRepo.save).toBeCalledTimes(1);
    expect(created).resolves.not.toBeInstanceOf(DomainError);
    expect(created).resolves.toHaveProperty('id');
  });

  it('should be called repository and get a persistence layer error', () => {
    mockRepo.save.mockResolvedValue(new DomainError('Persistence layer error'));
    const error = createCustomer.create(validInputData);
    expect(mockRepo.save).toBeCalledTimes(1);
    expect(error).resolves.toBeInstanceOf(DomainError);
  });
});
