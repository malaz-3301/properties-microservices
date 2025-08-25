import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateNotificationDto } from '@malaz/contracts/dtos/notification/create-notification.dto';
import * as admin from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { UsersGetProvider } from '../../users-micro/src/users/providers/users-get.provider';
import { ContractsService } from '../../users-micro/src/contracts/contracts.service';
import { I18nService } from 'nestjs-i18n';
import { Cron } from '@nestjs/schedule';
import { UpdateNotificationDto } from '@malaz/contracts/dtos/notification/update-notification.dto';
import { Contract } from '../../users-micro/src/contracts/entities/contract.entity';
import { NotificationMicro } from './entities/notification-micro.entity';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class NotificationsMicroService {
  onModuleInit() {
    const configService = new ConfigService();
    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: configService.get('CLIENT_EMAIL'),
        privateKey: configService.get('PRIVATE_KEY').replace(/\\n/g, '\n'),
        projectId: configService.get('PROJECT_ID'),
      }),
    });
  }
  constructor(
    @InjectRepository(NotificationMicro)
    private readonly notificationMicro: Repository<NotificationMicro>,
    private readonly usersGetProvider: UsersGetProvider,
    @Inject(forwardRef(() => ContractsService))
    private readonly contractService: ContractsService,
    private i18nService: I18nService,
    @Inject('USERS_SERVICE')
    private readonly userClient: ClientProxy,
    @Inject('TRANSLATE_SERVICE')
    private readonly translateClient: ClientProxy,
    @Inject('SMS_SERVICE') private readonly client2: ClientProxy,
  ) {}
  private readonly logger = new Logger(NotificationsMicroService.name);
  @Cron('0 30 11 * * *')
  async handleCron() {
    const contracts = await this.contractService.expiredAfterWeek();
    for (let index = 0; index < contracts.length; index++) {
      await this.sendNotificationForAllSidesInProperties(
        contracts[index],
        'EndsOn',
      );
    }
  }
  async create(createNotificationDto: CreateNotificationDto, userId: number) {
    const newNotification = this.notificationMicro.create({
      ...createNotificationDto,
      user: { id: userId },
      readAt: null,
      property: { id: createNotificationDto.propertyId },
    });
    const user = await lastValueFrom(
      await this.userClient.send('users.findById', { id: userId }),
    );
    //  this.usersGetProvider.findById(userId);
    newNotification.usre_language_message =
      // await this.usersGetProvider.translate(
      //   user.language,
      //   createNotificationDto.message,
      // );
      await lastValueFrom(
        await this.translateClient.send('translate.translate', {
          language: user.language,
          text: createNotificationDto.message,
        }),
      );
    await this.sendNotificationToDevice(
      user.token,
      createNotificationDto.title,
      createNotificationDto.message,
    );
    return this.notificationMicro.save(newNotification);
  }
  findAll() {
    return this.notificationMicro.find();
  }
  findOne(id: number) {
    return this.notificationMicro.findOne({ where: { id } });
  }
  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return this.notificationMicro.update(id, updateNotificationDto);
  }
  remove(id: number) {
    return this.notificationMicro.delete(id);
  }
  async markAsRead(userId: number, notificationId: number) {
    const notification = await this.notificationMicro.findOne({
      where: {
        id: notificationId,
        user: { id: userId },
        readAt: IsNull(),
      },
    });
    if (!notification) {
      throw new HttpException('notification no found or is alredy read', 400);
    }
    notification.readAt = new Date();
    return this.notificationMicro.update(notificationId, notification);
  }
  async markAllAsRead(userId: number) {
    const notifications = await this.getUnreadNotifications(userId);
    let date = new Date();
    notifications.map((notification) => {
      notification.readAt = date;
      return this.notificationMicro.update(notification.id, notification);
    });
    return notifications;
  }
  async getUnreadNotifications(userId: number) {
    const notifications = await this.notificationMicro.find({
      where: { user: { id: userId }, readAt: IsNull() },
    });
    return notifications;
  }
  async getReadNotifications(userId: number) {
    const notifications = await this.notificationMicro.find({
      where: { user: { id: userId }, readAt: Not(IsNull()) },
    });
    return notifications;
  }
  async getMyNotifications(userId: number) {
    const unread = await this.getUnreadNotifications(userId);
    const read = await this.getReadNotifications(userId);
    return { unread: unread, read: read };
  }
  async sendNotificationToDevice(token: string, title: string, body: string) {
    const message: admin.messaging.Message = {
      token,
      notification: {
        title,
        body,
      },
    };
    try {
      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async sendNotificationForAllSidesInProperties(
    contract: Contract,
    message: string,
  ) {
    const owner = await this.usersGetProvider.findById(
      contract.property.owner.id,
    );
    const user = await this.usersGetProvider.findById(contract.user.id);
    const agency = await this.usersGetProvider.findById(contract.agency.id);
    const ownerMessage = await this.i18nService.t(`transolation.${message}`, {
      lang: owner.language,
    });
    await this.create(
      {
        propertyId: contract.property.id,
        title: '',
        message: `${ownerMessage} ${contract.expireIn}`,
      },
      owner.id,
    );
    console.log(ownerMessage);
    this.client2.emit(
      'create_user.sms',
      new RmqRecordBuilder({
        phone: user.phone,
        message: `${ownerMessage}`,
      })
        .setOptions({ persistent: true })
        .build(),
    );
    const userMessage = await this.i18nService.t(`transolation.${message}`, {
      lang: user.language,
    });
    await this.create(
      {
        propertyId: contract.property.id,
        title: '',
        message: `${userMessage} ${contract.expireIn}`,
      },
      user.id,
    );
    const agencyMessage = await this.i18nService.t(`transolation.${message}`, {
      lang: agency.language,
    });
    console.log(userMessage);
    this.client2.emit(
      'create_user.sms',
      new RmqRecordBuilder({
        phone: user.phone,
        message: `${userMessage}`,
      })
        .setOptions({ persistent: true })
        .build(),
    );
    await this.create(
      {
        propertyId: contract.property.id,
        title: '',
        message: `${agencyMessage} ${contract.expireIn}`,
      },
      agency.id,
    );
    console.log(agencyMessage);
    this.client2.emit(
      'create_user.sms',
      new RmqRecordBuilder({
        phone: user.phone,
        message: `${agencyMessage}`,
      })
        .setOptions({ persistent: true })
        .build(),
    );
  }
}
