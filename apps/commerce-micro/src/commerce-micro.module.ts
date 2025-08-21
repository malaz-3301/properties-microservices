import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module';
import { OrdersModule } from './orders/orders.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [
    PlansModule,
    OrdersModule,
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
})
export class CommerceMicroModule {}
