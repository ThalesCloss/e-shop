export interface GetProductUseCase<R> {
  get(productId: string): R;
}
