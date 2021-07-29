export interface DeleteSaleUseCase<R> {
  delete(saleId: string): R;
}
