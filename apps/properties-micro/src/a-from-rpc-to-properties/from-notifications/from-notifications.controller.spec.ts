import { Test, TestingModule } from '@nestjs/testing';
import { FromNotificationsController } from './from-notifications.controller';

describe('FromNotificationsController', () => {
  let controller: FromNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromNotificationsController],
    }).compile();

    controller = module.get<FromNotificationsController>(
      FromNotificationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
