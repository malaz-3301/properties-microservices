import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GeoEnum } from '@malaz/contracts/utils/enums';



export class GeoProDto {
  @IsNotEmpty()
  @Type(() => Number)
  lon: number;
  //longitude

  @IsNotEmpty()
  @Type(() => Number)
  lat: number;

  @IsNotEmpty()
  @IsEnum(GeoEnum)
  geoLevel: GeoEnum;
}
