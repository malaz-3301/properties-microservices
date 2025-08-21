import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { UserType } from '@malaz/contracts/utils/enums';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { CreatePlanOrderDto } from '@malaz/contracts/dtos/commerce/orders/create-plan-order.dto';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { SpaceRemitDto } from '@malaz/contracts/dtos/commerce/orders/space-remit.dto';
import { OrdersService } from '../../../../../../apps/commerce-micro/src/orders/orders.service';

@Controller('webhook')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserType.AGENCY)
  @UseGuards(AuthRolesGuard)
  @Throttle({ default: { ttl: 10000, limit: 5 } }) // منفصل overwrite
  createPlanStripe(
    @Body() createPlanOrderDto: CreatePlanOrderDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.ordersService.createPlanStripe(createPlanOrderDto, user.id);
  }

  /*
    @Post('commission')
    @UseGuards(AuthGuard)
    @Throttle({ default: { ttl: 10000, limit: 5 } }) // منفصل overwrite
    createCommissionStripe(@Body() createCommOrderDto: CreateCommOrderDto) {
      return this.ordersService.createCommissionStrip(createCommOrderDto);
    }*/

  @Post('/stripe')
  @SkipThrottle()
  @HttpCode(200)
  async createHook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    console.log('stripe webhook');
    const body = req.body;

    await this.ordersService.createHook(body, signature);
  }

  //spaceremit
  @Post('info')
  info(@Body() spaceRemitDto: SpaceRemitDto) {
    return this.ordersService.getPaymentInfo(spaceRemitDto);
  }
}
