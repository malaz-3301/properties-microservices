import { Test, TestingModule } from '@nestjs/testing';
import { FromUsersController } from './from-users.controller';

describe('FromUsersController', () => {
  let controller: FromUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromUsersController],
    }).compile();

    controller = module.get<FromUsersController>(FromUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
