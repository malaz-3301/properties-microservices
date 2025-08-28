import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';
import { IsNull, Not, Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { NotificationsMicroService } from './notifications-micro.service';
import { SmsQueRpcModule } from '@malaz/contracts/modules/rpc/sms-que-rpc.module';
import { Language } from '@malaz/contracts/utils/enums';
import { Contract } from 'apps/users-micro/src/contracts/entities/contract.entity';
import { User } from 'apps/users-micro/src/users/entities/user.entity';
import { CreateNotificationDto } from '@malaz/contracts/dtos/notification/create-notification.dto';
import { NotificationMicro } from './entities/notification-micro.entity';
import { of } from 'rxjs';

describe('NotificationsService', () => {
  let service: NotificationsMicroService;
  let notificationRepository: Repository<NotificationMicro>;
  let clientProxy: ClientProxy;
  let usersClient = { send: jest.fn() };
  let propertiesClient = { send: jest.fn() };
  let translateClient = { send: jest.fn() };
  let contractsClient = { send: jest.fn() };
  let i18nService: I18nService;

  const NOTIFICATINO_REPOSITORY_TOKEN = getRepositoryToken(NotificationMicro);

  beforeEach(async () => {
    if (admin.apps.length === 0)
      await admin.initializeApp({
        credential: admin.credential.cert({
          clientEmail:
            'firebase-adminsdk-fbsvc@promanage-1dm47.iam.gserviceaccount.com',
          privateKey:
            '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1zno2UDrdcdHp\nROGdI2cnUCIOOvgdXIm9TV70azZylo1i2GtcKwephitJkY4Bah+A+AqTIJ/F4WlB\nOiD8cWQSoPTsuyWYr85EJMaKUmurBF32MbgEhqVVXjwiiDiQH7PRJYbkwiV/gD0j\nkhr2Ddv2B+tDMiy2RMBjCoran/QdsL9g7UmhpU+dDvZaQ9vfq4oB4hI+6ItjwJaz\nzLiAKDCvowSiHiJGSAqjd9pGfGftFUWWmWKMgeLEbIAG5tZ8CEGdBQaGloIEcRr3\n5NPF2Er5NKFKWquWPmD+O4HkH6qSXTtociRO0mCf0bNDht2KQCnx6kb9APxVQusB\njWZqvHcbAgMBAAECggEACkP84Zk5IazeGepSRPGtTup26c/Jl7rUajR2sp1lJyY6\nGIU41qz1U0yooBBQcOMBoWIgEruqWd2G+HBkUWzDpkuhWMaeclcm8fETptbNjowC\nFDcteU/zAPV/tsFzVCv+FsakLcGKpX7jtOD4lcEllOhQj+xC2w3ZwR3kxkB248Ax\nJ8cAlZwnXUW5/iLBZdrXu5uUHDc1G/GtvHrkh/iPByDMXm+KM7++HL6LotQHSBFu\n3VFwW7vhhUKhgSonAt/jZgVlIPmnoF/fp0UV/bi8NdaLHRlypGdoivl39Y251BdY\n6YwNYdPUbKwls1Dfvup5GgIS7iD2FYU1mIi411OV+QKBgQDvQrnfDPHc3V/DJuf0\nO7ax0VUx84wJACyAGcwKHKRHz9O9V2cekazTg8BmjXcv1HnWzFNafmY5r+YZKQfw\nTE6k+ZHnTwtp2M1xcmIbTcbeeKIW9zHtVcrQI/wPmdwFubQ5v3kgO4wNhFynPEC3\nrPmLICLGvSHL7e8EaeL5i9W6swKBgQDChrh+ShLz6aK6sujSZQVNoDg4M5xXALNY\nWJWOMeg4c+ayMW+cgPemMWpttnvjuYEvBgYhtXjc2f0G5M/6jtqyDk/vAfGlgLsC\nKmJcZ2om1UP9biKRx4WFjLslA8HWC7zB0HoTaC2lBBqjQhJczsR97P1K5dd+0fuV\nq3a406ol+QKBgQChypBgOaOwA+7Gy59cs6iGNBUVUyjlyT1OXqNwTw/0E6COT/VG\nYaHp4hUQBCeNq3O8gaz367N63OyPJQTeROuFedJlBTmlmNrMFVosNnr9Y7vQJdaY\nNESSXVMMxbFYGcy6pDTnS/0YAuKYoBDvY8PXhaKem7Sn7zyK0oOO1jVwKwKBgE0J\nUVMiPrM92WYaqD16KEl/pAQN3GJQMrZQDppLhW2l6Ly0+0B9ipXUiBN+6z1aH6Dh\nv9flqEG+SohKYVsW6+EL7ff3Sx2CB41p/54cjltmphBdZ29YFra27v5PqJn99/jB\neTbqUPlC0NHKvr7mW8aK7hyVPWxJ+FpjlxbHLGDxAoGBAJUXFAHacFvTe//stplx\n5Prx3isuHbVwOwTY0QY70g+CtcA6QiF+alOGXrmZjljAswNpd1/8VJmgyKW76Bzj\nBzfGxTbHOI10cE8Cvq6iT394ayG6Ep0R6IEvGia+QteRDzwhndz2lb9moqNrfi8c\nmAxi4bU51o2d378oe0D2bt+v\n-----END PRIVATE KEY-----\n'.replace(
              /\\n/g,
              '\n',
            ),
          projectId: 'promanage-1dm47',
        }),
      });
    const module: TestingModule = await Test.createTestingModule({
      imports: [SmsQueRpcModule],
      providers: [
        NotificationsMicroService,
        {
          provide: NOTIFICATINO_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: 'USERS_SERVICE',
          useValue: usersClient,
        },
        {
          provide: 'CONTRACTS_SERVICE',
          useValue: contractsClient,
        },
        {
          provide: 'PROPERTIES_SERVICE',
          useValue: propertiesClient,
        },
        {
          provide: 'TRANSLATE_SERVICE',
          useValue: translateClient,
        },
        {
          provide: ClientProxy,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsMicroService>(NotificationsMicroService);
    notificationRepository = module.get<Repository<NotificationMicro>>(
      NOTIFICATINO_REPOSITORY_TOKEN,
    );
    clientProxy = module.get<ClientProxy>(ClientProxy);
    i18nService = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('create test', async () => {
    const createNotificationDto = {
      message: 'رسالة',
      title: 'title',
      propertyId: 1,
    } as CreateNotificationDto;
    const userId = 2 as number;
    const user_language_message = 'رسالة';
    const create = {
      user: { id: userId },
      readAt: null,
      property: { id: createNotificationDto.propertyId },
      ...createNotificationDto,
      usre_language_message: user_language_message,
    };
    const { message, ...NotificationMicro } = create;
    const user = {
      token:
        'cE2MmCvltw0LQfoxQjkPoJ:APA91bHreHR2cyhpmF6igY5imkd9oebIZjmz6LJ7iSrmgwwKiRj1BxyIxCv2K2KImMQXBBUP89xCap3IasFTNs9STjygnJqvY7g1xJBE-iLfEGOU5Ru_9ic',
      language: Language.ARABIC,
    } as User;
    const save = {
      ...NotificationMicro,
    };

    jest
      .spyOn(notificationRepository, 'create')
      .mockReturnValueOnce(NotificationMicro as any);
    jest.spyOn(usersClient, 'send').mockReturnValueOnce(of(user));
    jest
      .spyOn(translateClient, 'send')
      .mockReturnValueOnce(of(user_language_message));
    jest
      .spyOn(notificationRepository, 'save')
      .mockResolvedValueOnce(save as any);
    await expect(
      service.create(createNotificationDto, userId),
    ).resolves.toEqual(save);
    expect(notificationRepository.create).toHaveBeenCalledWith(create);
    expect(usersClient.send).toHaveBeenCalledWith('users.findById', {
      id: userId,
    });
    expect(notificationRepository.save).toHaveBeenCalledWith(save);
  });
  it('markAsRead test', async () => {
    const userId = 1;
    const notificationId = 2;
    const find = {
      where: { id: notificationId, user: { id: userId }, readAt: IsNull() },
    };
    const NotificationMicro = { readAt: null };
    const update = { readAt: new Date() };
    jest
      .spyOn(notificationRepository, 'findOne')
      .mockResolvedValueOnce(NotificationMicro as any);
    jest
      .spyOn(notificationRepository, 'update')
      .mockResolvedValueOnce(update as any);
    await expect(service.markAsRead(userId, notificationId)).resolves.toEqual(
      update,
    );
    expect(notificationRepository.findOne).toHaveBeenCalledWith(find);
    expect(notificationRepository.update).toHaveBeenCalledWith(
      notificationId,
      NotificationMicro,
    );
  });
  it('markAllAsRead test', async () => {
    const userId = 1;
    const find = { where: { user: { id: userId }, readAt: IsNull() } };
    const notifications = [
      { id: 2, readAt: null },
      { id: 3, readAt: null },
    ];
    const date = new Date();
    const update = notifications.map(function (NotificationMicro) {
      NotificationMicro.readAt = date as any;
      return NotificationMicro;
    });
    jest
      .spyOn(notificationRepository, 'find')
      .mockResolvedValueOnce(notifications as any);
    jest
      .spyOn(notificationRepository, 'update')
      .mockResolvedValueOnce(update as any);
    await expect(service.markAllAsRead(userId)).resolves.toEqual(update);
    expect(notificationRepository.find).toHaveBeenCalledWith(find);
    for (let i = 0; i < notifications.length; i++) {
      expect(notificationRepository.update).toHaveBeenNthCalledWith(
        i + 1,
        notifications[i].id,
        notifications[i],
      );
    }
  });
  it('getMyNotifications test', async () => {
    const userId = 1;
    const unread = [{ id: 2 }, { id: 3 }];
    const findUnread = { where: { user: { id: userId }, readAt: IsNull() } };
    const read = [{ id: 4 }, { id: 5 }, { id: 6 }];
    const findRead = { where: { user: { id: userId }, readAt: Not(IsNull()) } };
    const returnValue = { read, unread };
    jest
      .spyOn(notificationRepository, 'find')
      .mockResolvedValueOnce(unread as any)
      .mockResolvedValueOnce(read as any);
    await expect(service.getMyNotifications(userId)).resolves.toEqual(
      returnValue,
    );
    expect(notificationRepository.find).toHaveBeenNthCalledWith(1, findUnread);
    expect(notificationRepository.find).toHaveBeenNthCalledWith(2, findRead);
  });
  });
