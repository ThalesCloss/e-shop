export interface GetSaleUseCase<R> {
  get(saleId: string): R;
}
