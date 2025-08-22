import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { UserType } from '@malaz/contracts/utils/enums';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { catchError, lastValueFrom, retry, timeout } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Controller('analytics')
export class ToAnalyticsController {
  constructor(
    @Inject('ANALYTICS_SERVICE') private readonly analyticsClient: ClientProxy,
  ) {}

  @Get()
  @Roles(UserType.SUPER_ADMIN, UserType.Financial)
  @UseGuards(AuthRolesGuard)
  async findAll() {
    console.log('ddd');
    return await lastValueFrom(
      this.analyticsClient.send('analytics.findAll', {}).pipe(
        retry(2),
        timeout(5000),
        catchError((err) => {
          throw err;
        }),
      ),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await lastValueFrom(
      this.analyticsClient
        .send('analytics.findOne', { id: +id })
        .pipe(retry(2), timeout(5000)),
    );
  }
}
