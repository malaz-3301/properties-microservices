import { Test, TestingModule } from '@nestjs/testing';
import { ToAuthController } from './to-auth.controller';

describe('ToAuthController', () => {
  let controller: ToAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToAuthController],
    }).compile();

    controller = module.get<ToAuthController>(ToAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
