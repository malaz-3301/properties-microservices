import { Module } from '@nestjs/common';
import { FromAuthModule } from './from-auth/from-auth.module';
import { FromCommerceModule } from './from-commerce/from-commerce.module';
import { FromNotificationsModule } from './from-notifications/from-notifications.module';
import { FromPropertiesModule } from './from-properties/from-properties.module';
import { FromReportsModule } from './from-reports/from-reports.module';
import { FromUsersModule } from './from-users/from-users.module';

@Module({
  imports: [
    FromAuthModule,
    FromCommerceModule,
    FromNotificationsModule,
    FromPropertiesModule,
    FromReportsModule,
    FromUsersModule,
  ],
})
export class FromRpcToAnalyticsModule {}
