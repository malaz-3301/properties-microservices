import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePlanOrderDto } from '@malaz/contracts/dtos/commerce/orders/create-plan-order.dto';
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
    console.log('createHook');
    const { body } = payload;
    let rawBuffer: Buffer;

    //  gateway أرسل Buffer كمصفوفة bytes (JSONified)
    if (body && body.type === 'Buffer' && Array.isArray(body.data)) {
      rawBuffer = Buffer.from(body.data);
    }
    // حالة: gateway أرسل base64 (مفضل) في حقل rawBodyBase64
    else if (body && typeof body.rawBodyBase64 === 'string') {
      rawBuffer = Buffer.from(body.rawBodyBase64, 'base64');
    }
    // حالة: body كـ string (أحيانًا)
    else if (typeof body === 'string') {
      rawBuffer = Buffer.from(body);
    }
    // حالة افتراضية: fallback — حوّل الـ object إلى JSON string (قد يفشل التوقيع إن لم تكن البتات الأصلية محفوظة)
    else {
      rawBuffer = Buffer.from(JSON.stringify(body));
    }

    return this.ordersService.createHook(rawBuffer, payload.signature);
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
