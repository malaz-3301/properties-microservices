import { CreateReportDto } from '@malaz/contracts/dtos/reports/create-report.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { retry, timeout } from 'rxjs/operators';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { UserType } from '@malaz/contracts/utils/enums';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';

@Controller('reports')
export class ToReportsController {
  constructor(
    @Inject('REPORTS_SERVICES')
    private readonly reportsClient: ClientProxy,
  ) {}

  @Post()
  report(@Body() createReportDto: CreateReportDto) {
    return this.reportsClient
      .send('reports.create', createReportDto)
      .pipe(retry(2), timeout(5000));
  }

  @Get()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.Financial)
  getAll(@CurrentUser() payload: JwtPayloadType) {
    return this.reportsClient
      .send('reports.getAll', { userId: payload.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('pending')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.Financial)
  getAllPending(@CurrentUser() payload: JwtPayloadType) {
    return this.reportsClient
      .send('reports.getAllPending', { userId: payload.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get(':reportId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.Financial)
  getOne(
    @Param('reportId', ParseIntPipe) reportId: number,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.reportsClient
      .send('reports.getOne', { reportId, userId: payload.id })
      .pipe(retry(2), timeout(5000));
  }

  @Patch(':reportId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.Financial)
  update(
    @Param('reportId', ParseIntPipe) reportId: number,
    @Query('action', ParseBoolPipe) action: boolean,
  ) {
    return this.reportsClient
      .send('reports.update', { reportId, action })
      .pipe(retry(2), timeout(5000));
  }
}
