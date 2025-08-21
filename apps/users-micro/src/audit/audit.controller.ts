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
import { AuditService } from './audit.service';
import { UserType } from '@malaz/contracts/utils/enums';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';


@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(AuthGuard)
  findAll() {
    return this.auditService.findAll();
  }

  @Get(':id')
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditService.findOne(id);
  }
}
