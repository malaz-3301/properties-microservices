
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PropertyStatus } from '@malaz/contracts/utils/enums';

export class UpdateProAdminDto {
  @IsNotEmpty()
  @IsEnum(PropertyStatus)
  status: PropertyStatus;
}
