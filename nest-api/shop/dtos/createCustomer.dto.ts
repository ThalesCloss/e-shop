import { Customer } from '@shop/domain/entities/Customer';
import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCustomerDto implements Customer.CustomerData {
  @ApiProperty({ type: String })
  @IsString()
  name = '';

  @ApiProperty()
  @IsEmail()
  email = '';

  @ApiProperty()
  @IsString()
  gender: Customer.GenderString = 'O';

  @ApiProperty()
  @IsString()
  cpf = '';
}
