import { Test, TestingModule } from '@nestjs/testing';
import { ToUsersBannedController } from './to-users-banned.controller';

describe('ToUsersBannedController', () => {
  let controller: ToUsersBannedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToUsersBannedController],
    }).compile();

    controller = module.get<ToUsersBannedController>(ToUsersBannedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
