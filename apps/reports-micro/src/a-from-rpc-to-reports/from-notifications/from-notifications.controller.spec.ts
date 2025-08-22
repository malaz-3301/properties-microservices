import { Test, TestingModule } from '@nestjs/testing';
import { FromNotificationsController } from './from-notifications.controller';
import { FromNotificationsService } from './from-notifications.service';

describe('FromNotificationsController', () => {
  let controller: FromNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromNotificationsController],
      providers: [FromNotificationsService],
    }).compile();

    controller = module.get<FromNotificationsController>(FromNotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
