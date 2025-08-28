import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { CreateContractDto } from '@malaz/contracts/dtos/users/contracts/create-contract.dto';
import { UpdateContractDto } from '@malaz/contracts/dtos/users/contracts/update-contract.dto';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { UserType } from '@malaz/contracts/utils/enums';
import { AuditInterceptor } from '@malaz/contracts/utils/interceptors/audit.interceptor';
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
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('contracts')
export class ToUsersContractsController {
  constructor(
    @Inject('CONTRACTS_SERVICE') private readonly contractsClient: ClientProxy,
  ) {}

  @Post()
  @Roles(UserType.AGENCY)
  @UseGuards(AuthRolesGuard)
  create(
    @CurrentUser() user: JwtPayloadType,
    @Body() createContractDto: CreateContractDto,
  ) {
    return this.contractsClient.send('contracts.create', {
      userId: user.id,
      createContractDto,
    });
  }

  @Get('active')
  @UseGuards(AuthGuard)
  getMyActiveContracts(@CurrentUser() user: JwtPayloadType) {
    return this.contractsClient.send('contracts.getMyActiveContracts', {
      userId: user.id,
    });
  }

  @Get('expired')
  @UseGuards(AuthGuard)
  getMyExpiredContracts(@CurrentUser() user: JwtPayloadType) {
    return this.contractsClient.send('contracts.getMyExpiredContracts', {
      userId: user.id,
    });
  }

  @Get('all_my_contracts')
  @UseGuards(AuthGuard)
  getMyContracts(@CurrentUser() user: JwtPayloadType) {
    return this.contractsClient.send('contracts.getMyContracts', {
      userId: user.id,
    });
  }

  @Get('less_than_week')
  @UseGuards(AuthGuard)
  expiredaAfterWeekOrLess(@CurrentUser() user: JwtPayloadType) {
    return this.contractsClient.send('contracts.expiredaAfterWeekOrLess', {
      userId: user.id,
    });
  }

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  findAll() {
    return this.contractsClient.send('contracts.findAll', {});
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.contractsClient.send('contracts.findOne', {
      id,
      userType: user.userType,
      userId: user.id,
    });
  }

  @Patch(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractsClient.send('contracts.update', {
      id,
      updateContractDto,
    });
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contractsClient.send('contracts.remove', { id });
  }
}
