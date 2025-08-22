import { Module } from '@nestjs/common';
import { FromAnalyticsModule } from './from-analytics/from-analytics.module';
import { FromCommerceModule } from './from-commerce/from-commerce.module';
import { FromNotificationsModule } from './from-notifications/from-notifications.module';
import { FromPropertiesModule } from './from-properties/from-properties.module';
import { FromReportsModule } from './from-reports/from-reports.module';
import { FromUsersModule } from './from-users/from-users.module';

@Module({
  imports: [
    FromAnalyticsModule,
    FromCommerceModule,
    FromNotificationsModule,
    FromPropertiesModule,
    FromReportsModule,
    FromUsersModule,
  ],
})
export class FromRpcToAuthModule {}
