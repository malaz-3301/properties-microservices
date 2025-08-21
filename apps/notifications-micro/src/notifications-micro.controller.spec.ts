import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsMicroController } from './notifications-micro.controller';
import { NotificationsMicroService } from './notifications-micro.service';

describe('NotificationsMicroController', () => {
  let notificationsMicroController: NotificationsMicroController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsMicroController],
      providers: [NotificationsMicroService],
    }).compile();

    notificationsMicroController = app.get<NotificationsMicroController>(
      NotificationsMicroController,
    );
  });
});
