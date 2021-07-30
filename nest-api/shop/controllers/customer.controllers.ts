import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DomainReturn } from '@shop/domain/base/DomainReturn';
import { Customer } from '@shop/domain/entities/Customer';
import { GetCustomerUseCase } from '@shop/domain/useCases/customer/GetCustomerUseCase';
import { DomainError } from '@shop/domain/base/DomainError';
import { GetManyCustomerRepository } from '@shop/application/customer/contracts/GetManyCustomerRepository';
import { CustomerDto } from '../dtos/customer.dto';
import { DeleteCustomerUseCase } from '@shop/domain/useCases/customer/DeleteCustomerUseCase';
import { CreateCustomerUseCase } from '@shop/domain/useCases/customer/CreateCustomerUseCase';
import { CreateCustomerDto } from '../dtos/createCustomer.dto';
import { UpdateCustomerUseCase } from '@shop/domain/useCases/customer/UpdateCustomerUseCase';

@Controller('customers')
export class CustomerController {
  constructor(
    @Inject('GetCustomerUseCase')
    private readonly getCustomerUseCase: GetCustomerUseCase<
      Promise<DomainReturn<Customer>>
    >,
    @Inject('GetManyCustomerRepository')
    private readonly getManyCustomerRepository: GetManyCustomerRepository<
      Promise<DomainReturn<Customer.CompleteCustomerData[]>>
    >,
    @Inject('DeleteCustomerUseCase')
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase<
      Promise<DomainReturn<void>>
    >,
    @Inject('CreateCustomerUseCase')
    private readonly createCustomerUseCase: CreateCustomerUseCase<
      Promise<DomainReturn<Customer.CompleteCustomerData>>
    >,
    @Inject('UpdateCustomerUseCase')
    private readonly updateCustomerUseCase: UpdateCustomerUseCase<
      Promise<DomainReturn<Customer.CompleteCustomerData>>
    >,
  ) {}
  @Get('/')
  getAll() {
    return this.getManyCustomerRepository.getMany();
  }

  @Get('/:id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    const customer = await this.getCustomerUseCase.get(id);
    if (customer instanceof DomainError) return customer.message;
    return CustomerDto.fromDomain(customer);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const deleted = await this.deleteCustomerUseCase.delete(id);
    if (deleted instanceof DomainError) return deleted.message;
    return id;
  }
  @Post('')
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createCustomer: CreateCustomerDto) {
    const created = await this.createCustomerUseCase.create(createCustomer);
    if (created instanceof DomainError)
      return {
        message: created.message,
        details: created.errorsDetail?.map((m) => m.message),
      };
    return created.id;
  }
  @Put('/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: CreateCustomerDto,
  ) {
    const updated = await this.updateCustomerUseCase.update(
      updateCustomerDto,
      id,
    );
    if (updated instanceof DomainError) return updated.message;
    return updated;
  }
}
