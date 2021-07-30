import { PrimaryColumn, Entity, Column } from 'typeorm';
import { Customer as DomainEntity } from '@shop/domain/entities/Customer';
@Entity()
export class Customer {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  cpf: string;

  @Column('enum', { enum: DomainEntity.Gender })
  gender: DomainEntity.Gender;

  constructor(customer?: Customer) {
    this.id = customer?.id ?? '';
    this.name = customer?.name ?? '';
    this.email = customer?.email ?? '';
    this.cpf = customer?.cpf ?? '';
    this.gender = customer?.gender ?? DomainEntity.Gender.O;
  }
}
