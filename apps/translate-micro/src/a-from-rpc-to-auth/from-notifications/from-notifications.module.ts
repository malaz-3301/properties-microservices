import { Module } from '@nestjs/common';
import { FromNotificationsController } from './from-notifications.controller';
import { TranslateService } from './from-notifications.service';

@Module({
  controllers: [FromNotificationsController],
  providers: [TranslateService],
})
export class FromNotificationsModule {}
