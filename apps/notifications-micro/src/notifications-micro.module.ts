import { forwardRef, Module } from '@nestjs/common';
import { NotificationsMicroController } from './notifications-micro.controller';
import { NotificationsMicroService } from './notifications-micro.service';
import { ContractsModule } from '../../users-micro/src/contracts/contracts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../users-micro/src/users/users.module';
import { AuthMicroModule } from '../../auth-micro/src/auth-micro.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module';
import { NotificationMicro } from './entities/notification-micro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationMicro]),
    forwardRef(() => ContractsModule),
    forwardRef(() => AuthMicroModule),
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    I18nSetModule,
  ],
  controllers: [NotificationsMicroController],
  providers: [NotificationsMicroService],
  exports: [NotificationsMicroService],
})
export class NotificationsMicroModule {}
