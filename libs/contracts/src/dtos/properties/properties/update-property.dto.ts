import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';
import { IsEmpty, IsEnum } from 'class-validator';


export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  //Empty
  @IsEmpty()
  status: any;
}
