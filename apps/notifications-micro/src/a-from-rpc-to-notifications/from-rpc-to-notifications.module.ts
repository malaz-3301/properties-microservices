import { forwardRef, Module } from '@nestjs/common';
import { FromAuthModule } from './from-auth/from-auth.module';
import { FromAnalyticsModule } from './from-analytics/from-analytics.module';
import { FromCommerceModule } from './from-commerce/from-commerce.module';
import { FromPropertiesModule } from './from-properties/from-properties.module';
import { FromReportsModule } from './from-reports/from-reports.module';
import { NotificationsMicroModule } from '../notifications-micro.module';
import { FromUsersController } from './from-users/from-users.controller';

@Module({
  imports: [
    forwardRef(() => NotificationsMicroModule)
  ],
  controllers : [FromUsersController]
})
export class FromRpcToNotificationsModule {}
