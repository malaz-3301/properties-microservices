import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Plan } from '../plans/entities/plan.entity';

import { HttpModule } from '@nestjs/axios';
import { JwtConfigModule } from '@malaz/contracts/modules/set/jwt-config.module';
import { ConfigSetModule } from '@malaz/contracts/modules/set/config-set.module';
import { StripeModule } from '@malaz/contracts/modules/set/stripe.module';
import { UsersModule } from '../../../users-micro/src/users/users.module';
import { PropertiesModule } from '../../../properties-micro/src/properties/properties.module';

@Module({
  imports: [
    JwtConfigModule,
    ConfigSetModule,
    UsersModule,
    StripeModule,
    PropertiesModule,
    HttpModule,
    TypeOrmModule.forFeature([Order, Plan]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
