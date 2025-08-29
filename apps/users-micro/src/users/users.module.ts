import {
  ClassSerializerInterceptor,
  forwardRef,
  Global,
  Module,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { UsersOtpProvider } from './providers/users-otp.provider';
import { UsersGetProvider } from './providers/users-get.provider';
import { UsersImgProvider } from './providers/users-img.provider';
import { UsersDelProvider } from './providers/users-del.provider';
import { UsersUpdateProvider } from './providers/users-update.provider';
import { OtpEntity } from './entities/otp.entity';
import { AuditModule } from '../audit/audit.module';
import { AgenciesVoViProvider } from './providers/agencies-vo-vi.provider';
import { Statistics } from './entities/statistics.entity';
import { AgencyInfo } from './entities/agency-info.entity';
import { UsersRegisterProvider } from './providers/users-register-provider';

import { GeoQueRpcModule } from '@malaz/contracts/modules/rpc/geo-que-rpc.module';
import { SmsQueRpcModule } from '@malaz/contracts/modules/rpc/sms-que-rpc.module';
import { dataSourceOptions } from '../../../../db/data-source';
import { GeolocationModule } from '../geolocation/geolocation.module';
import { Plan } from '../../../commerce-micro/src/plans/entities/plan.entity';
import { Order } from '../../../commerce-micro/src/orders/entities/order.entity';
import { UsersController } from './controllers/users.controller';
import { UsersAdController } from './controllers/users-ad.controller';
import { UsersAgController } from './controllers/users-ag.controller';
import { PropertiesRpcModule } from '@malaz/contracts/modules/rpc/properties-rpc.module';

@Global()
@Module({
  imports: [
    PropertiesRpcModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([
      User,
      Plan,
      Order,
      OtpEntity,
      Statistics,
      AgencyInfo,
    ]),
    HttpModule,
    GeolocationModule,
    forwardRef(() => AuditModule),
    GeoQueRpcModule, // طلبته ضمن الـ provider
    SmsQueRpcModule, // طلبته ضمن الـ provider
  ],
  controllers: [UsersController, UsersAdController, UsersAgController],
  providers: [
    UsersService,
    UsersRegisterProvider,
    UsersOtpProvider,
    UsersGetProvider,
    UsersImgProvider,
    UsersDelProvider,
    UsersUpdateProvider,
    AgenciesVoViProvider,
    //Exclude()
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [
    UsersService,
    UsersOtpProvider,
    UsersGetProvider,
    UsersUpdateProvider,
    AgenciesVoViProvider,
  ],
})
export class UsersModule {}
