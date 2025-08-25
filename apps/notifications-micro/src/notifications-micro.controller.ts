import { Controller } from '@nestjs/common';
import { NotificationsMicroService } from './notifications-micro.service';
import { Payload, MessagePattern } from '@nestjs/microservices';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { CreateNotificationDto } from '@malaz/contracts/dtos/notification/create-notification.dto';
import { UpdateNotificationDto } from '@malaz/contracts/dtos/notification/update-notification.dto';

@Controller()
export class NotificationsMicroController {
  constructor(
    private readonly notificationsMicroService: NotificationsMicroService,
  ) {}

  @MessagePattern('notifications.markAsRead')
  async markAsRead(@Payload() payload: { id: number; userId: number }) {
    return this.notificationsMicroService.markAsRead(
      payload.userId,
      payload.id,
    );
  }

  @MessagePattern('notifications.markAllAsRead')
  async markAllAsRead(@Payload() payload: { userId: number }) {
    return this.notificationsMicroService.markAllAsRead(payload.userId);
  }

  @MessagePattern('notifications.unread')
  async getUnreadNotification(@Payload() payload: { userId: number }) {
    return this.notificationsMicroService.getUnreadNotifications(
      payload.userId,
    );
  }

  @MessagePattern('notifications.read')
  async getReadNotification(@Payload() payload: { userId: number }) {
    return this.notificationsMicroService.getReadNotifications(payload.userId);
  }

  @MessagePattern('notifications.allMy')
  async getMyNotifications(@Payload() payload: { userId: number }) {
    return this.notificationsMicroService.getMyNotifications(payload.userId);
  }

  @MessagePattern('notifications.create')
  async create(
    @Payload()
    payload: {
      createNotificationDto: CreateNotificationDto;
      userId: number;
    },
  ) {
    return this.notificationsMicroService.create(
      payload.createNotificationDto,
      payload.userId,
    );
  }

  @MessagePattern('notifications.findAll')
  async findAll() {
    return this.notificationsMicroService.findAll();
  }

  @MessagePattern('notifications.findOne')
  async findOne(@Payload() payload: { id: number }) {
    return this.notificationsMicroService.findOne(payload.id);
  }

  @MessagePattern('notifications.update')
  async update(
    @Payload()
    payload: {
      id: number;
      updateNotificationDto: UpdateNotificationDto;
    },
  ) {
    return this.notificationsMicroService.update(
      payload.id,
      payload.updateNotificationDto,
    );
  }

  @MessagePattern('notifications.remove')
  async remove(@Payload() payload: { id: number }) {
    return this.notificationsMicroService.remove(payload.id);
  }
}
