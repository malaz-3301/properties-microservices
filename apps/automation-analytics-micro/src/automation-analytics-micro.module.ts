import { Module } from '@nestjs/common';
import { CronModule } from './cron/cron.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module'; // يجب أن يكون هكذا

@Module({
  imports: [CronModule , AnalyticsModule,JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return {
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      };
    },

  })   , ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env`,
  }), I18nSetModule],
  controllers: [],

})
export class AutomationAnalyticsMicroModule {}
