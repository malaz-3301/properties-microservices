import { Module } from '@nestjs/common';

import { FromAnalyticsController } from './from-analytics.controller';
import { TranslateService } from './from-analytics.service';

@Module({
  controllers: [FromAnalyticsController],
  providers: [TranslateService],
})
export class FromAnalyticsModule {}
