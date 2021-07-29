import { CreateSaleUseCase } from './CreateSaleUseCase';

export interface UpdateSaleUseCase<R> {
  update(updateSaleData: string, saleId: string): R;
}

export namespace UpdateSaleUseCase {
  export type updateSaleUseCase = Partial<
    Omit<CreateSaleUseCase.CreateSaleData, 'customerId'>
  >;
}
