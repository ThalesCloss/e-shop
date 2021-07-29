export interface GetProductsUseCase<R> {
  get(productIds: string[]): R;
}
