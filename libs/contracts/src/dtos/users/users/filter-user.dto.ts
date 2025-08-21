import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserType } from '@malaz/contracts/utils/enums';


export class FilterUserDto {
  @IsOptional()
  @IsString()
  word?: string;
  
  @IsOptional()
  @IsEnum(UserType)
  role: UserType;
}
