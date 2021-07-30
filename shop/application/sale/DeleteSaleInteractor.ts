import { DomainError } from '@shop/domain/base/DomainError';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { EntityId } from '@shop/domain/base/valueObjects/EntityId';
import { Sale } from '@shop/domain/entities/Sale';
import { DeleteSaleUseCase } from '@shop/domain/useCases/sale/DeleteSaleUseCase';
import { SaleRepository } from './contracts/SaleRepository';

export class DeleteSaleInteractor
  implements DeleteSaleUseCase<Promise<DomainReturn<void>>>
{
  constructor(
    private readonly saleRepository: SaleRepository<
      Promise<DomainReturn<Sale.CompleteSaleData>>
    >,
  ) {}

  async delete(saleId: string): Promise<DomainReturn<void, DomainError>> {
    const saleEntityId = EntityId.create(saleId);
    if (saleEntityId instanceof DomainError) return saleEntityId;

    const deleted = await this.saleRepository.delete(saleEntityId);

    if (deleted instanceof DomainError) return deleted;
  }
}
