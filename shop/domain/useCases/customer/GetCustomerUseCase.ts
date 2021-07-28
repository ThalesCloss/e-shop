export interface GetCustomerUseCase<R> {
  get(customerId: string): R;
}
