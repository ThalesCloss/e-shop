export interface DeleteCustomerUseCase<R> {
  delete(customerId: string): R;
}
