import { Controller } from '@nestjs/common';
import { NotificationsMicroService } from './notifications-micro.service';
import { Payload, MessagePattern } from '@nestjs/microservices';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { CreateNotificationDto } from '@malaz/contracts/dtos/notification/create-notification.dto';
import { UpdateNotificationDto } from '@malaz/contracts/dtos/notification/update-notification.dto';

@Controller()
export class NotificationsMicroController {
  constructor(private readonly notificationsMicroService: NotificationsMicroService) {}

  @MessagePattern('notifications.markAsRead')
  async markAsRead(@Payload() payload: { id: number; user: JwtPayloadType }) {
    return this.notificationsMicroService.markAsRead(payload.user.id, payload.id);
  }

  @MessagePattern('notifications.markAllAsRead')
  async markAllAsRead(@Payload() payload: { user: JwtPayloadType }) {
    return this.notificationsMicroService.markAllAsRead(payload.user.id);
  }

  @MessagePattern('notifications.unread')
  async getUnreadNotification(@Payload() payload: { user: JwtPayloadType }) {
    return this.notificationsMicroService.getUnreadNotifications(payload.user.id);
  }

  @MessagePattern('notifications.read')
  async getReadNotification(@Payload() payload: { user: JwtPayloadType }) {
    return this.notificationsMicroService.getReadNotifications(payload.user.id);
  }

  @MessagePattern('notifications.allMy')
  async getMyNotifications(@Payload() payload: { user: JwtPayloadType }) {
    return this.notificationsMicroService.getMyNotifications(payload.user.id);
  }

  @MessagePattern('notifications.create')
  async create(@Payload() payload: { createNotificationDto: CreateNotificationDto; user: JwtPayloadType }) {
    return this.notificationsMicroService.create(payload.createNotificationDto, payload.user.id);
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
  async update(@Payload() payload: { id: number; updateNotificationDto: UpdateNotificationDto }) {
    return this.notificationsMicroService.update(payload.id, payload.updateNotificationDto);
  }

  @MessagePattern('notifications.remove')
  async remove(@Payload() payload: { id: number }) {
    return this.notificationsMicroService.remove(payload.id);
  }
}
