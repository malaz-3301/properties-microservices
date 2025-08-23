import { Module } from '@nestjs/common';
import { DuplicateController } from './duplicate/duplicate.controller';
import { FromAnalyticsController } from './from-analytics/from-analytics.controller';
import { FromAuthController } from './from-auth/from-auth.controller';
import { FromCommerceController } from './from-commerce/from-commerce.controller';
import { FromPropertiesController } from './from-properties/from-properties.controller';
import { FromReportsController } from './from-reports/from-reports.controller';

@Module({
  controllers: [
    DuplicateController,
    FromAnalyticsController,
    FromAuthController,
    FromCommerceController,
    FromPropertiesController,
    FromReportsController,
  ],
})
export class FromRpcToUsersModule {}
