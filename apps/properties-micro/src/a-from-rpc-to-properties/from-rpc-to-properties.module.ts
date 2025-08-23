import { Module } from '@nestjs/common';
import { FromUsersController } from './from-users/from-users.controller';
import { FromNotificationsController } from './from-notifications/from-notifications.controller';
import { FromReportsController } from './from-reports/from-reports.controller';
import { FromCommerceController } from './from-commerce/from-commerce.controller';
import { FromAuthController } from './from-auth/from-auth.controller';
import { FromAnalyticsController } from './from-analytics/from-analytics.controller';
import { DuplicateController } from './duplicate/duplicate.controller';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [PropertiesModule],
  controllers: [
    DuplicateController,
    FromUsersController,
    FromNotificationsController,
    FromReportsController,
    FromCommerceController,
    FromAuthController,
    FromAnalyticsController,
  ],
})
export class FromRpcToPropertiesModule {}
