import { Test, TestingModule } from '@nestjs/testing';
import { UsersAdController } from './users-ad.controller';

describe('UsersAdController', () => {
  let controller: UsersAdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersAdController],
    }).compile();

    controller = module.get<UsersAdController>(UsersAdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
