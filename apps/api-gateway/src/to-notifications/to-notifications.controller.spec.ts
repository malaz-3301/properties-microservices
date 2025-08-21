import { Test, TestingModule } from '@nestjs/testing';
import { ToNotificationsController } from './to-notifications.controller';

describe('ToNotificationsController', () => {
  let controller: ToNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToNotificationsController],
    }).compile();

    controller = module.get<ToNotificationsController>(
      ToNotificationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
