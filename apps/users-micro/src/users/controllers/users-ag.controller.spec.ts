import { Test, TestingModule } from '@nestjs/testing';
import { UsersAgController } from './users-ag.controller';

describe('UsersAgController', () => {
  let controller: UsersAgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersAgController],
    }).compile();

    controller = module.get<UsersAgController>(UsersAgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
