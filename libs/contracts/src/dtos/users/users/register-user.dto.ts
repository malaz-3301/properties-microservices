import {
  IsAscii,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PointsDto } from '@malaz/contracts/dtos/geolocation/points.dto';


export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 18)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PointsDto)
  pointsDto: PointsDto;

  @IsOptional()
  @IsNumber()
  @Min(16, { message: 'Age must not be less than 16' })
  age?: number;

  @IsString()
  @IsNotEmpty()
  @IsAscii()
  token: string;
}
