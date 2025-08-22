import { Module } from '@nestjs/common';
import { FromNotificationsService } from './from-notifications.service';
import { FromNotificationsController } from './from-notifications.controller';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [FromNotificationsController],
  providers: [FromNotificationsService],
})
export class FromNotificationsModule {}
