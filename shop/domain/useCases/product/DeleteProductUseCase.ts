export interface DeleteProductUseCase<R> {
  delete(productId: string): R;
}
