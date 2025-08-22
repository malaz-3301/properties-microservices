import { Test, TestingModule } from '@nestjs/testing';
import { FromNotificationsService } from './from-notifications.service';

describe('FromNotificationsService', () => {
  let service: FromNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FromNotificationsService],
    }).compile();

    service = module.get<FromNotificationsService>(FromNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
