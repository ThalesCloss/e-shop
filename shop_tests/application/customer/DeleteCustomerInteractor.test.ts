import { CustomerRepository } from '@shop/application/customer/contracts/CustomerRepository';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Customer } from '@shop/domain/entities/Customer';
import { DeleteCustomerInteractor } from '@shop/application/customer/DeleteCustomerInteractor';
import { mock, mockReset } from 'jest-mock-extended';
import { DomainError } from '@shop/domain/base/DomainError';
import { v4 } from 'uuid';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';

describe('Unit test for DeleteCustomer usecase', () => {
  const mockRepo =
    mock<
      CustomerRepository<Promise<DomainReturn<Customer.CompleteCustomerData>>>
    >();
  const deleteCustomer = new DeleteCustomerInteractor(mockRepo);
  const customerId = v4();
  const customerEntityId = EntityId.create(customerId);
  beforeEach(() => {
    mockReset(mockRepo);
  });

  it('should be return DomainError on try delete Customer with invalid CustomerId', () => {
    const deleted = deleteCustomer.delete('invalid');
    expect(deleted).resolves.toBeInstanceOf(DomainError);
    expect(mockRepo.delete).not.toBeCalled();
  });

  it('should be return DomainError on try delete missing Customer', () => {
    mockRepo.delete.mockResolvedValue(new DomainError('Customer not found'));
    const deleted = deleteCustomer.delete(customerId);
    expect(deleted).resolves.toBeInstanceOf(DomainError);
    expect(mockRepo.delete).toBeCalledTimes(1);
    expect(mockRepo.delete).toBeCalledWith(customerEntityId);
  });

  it('should be delete Customer', () => {
    mockRepo.delete.mockResolvedValue({
      id: '',
      cpf: '',
      email: '',
      name: '',
      gender: 'O',
    });
    const deleted = deleteCustomer.delete(customerId);
    expect(deleted).resolves.toBeUndefined();
    expect(mockRepo.delete).toBeCalledTimes(1);
    expect(mockRepo.delete).toBeCalledWith(customerEntityId);
  });
});
