import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { UserType } from '@malaz/contracts/utils/enums';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { CreatePlanDto } from '@malaz/contracts/dtos/commerce/plans/create-plan.dto';
import { UpdatePlanDto } from '@malaz/contracts/dtos/commerce/plans/update-plan.dto';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, retry, timeout } from 'rxjs';

@Controller('plans')
export class ToCommercePlansController {
  constructor(
    @Inject('COMMERCE_SERVICE') private readonly commerceClient: ClientProxy,
  ) {} // أي اسم client

  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.Financial)
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.commerceClient.send('commerce.createPlan', createPlanDto).pipe(
      retry(2),
      timeout(5000),
      catchError((err) => {
        throw err;
      }),
    );
  }

  @Post('back')
  create_back_planes() {
    return this.commerceClient
      .send('plans.createBack', {})
      .pipe(retry(2), timeout(5000));
  }

  @Patch(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.Financial)
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.commerceClient
      .send('commerce.updatePlan', { id: +id, updatePlanDto })
      .pipe(
        retry(2),
        timeout(5000),
        catchError((err) => {
          throw err;
        }),
      );
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@CurrentUser() user: JwtPayloadType) {
    return this.commerceClient
      .send('commerce.findAllPlans', { userId: user.id })
      .pipe(
        retry(2),
        timeout(5000),
        catchError((err) => {
          throw err;
        }),
      );
  }
}
