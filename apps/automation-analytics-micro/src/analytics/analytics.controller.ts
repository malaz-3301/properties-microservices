import { Controller } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RetryHandler } from '@malaz/contracts/decorators/Retry-Handler';
import { CreateAnalyticsDto } from '@malaz/contracts/dtos/analytics/create-analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @MessagePattern('analytics.create')
  @RetryHandler(3)
  create(@Payload() createAnalyticsDto: CreateAnalyticsDto) {
    return this.analyticsService.create(createAnalyticsDto);
  }

  @MessagePattern('analytics.findAll')
  findAll(@Ctx() ctx: RmqContext) {
    return this.analyticsService.findAll();
  }

  @MessagePattern('analytics.findOne')
  findOne(@Payload() payload: { id: number }) {
    return this.analyticsService.findOne(payload.id);
  }
}
