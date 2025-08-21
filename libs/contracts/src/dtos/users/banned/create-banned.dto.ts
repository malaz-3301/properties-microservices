import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';


export class CreateBannedDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 80)
  reason: string;

  @IsNotEmpty()
  @IsString()
  banDuration: string;
}
