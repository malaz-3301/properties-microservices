import {
  Body,
  Controller,
  Delete,
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
import { PropertyStatus, UserType } from '@malaz/contracts/utils/enums';
import { AuditInterceptor } from '@malaz/contracts/utils/interceptors/audit.interceptor';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { retry, timeout } from 'rxjs/operators';
import { UpdateProAdminDto } from '@malaz/contracts/dtos/properties/properties/update-pro-admin.dto';

@Controller('properties-ad')
export class ToPropertiesAdPropertiesController {
  constructor(
    @Inject('PROPERTIES_SERVICE')
    private readonly propertiesClient: ClientProxy,
  ) {}

  @Get()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseInterceptors(AuditInterceptor)
  getAll(
    @Query() query: FilterPropertyDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('properties.getAll', { query, userId: payload.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('pending')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseInterceptors(AuditInterceptor)
  getAllPending(
    @Query() query: FilterPropertyDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    query.status = PropertyStatus.PENDING;
    return this.propertiesClient
      .send('properties.getAllPending', { query, userId: payload.id })
      .pipe(retry(2), timeout(5000));
  }

  @Patch(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseInterceptors(AuditInterceptor)
  updateAdminPro(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProAdminDto: UpdateProAdminDto,
  ) {
    return this.propertiesClient
      .send('properties.updateAdmin', { id, updateProAdminDto })
      .pipe(retry(2), timeout(5000));
  }

  @Delete('delete')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseInterceptors(AuditInterceptor)
  deleteAdminPro(@Param('id') id: string) {
    return this.propertiesClient
      .send('properties.deleteAdminPro', { id: +id })
      .pipe(retry(2), timeout(5000));
  }
}
