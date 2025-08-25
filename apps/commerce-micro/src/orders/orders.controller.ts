import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePlanOrderDto } from '@malaz/contracts/dtos/commerce/orders/create-plan-order.dto';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { SpaceRemitDto } from '@malaz/contracts/dtos/commerce/orders/space-remit.dto';

@Controller('webhook')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('orders.createPlanStripe')
  createPlanStripe(
    @Payload()
    payload: {
      createPlanOrderDto: CreatePlanOrderDto;
      userId: number;
    },
  ) {
    return this.ordersService.createPlanStripe(
      payload.createPlanOrderDto,
      payload.userId,
    );
  }

  @MessagePattern('orders.createHook')
  createHook(@Payload() payload: { body: any; signature: string }) {
    return 'stopped';
    //  return this.ordersService.createHook(payload.body, payload.signature);
  }

  @MessagePattern('orders.getPaymentInfo')
  info(@Payload() payload: { spaceRemitDto: SpaceRemitDto }) {
    return this.ordersService.getPaymentInfo(payload.spaceRemitDto);
  }

  /*
  // يمكن دعم الطلبات الأخرى لاحقًا
  @MessagePattern('orders.createCommissionStripe')
  createCommissionStripe(@Payload() payload: { createCommOrderDto: CreateCommOrderDto }) {
    return this.ordersService.createCommissionStrip(payload.createCommOrderDto);
  }
  */
}
