import { Controller } from '@nestjs/common';
import { CreateNotificationDto } from '@malaz/contracts/dtos/notification/create-notification.dto';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { NotificationsMicroService } from '../../notifications-micro.service';
import { Contract } from 'apps/users-micro/src/contracts/entities/contract.entity';

@Controller()
export class FromUsersController {
  constructor(
    private readonly notificationsMicroService: NotificationsMicroService,
  ) {}
  @EventPattern('notifications.sendNotificationForAllSidesInProperties')
  async create(
    @Payload()
    payload: {
      contract: Contract;
      message: string;
    },
  ) {
    console.log('notification controller');
    return this.notificationsMicroService.sendNotificationForAllSidesInProperties(
      payload.contract,
      payload.message,
    );
  }
}
