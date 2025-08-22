import { Test, TestingModule } from '@nestjs/testing';
import { UserSmsService } from './user-sms.service';

describe('UserSmsService', () => {
  let service: UserSmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSmsService],
    }).compile();

    service = module.get<UserSmsService>(UserSmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
