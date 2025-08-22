import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { UpdateNotificationDto } from '@malaz/contracts/dtos/notification/update-notification.dto';
import { CreateNotificationDto } from '@malaz/contracts/dtos/notification/create-notification.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('notifications')
export class ToNotificationsController {
  constructor(
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
  ) {} // أي اسم client

  @Post('mark_as_read')
  @UseGuards(AuthGuard)
  markAsRead(
    @Body('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayloadType,
  ) {
    // return this.notificationsService.markAsRead(user.id, id);
  }

  @Post('mark_all_as_read')
  @UseGuards(AuthGuard)
  markAllAsRead(@CurrentUser() user: JwtPayloadType) {
    //return this.notificationsService.markAllAsRead(user.id);
  }

  @Get('unread_notifications')
  @UseGuards(AuthGuard)
  getUnreadNotification(@CurrentUser() user: JwtPayloadType) {
    // return this.notificationsService.getUnreadNotifications(user.id);
  }

  @Get('read_notification')
  @UseGuards(AuthGuard)
  getReadNotification(@CurrentUser() user: JwtPayloadType) {
    // return this.notificationsService.getReadNotifications(user.id);
  }

  @Get('all_my_notifications')
  @UseGuards(AuthGuard)
  getMyNotifications(@CurrentUser() user: JwtPayloadType) {
    // return this.notificationsService.getMyNotifications(user.id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    // return this.notificationsService.create(createNotificationDto, user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    //return this.notificationsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    // return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    // return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    // return this.notificationsService.remove(id);
  }
}
