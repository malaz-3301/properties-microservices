import { forwardRef, Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsMicroModule } from '../../../notifications-micro/src/notifications-micro.module';
import { PropertiesModule } from '../../../properties-micro/src/properties/properties.module';

@Module({
  imports: [
    forwardRef(() => NotificationsMicroModule),

    TypeOrmModule.forFeature([Contract]),
    UsersModule,
    forwardRef(() => NotificationsMicroModule),
    forwardRef(() => PropertiesModule),
    UsersModule,
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
