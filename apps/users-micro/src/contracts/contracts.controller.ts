import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { CreateContractDto } from '@malaz/contracts/dtos/users/contracts/create-contract.dto';
import { UpdateContractDto } from '@malaz/contracts/dtos/users/contracts/update-contract.dto';


@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@CurrentUser() user: JwtPayloadType, @Body() createContractDto: CreateContractDto) {
    return this.contractsService.create(user.id, createContractDto);
  }

  @Get('active')
  @UseGuards(AuthGuard)
  getMyActiveContracts(@CurrentUser() user: JwtPayloadType) {
    console.log('ldasfjl');

    console.log(user.id);

    return this.contractsService.getMyActiveContracts(user.id);
  }

  @Get('expired')
  @UseGuards(AuthGuard)
  getMyExpiredContracts(@CurrentUser() user: JwtPayloadType) {
    return this.contractsService.getMyExpiredContracts(user.id);
  }

  @Get('all_my_contracts')
  @UseGuards(AuthGuard)
  getMyContracts(@CurrentUser() user: JwtPayloadType) {
    return this.contractsService.getMyContracts(user.id);
  }

  @Get('less_than_week')
  @UseGuards(AuthGuard)
  expiredaAfterWeekOrLess(@CurrentUser() user: JwtPayloadType) {
    return this.contractsService.MyContractsExpiredAfterWeek(user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.contractsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contractsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(id, updateContractDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contractsService.remove(id);
  }
}
