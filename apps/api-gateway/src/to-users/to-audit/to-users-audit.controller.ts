import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserType } from '@malaz/contracts/utils/enums';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, retry, timeout } from 'rxjs';

@Controller('to-users-audit')
export class ToUsersAuditController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
  ) {}

  @Get()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(AuthGuard)
  findAll() {
    return this.usersClient.send('users-audit.findAll', {}).pipe(
      retry(2),
      timeout(5000),
      catchError((err) => {
        throw err;
      }),
    );
  }

  @Get(':id')
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersClient.send('users-audit.findOne', { id }).pipe(
      retry(2),
      timeout(5000),
      catchError((err) => {
        throw err;
      }),
    );
  }
}
