import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { UserType } from '@malaz/contracts/utils/enums';
import { AuditInterceptor } from '@malaz/contracts/utils/interceptors/audit.interceptor';
import { ClientProxy } from '@nestjs/microservices';
import { retry, timeout } from 'rxjs/operators';

@Controller('votes')
export class ToPropertiesVotesController {
  constructor(
    @Inject('PROPERTIES_SERVICE')
    private readonly propertiesClient: ClientProxy,
  ) {}

  @Post(':proId/:value')
  @UseGuards(AuthGuard)
  create(
    @Param('proId', ParseIntPipe) proId: number,
    @Param('value', ParseIntPipe) value: number,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('votes.changeStatus', { proId, value, userId: user.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('who-voted/:proId')
  @UseGuards(AuthGuard)
  getUsersVotedUp(@Param('proId', ParseIntPipe) proId: number) {
    return this.propertiesClient
      .send('votes.getUsersVotedUp', { proId })
      .pipe(retry(2), timeout(5000));
  }

  @Get('spammers')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @UseInterceptors(AuditInterceptor)
  getVoteSpammers() {
    return this.propertiesClient
      .send('votes.getSpammers', {})
      .pipe(retry(2), timeout(5000));
  }
}
