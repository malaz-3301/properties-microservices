import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { BannedService } from './banned.service';
import { AuditInterceptor } from '@malaz/contracts/utils/interceptors/audit.interceptor';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { UserType } from '@malaz/contracts/utils/enums';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { CreateBannedDto } from '@malaz/contracts/dtos/users/banned/create-banned.dto';


@Controller('banned')
export class BannedController {
  constructor(private readonly bannedService: BannedService) {}

  @Post()
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  create(@Body() createBannedDto: CreateBannedDto) {
    return this.bannedService.create(createBannedDto);
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  findAll() {
    return this.bannedService.findAll();
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannedService.remove(+id);
  }
}
