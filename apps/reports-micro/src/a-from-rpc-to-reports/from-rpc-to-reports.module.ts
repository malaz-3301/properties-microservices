import { Module } from '@nestjs/common';
import { FromUsersController } from './from-users/from-users.controller';
import { FromPropertiesController } from './from-properties/from-properties.controller';
import { FromNotificationsController } from './from-notifications/from-notifications.controller';
import { FromCommerceController } from './from-commerce/from-commerce.controller';
import { FromAuthController } from './from-auth/from-auth.controller';
import { FromAnalyticsController } from './from-analytics/from-analytics.controller';

@Module({
  controllers: [
    FromUsersController,
    FromPropertiesController,
    FromNotificationsController,
    FromCommerceController,
    FromAuthController,
    FromAnalyticsController,
  ],
})
export class FromRpcToReportsModule {}
