import { forwardRef, Module } from '@nestjs/common';
import { NotificationsMicroController } from './notifications-micro.controller';
import { NotificationsMicroService } from './notifications-micro.service';
import { ContractsModule } from '../../users-micro/src/contracts/contracts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../users-micro/src/users/users.module';
import { AuthMicroModule } from '../../auth-micro/src/auth-micro.module';
import { ConfigModule } from '@nestjs/config';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module';
import { NotificationMicro } from './entities/notification-micro.entity';
import { JwtConfigModule } from '@malaz/contracts/modules/set/jwt-config.module';
import { FromRpcToNotificationsModule } from './a-from-rpc-to-notifications/from-rpc-to-notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationMicro]),
    forwardRef(() => ContractsModule),
    forwardRef(() => AuthMicroModule),
    UsersModule,
    JwtConfigModule,
    ConfigModule,
    I18nSetModule,
    FromRpcToNotificationsModule,
  ],
  controllers: [NotificationsMicroController],
  providers: [NotificationsMicroService],
  exports: [NotificationsMicroService],
})
export class NotificationsMicroModule {}
