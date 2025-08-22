import { Controller } from '@nestjs/common';
import { FromAnalyticsService } from './from-analytics.service';

@Controller()
export class FromAnalyticsController {
  constructor(private readonly fromAnalyticsService: FromAnalyticsService) {}
}
