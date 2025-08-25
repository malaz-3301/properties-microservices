import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { UserType } from '@malaz/contracts/utils/enums';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreatePlanOrderDto } from '@malaz/contracts/dtos/commerce/orders/create-plan-order.dto';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { SpaceRemitDto } from '@malaz/contracts/dtos/commerce/orders/space-remit.dto';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, retry, timeout } from 'rxjs';

@Controller('orders')
export class ToCommerceOrdersController {
  constructor(
    @Inject('COMMERCE_SERVICE') private readonly commerceClient: ClientProxy,
  ) {} // أي اسم client

  @Post()
  @Roles(UserType.AGENCY)
  @UseGuards(AuthRolesGuard)
  @Throttle({ default: { ttl: 10000, limit: 5 } })
  createPlanStripe(
    @Body() createPlanOrderDto: CreatePlanOrderDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.commerceClient
      .send('orders.createPlanStripe', {
        createPlanOrderDto,
        userId: user.id,
      })
      .pipe(
        retry(2),
        timeout(5000),
        catchError((err) => {
          throw err;
        }),
      );
  }

  /*
    @Post('commission')
    @UseGuards(AuthGuard)
    @Throttle({ default: { ttl: 10000, limit: 5 } })
    createCommissionStripe(@Body() createCommOrderDto: CreateCommOrderDto) {
      return this.commerceClient.send('commerce.createCommissionStripe', createCommOrderDto).pipe(
        retry(2),
        timeout(5000),
        catchError(err => { throw err; }),
      );
    }
  */

  @Post('/stripe')
  @SkipThrottle()
  @HttpCode(200)
  async createHook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    const body = req.body;
    return this.commerceClient
      .send('orders.createHook', { body, signature })
      .pipe(
        retry(2),
        timeout(5000),
        catchError((err) => {
          throw err;
        }),
      );
  }

  @Post('info')
  info(@Body() spaceRemitDto: SpaceRemitDto) {
    return this.commerceClient
      .send('orders.getPaymentInfo', spaceRemitDto)
      .pipe(
        retry(2),
        timeout(5000),
        catchError((err) => {
          throw err;
        }),
      );
  }
}
