import { Test, TestingModule } from '@nestjs/testing';
import { HoneypotController } from './honeypot.controller';
import { HoneypotService } from './honeypot.service';

describe('HoneypotController', () => {
  let controller: HoneypotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoneypotController],
      providers: [HoneypotService],
    }).compile();

    controller = module.get<HoneypotController>(HoneypotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
