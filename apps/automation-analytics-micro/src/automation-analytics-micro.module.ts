import { Module } from '@nestjs/common';
import { CronModule } from './cron/cron.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module';
import { JwtConfigModule } from '@malaz/contracts/modules/set/jwt-config.module';
import { ConfigSetModule } from '@malaz/contracts/modules/set/config-set.module';
import { FromRpcToAnalyticsModule } from './a-from-rpc-to-analytics/from-rpc-to-analytics.module'; // يجب أن يكون هكذا

@Module({
  imports: [
    CronModule,
    AnalyticsModule,
    JwtConfigModule,
    ConfigSetModule,
    I18nSetModule,
    FromRpcToAnalyticsModule,
  ],
  controllers: [],
})
export class AutomationAnalyticsMicroModule {}
