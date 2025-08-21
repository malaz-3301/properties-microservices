import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plan } from './entities/plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { UsersModule } from '../../users-micro/src/users/users.module';
import { JwtConfigModule } from '@malaz/contracts/modules/set/jwt-config.module';
import { ConfigSetModule } from '@malaz/contracts/modules/set/config-set.module';
import { UsersModule } from '../../../users-micro/src/users/users.module';
import { Property } from '../../../properties-micro/src/properties/entities/property.entity';

@Module({
  imports: [
    JwtConfigModule,
    ConfigSetModule,
    UsersModule,
    TypeOrmModule.forFeature([Plan, Property]),
  ],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
