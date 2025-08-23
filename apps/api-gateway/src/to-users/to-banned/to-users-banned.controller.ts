import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { UserType } from '@malaz/contracts/utils/enums';
import { AuditInterceptor } from '@malaz/contracts/utils/interceptors/audit.interceptor';
import { CreateBannedDto } from '@malaz/contracts/dtos/users/banned/create-banned.dto';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, retry, timeout } from 'rxjs';

@Controller('banned')
export class ToUsersBannedController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
  ) {}

  @Post('/:userId')
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createBannedDto: CreateBannedDto,
  ) {
    return this.usersClient
      .send('users-banned.create', { userId, createBannedDto })
      .pipe(
        retry(2),
        timeout(5000),
        catchError((err) => {
          throw err;
        }),
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
      catchError((err) => {
        throw err;
      }),
    );
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(AuditInterceptor)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersClient.send('users-banned.remove', id);
  }
}
