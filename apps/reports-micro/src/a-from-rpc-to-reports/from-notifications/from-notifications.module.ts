import { Module } from '@nestjs/common';
import { FromNotificationsService } from './from-notifications.service';
import { FromNotificationsController } from './from-notifications.controller';

@Module({
  controllers: [FromNotificationsController],
  providers: [FromNotificationsService],
})
export class FromNotificationsModule {}
