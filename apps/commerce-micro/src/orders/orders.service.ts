import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from '../plans/entities/plan.entity';
import { Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { Order } from './entities/order.entity';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, retry, timeout } from 'rxjs';
import { OrderStatus } from '@malaz/contracts/utils/enums';
import { SpaceRemitDto } from '@malaz/contracts/dtos/commerce/orders/space-remit.dto';
import { CreatePlanOrderDto } from '@malaz/contracts/dtos/commerce/orders/create-plan-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateCommOrderDto } from '@malaz/contracts/dtos/commerce/orders/create-comm-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
    @Inject('PROPERTIES_SERVICE')
    private readonly propertiesClient: ClientProxy,
    private readonly configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async createPlanStripe(
    createPlanOrderDto: CreatePlanOrderDto,
    userId: number,
  ) {
    const plan = await this.planRepository.findOneBy({
      id: createPlanOrderDto.planId,
    });
    if (!plan) {
      throw new UnauthorizedException('Unauthorized');
    }
    const unit = plan?.planDuration.split('_')[1] ?? null;

    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'EasyRent',
              description: `${plan.multi_description['ar']}`,
              images: [
                'https://i.postimg.cc/bJ8Sptcm/Chat-GPT-Image-29-2025-10-17-36.png', // ← هنا رابط الصورة
              ],
            },
            unit_amount: plan.planPrice * 100,
            recurring: {
              interval: unit as 'day' | 'week' | 'month' | 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: createPlanOrderDto.dataAfterPayment.success_url,
      cancel_url: createPlanOrderDto.dataAfterPayment.cancel_url,
      client_reference_id: `${userId}`,
      metadata: {
        planId: String(plan.id),
        userId: String(userId),
      },
    });
  }

  ///////
  async createCommissionStrip(createCommOrderDto: CreateCommOrderDto) {
    const property = await lastValueFrom(
      this.propertiesClient
        .send('properties.findById', { proId: createCommOrderDto.proId })
        .pipe(retry(2), timeout(5000)),
    );

    //لان يقيس بالسنت ولا بقل الا عدد صحيح
    const amount = Math.round((property.propertyCommissionRate ?? 1) * 100);
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'EasyRent',
              description: `${property.multi_title['ar']}\n${property.multi_description['ar']}`,
              images: [
                'https://i.postimg.cc/bJ8Sptcm/Chat-GPT-Image-29-2025-10-17-36.png', // ← هنا رابط الصورة
              ],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: createCommOrderDto.dataAfterPayment.success_url,
      cancel_url: createCommOrderDto.dataAfterPayment.cancel_url,
      metadata: {
        proId: String(property.id),
      },
    });
  }

  async createHook(body: any, signature: any) {
    const webhookSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';
    let event: Stripe.Event | undefined;
    //فك تشفير الجلسة
    console.log('aaaaaaaaaaaa');
    console.log(body);
    console.log(signature);
    console.log(webhookSecret);
    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Webhook Error: ${error.message}`,
      });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        console.log(event.type);
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata ?? {};

        if (session.mode === 'subscription') {
          console.log('ccccccc');
          const customerId = session.customer;
          const subscriptionId = session.subscription;
          const userId = parseInt(metadata.userId);
          const planId = parseInt(metadata.planId);
          console.log('اشتراك ناجح');
          console.log('Customer ID:', customerId);
          console.log('Subscription ID:', subscriptionId);
          await this.setPlanExp(userId, planId);
          //عمولة
        } else if (session.mode === 'payment') {
          const proId = parseInt(metadata.proId);
          console.log(' دفعة عمولة ناجحة للعقار', proId);
          await this.markCommissionPaid(proId);
        }
        break;
      }
      default:
        console.log(`${event.type}`);
    }
    return 'Done ! Subscription ';
  }

  async setPlanExp(userId: number, planId: number) {
    const plan = await this.planRepository.findOne({
      where: { id: planId },
      select: { planDuration: true },
    });
    //مدة صلاحية + الوقت الحالي
    let durationMs: number;
    const [numStr, unit] = plan?.planDuration.split('_') ?? [];
    switch (unit) {
      case 'day':
        durationMs = parseInt(numStr) * 24 * 60 * 60 * 1000;
        break;
      case 'week':
        durationMs = parseInt(numStr) * 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        durationMs = parseInt(numStr) * 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        throw new Error(`Unsupported time unit: ${unit}`);
    }
    //make it
    //  planExpiresAt: new Date(Date.now() + durationMs),
    const order = this.orderRepository.create({
      plan: { id: planId },
      user: { id: userId },
      planStatus: OrderStatus.ACTIVE,
      planExpiresAt: new Date(Date.now() + durationMs),
    });
    await this.orderRepository.save(order);
    return this.usersClient.emit('users.setUserPlan', { userId, planId });
  }

  async markCommissionPaid(proId: number) {
    return await lastValueFrom(
      this.propertiesClient
        .send('properties.markCommissionPaid', { proId })
        .pipe(retry(2), timeout(5000)),
    );
  }

  private readonly apiUrl1 = 'https://spaceremit.com/api/v2/payment_info/';

  async getPaymentInfo(spaceRemitDto: SpaceRemitDto) {
    try {
      const response$ = this.httpService.post(this.apiUrl1, spaceRemitDto, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { data } = await firstValueFrom(response$);
      return data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'فشل في جلب معلومات الدفع',
        err.response?.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
