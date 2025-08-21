import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { Body, Controller, Get, Inject, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { UserType } from '@malaz/contracts/utils/enums';
import { AuditInterceptor } from '@malaz/contracts/utils/interceptors/audit.interceptor';
import { CreateBannedDto } from '@malaz/contracts/dtos/users/banned/create-banned.dto';
import { ClientProxy } from '@nestjs/microservices';
import { retry, timeout, catchError } from 'rxjs';

@Controller('to-users-banned')
export class ToUsersBannedController {
  constructor(@Inject('USERS_SERVICES')
              private readonly usersClient: ClientProxy) {}

  @Post()
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  create(@Body() createBannedDto: CreateBannedDto) {
    return this.usersClient.send('users-banned.create', createBannedDto).pipe(
      retry(2),
      timeout(5000),
      catchError(err => { throw err; }),
    );
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  findAll() {
    return this.usersClient.send('users-banned.findAll', {}).pipe(
      retry(2),
      timeout(5000),
      catchError(err => { throw err; }),
    );
  }
}
