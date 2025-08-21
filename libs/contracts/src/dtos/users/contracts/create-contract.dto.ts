import { IsDate, IsNotEmpty, IsNumber, IsPositive, isPositive, MinDate } from "class-validator";


export class CreateContractDto {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    time : number;
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    propertyId : number;
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    price : number;
}
