import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetCustomerInteractor } from '@shop/application/customer/GetCustomerInteractor';
import { DeleteCustomerInteractor } from '@shop/application/customer/DeleteCustomerInteractor';
import { AppController } from './app.controller';
import { CustomerController } from './controllers/customer.controllers';
import { Customer } from './infra/repositories/customer/customer.entity';
import { OrmCustomerRepository } from './infra/repositories/customer/OrmCustomerRepository';
import { CreateCustomerInteractor } from '@shop/application/customer/CreateCustomerInteractor';
import { UpdateCustomerInteractor } from '@shop/application/customer/UpdateCustomerInteractor';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_e-shop',
      port: 3306,
      username: 'eshop',
      password: 'eshop',
      database: 'mysql_e-shop',
      entities: [Customer],
      synchronize: true,
    }),
  ],
  providers: [
    {
      provide: 'CustomerRepository',
      useClass: OrmCustomerRepository,
    },
    {
      provide: 'GetManyCustomerRepository',
      useExisting: 'CustomerRepository',
    },
    {
      provide: 'CreateCustomerUseCase',
      useFactory: (repo) => {
        return new CreateCustomerInteractor(repo);
      },
      inject: ['CustomerRepository'],
    },

    {
      provide: 'GetCustomerUseCase',
      useFactory: (repo) => {
        return new GetCustomerInteractor(repo);
      },
      inject: ['CustomerRepository'],
    },
    {
      provide: 'UpdateCustomerUseCase',
      useFactory: (repo, uc) => {
        return new UpdateCustomerInteractor(repo, uc);
      },
      inject: ['CustomerRepository', 'GetCustomerUseCase'],
    },
    {
      provide: 'DeleteCustomerUseCase',
      useFactory: (repo) => {
        return new DeleteCustomerInteractor(repo);
      },
      inject: ['CustomerRepository'],
    },
  ],
  controllers: [AppController, CustomerController],
  exports: [AppModule],
})
export class AppModule {}
