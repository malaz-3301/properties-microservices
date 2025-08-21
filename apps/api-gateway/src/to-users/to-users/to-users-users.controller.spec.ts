import { Test, TestingModule } from '@nestjs/testing';
import { ToUsersUsersController } from './to-users-users.controller';

describe('ToUsersUsersController', () => {
  let controller: ToUsersUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToUsersUsersController],
    }).compile();

    controller = module.get<ToUsersUsersController>(ToUsersUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
