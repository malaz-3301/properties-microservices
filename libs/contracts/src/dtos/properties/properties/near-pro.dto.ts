import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';


export class NearProDto {
  //لازم string لان كويري
  @IsNotEmpty()
  @IsString()
  lon: number;
  //longitude

  @IsNotEmpty()
  @IsString()
  lat: number;
  //latitude

  @IsNotEmpty()
  @IsString()
  distanceKm: number;
}
