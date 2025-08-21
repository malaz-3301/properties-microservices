
import { Column } from 'typeorm';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { PlanDuration, PlanType } from '@malaz/contracts/utils/enums';

export class CreatePlanDto {
  @IsNotEmpty()
  @IsEnum(PlanDuration)
  planDuration: PlanDuration;

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
