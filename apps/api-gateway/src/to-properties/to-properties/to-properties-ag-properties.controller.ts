import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { UserType } from '@malaz/contracts/utils/enums';
import { AuditInterceptor } from '@malaz/contracts/utils/interceptors/audit.interceptor';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { retry, timeout } from 'rxjs/operators';
import { EditProAgencyDto } from '@malaz/contracts/dtos/properties/properties/edit-pro-agency.dto';

@Controller('properties-ag')
export class ToPropertiesAgPropertiesController {
  constructor(
    @Inject('PROPERTIES_SERVICE')
    private readonly propertiesClient: ClientProxy,
  ) {}

  @Get('my')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.AGENCY)
  @UseInterceptors(AuditInterceptor)
  getAgencyPros(
    @Query() query: FilterPropertyDto,
    @CurrentUser() agency: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('properties.getAgencyPros', { query, agencyId: agency.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('pending')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.AGENCY)
  @UseInterceptors(AuditInterceptor)
  getAllPendingAgency(
    @Query() query: FilterPropertyDto,
    @CurrentUser() agency: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('properties.getPendingAgency', { query, agencyId: agency.id })
      .pipe(retry(2), timeout(5000));
  }

  @Patch(':proId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.AGENCY)
  @UseInterceptors(AuditInterceptor)
  updateAgencyPro(
    @Param('proId', ParseIntPipe) proId: number,
    @CurrentUser() agency: JwtPayloadType,
    @Body() editProAgencyDto: EditProAgencyDto,
  ) {
    return this.propertiesClient
      .send('properties.updateAgency', {
        proId,
        agencyId: agency.id,
        editProAgencyDto,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Patch('acc/:proId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.AGENCY)
  @UseInterceptors(AuditInterceptor)
  acceptAgencyPro(
    @Param('proId', ParseIntPipe) proId: number,
    @CurrentUser() agency: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('properties.acceptAgency', { proId, agencyId: agency.id })
      .pipe(retry(2), timeout(5000));
  }

  @Patch('rej/:id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.AGENCY)
  @UseInterceptors(AuditInterceptor)
  rejectAgencyPro(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() agency: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('properties.rejectAgency', { id, agencyId: agency.id })
      .pipe(retry(2), timeout(5000));
  }

  /*  @Delete('delete')
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.AGENCY)
    @UseInterceptors(AuditInterceptor)
    deleteAgencyPro(
      @Param('proId', ParseIntPipe) proId: number,
      @CurrentUser() agency: JwtPayloadType,
    ) {
      return this.propertiesService.deleteProById(proId);
    }*/
}
