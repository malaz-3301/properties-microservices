import { Module } from '@nestjs/common';
import { FromAnalyticsService } from './from-analytics.service';
import { FromAnalyticsController } from './from-analytics.controller';

@Module({
  controllers: [FromAnalyticsController],
  providers: [FromAnalyticsService],
})
export class FromAnalyticsModule {}
