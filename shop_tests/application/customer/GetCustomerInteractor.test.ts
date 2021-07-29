import { CustomerRepository } from '@shop/application/customer/contracts/CustomerRepository';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Customer } from '@shop/domain/entities/Customer';
import { mock, mockReset } from 'jest-mock-extended';
import { DomainError } from '@shop/domain/base/DomainError';
import { GetCustomerInteractor } from '@shop/application/customer/GetCustomerInteractor';
import { v4 } from 'uuid';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
describe('Unit test for GetCustomer Interactor', () => {
  const mockRepo =
    mock<
      CustomerRepository<Promise<DomainReturn<Customer.CompleteCustomerData>>>
    >();
  const getCustomer = new GetCustomerInteractor(mockRepo);
  const validInputData: Customer.CustomerData = {
    cpf: '99365027012',
    name: 'joao da silva',
    email: 'joao.valido@email.valido.com',
    gender: 'M',
  };
  const customerId = v4();
  beforeEach(() => {
    mockReset(mockRepo);
  });

  it('should be return a DomainError on try get Customer with invalid EntityId', () => {
    const created = getCustomer.get('invalid-uuid');
    expect(created).resolves.toBeInstanceOf(DomainError);
    expect(mockRepo.get).not.toBeCalled();
  });

  it('should be get a Customer and return CustomerEntity', () => {
    const entityId = EntityId.create(customerId);
    mockRepo.get.mockImplementation(async (customerEntityId) => ({
      ...validInputData,
      id: customerEntityId.value,
    }));
    const customer = getCustomer.get(customerId);
    expect(customer).resolves.toBeInstanceOf(Customer);
    expect(mockRepo.get).toHaveBeenCalledWith(entityId);
    expect(mockRepo.get).toBeCalledTimes(1);
  });

  it('should be called repository and get a persistence layer error', () => {
    mockRepo.get.mockResolvedValue(new DomainError('Persistence layer error'));
    const error = getCustomer.get(customerId);
    expect(mockRepo.get).toBeCalledTimes(1);
    expect(error).resolves.toBeInstanceOf(DomainError);
  });
});
