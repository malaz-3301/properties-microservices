import { Module } from '@nestjs/common';
import { FromAuthModule } from './from-auth/from-auth.module';
import { FromAnalyticsModule } from './from-analytics/from-analytics.module';
import { FromCommerceModule } from './from-commerce/from-commerce.module';
import { FromNotificationsModule } from './from-notifications/from-notifications.module';
import { FromReportsModule } from './from-reports/from-reports.module';
import { FromUsersModule } from './from-users/from-users.module';

@Module({
  imports: [
    FromAuthModule,
    FromAnalyticsModule,
    FromCommerceModule,
    FromNotificationsModule,
    FromReportsModule,
    FromUsersModule,
  ],
})
export class FromRpcToPropertiesModule {}
