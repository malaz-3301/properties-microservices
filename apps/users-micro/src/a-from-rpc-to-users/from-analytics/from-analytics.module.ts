import { Module } from '@nestjs/common';
import { FromAnalyticsService } from './from-analytics.service';
import { FromAnalyticsController } from './from-analytics.controller';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [FromAnalyticsController],
  providers: [FromAnalyticsService],
})
export class FromAnalyticsModule {}
