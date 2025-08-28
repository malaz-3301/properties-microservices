import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  isPositive,
  IsString,
  length,
  Length,
  MinDate,
} from 'class-validator';

export class CreateContractDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  time: number;
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  propertyId: number;
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;
  @IsString()
  @IsNotEmpty()
  @Length(3, 18)
  username: string;
  @IsString()
  @IsNotEmpty()
  @Length(3, 18)
  ownername: string;
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  userPhone: string;
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  ownerPhone: string;
}
