import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { PlanType } from '@malaz/contracts/utils/enums';

export class CreatePlanDto {
  @IsNotEmpty()
  planDuration: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 140)
  description: string;

  @IsNotEmpty()
  @IsEnum(PlanType)
  planType: PlanType;

  @IsNotEmpty()
  @IsNumber()
  planPrice: number;

  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
