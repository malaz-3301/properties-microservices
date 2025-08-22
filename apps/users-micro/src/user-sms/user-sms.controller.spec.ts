import { Test, TestingModule } from '@nestjs/testing';
import { UserSmsController } from './user-sms.controller';
import { UserSmsService } from './user-sms.service';

describe('UserSmsController', () => {
  let controller: UserSmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSmsController],
      providers: [UserSmsService],
    }).compile();

    controller = module.get<UserSmsController>(UserSmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
