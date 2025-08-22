import { Test, TestingModule } from '@nestjs/testing';
import { FromUsersController } from './from-users.controller';
import { FromUsersService } from './from-users.service';

describe('FromUsersController', () => {
  let controller: FromUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromUsersController],
      providers: [FromUsersService],
    }).compile();

    controller = module.get<FromUsersController>(FromUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
