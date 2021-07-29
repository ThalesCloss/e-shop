import { CustomerRepository } from '@shop/application/customer/contracts/CustomerRepository';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Customer } from '@shop/domain/entities/Customer';
import { mock, mockReset } from 'jest-mock-extended';
import { DomainError } from '@shop/domain/base/DomainError';
import { UpdateCustomerInteractor } from '@shop/application/customer/UpdateCustomerInteractor';
import { GetCustomerUseCase } from '@shop/domain/useCases/customer/GetCustomerUseCase';
import { v4 } from 'uuid';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
describe('Unit test for UpdateCustomer Interactor', () => {
  const mockRepo =
    mock<
      CustomerRepository<Promise<DomainReturn<Customer.CompleteCustomerData>>>
    >();

  const mockGetUseCase =
    mock<GetCustomerUseCase<Promise<DomainReturn<Customer>>>>();

  const updateCustomer = new UpdateCustomerInteractor(mockRepo, mockGetUseCase);
  const validInputData: Customer.CustomerData = {
    cpf: '99365027012',
    name: 'joao da silva',
    email: 'joao.valido@email.valido.com',
    gender: 'M',
  };
  const customerId = v4();
  const customerEntityId = EntityId.create(customerId);
  beforeEach(() => {
    mockReset(mockRepo);
    mockReset(mockGetUseCase);
  });

  it('should be return a DomainError on try update invalid CustomerEntityId', () => {
    mockGetUseCase.get.mockResolvedValue(new DomainError('invalid entity id'));
    const updated = updateCustomer.update(
      validInputData,
      'invalid-customer-id',
    );

    expect(updated).resolves.toBeInstanceOf(DomainError);
    expect(mockGetUseCase.get).toBeCalledWith('invalid-customer-id');
    expect(mockGetUseCase.get).toBeCalledTimes(1);
    expect(mockRepo.save).not.toBeCalled();
  });

  it('should be return a DomainError on try update Customer with invalid data', () => {
    const invalidInputData: Customer.CustomerData = {
      email: 'invalid',
      name: 'invalid',
      gender: 'P' as Customer.Gender,
      cpf: 'invalid',
    };
    mockGetUseCase.get.mockImplementation(async (customerId) =>
      Customer.create(validInputData, customerId),
    );

    const updated = updateCustomer.update(invalidInputData, customerId);
    expect(mockGetUseCase.get).toBeCalledWith(customerId);
    expect(mockGetUseCase.get).toBeCalledTimes(1);
    expect(updated).resolves.toBeInstanceOf(DomainError);
    expect(mockRepo.save).not.toBeCalled();
  });

  it('should be update a valid Customer with valid data', () => {
    const customer = Customer.create(validInputData, customerId) as Customer;
    mockGetUseCase.get.mockResolvedValue(customer);
    mockRepo.save.mockImplementation(async (customer) => ({
      cpf: customer.cpf.value,
      email: customer.email.value,
      gender: customer.gender,
      id: customer.id.value,
      name: customer.name.value,
    }));

    const updated = updateCustomer.update(validInputData, customerId);
    expect(updated).resolves.toBeUndefined();
    expect(mockGetUseCase.get).toHaveBeenCalledTimes(1);
    expect(mockGetUseCase.get).toHaveBeenLastCalledWith(customerId);
  });

  it('should be called repository and get a persistence layer error', () => {
    const customer = Customer.create(validInputData, customerId) as Customer;
    mockGetUseCase.get.mockResolvedValue(customer);
    mockRepo.save.mockResolvedValue(new DomainError('Persistence layer error'));

    const error = updateCustomer.update(validInputData, customerId);
    mockRepo.save(customer);
    expect(mockGetUseCase.get).toBeCalledTimes(1);
    expect(mockRepo.save).toBeCalledTimes(1);
    expect(error).resolves.toBeInstanceOf(DomainError);
  });
});
