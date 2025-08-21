import { Module } from '@nestjs/common';

import { CronService } from './cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Property } from '../../../properties-micro/src/properties/entities/property.entity';
import { View } from '../../../properties-micro/src/views/entities/view.entity';
import { Plan } from '../../../commerce-micro/src/plans/entities/plan.entity';
import { Order } from '../../../commerce-micro/src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Plan, Property, View])],

  providers: [CronService],
})
export class CronModule {}
