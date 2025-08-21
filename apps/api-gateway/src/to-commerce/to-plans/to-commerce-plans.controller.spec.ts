import { Test, TestingModule } from '@nestjs/testing';
import { ToCommercePlansController } from './to-commerce-plans.controller';

describe('ToCommercePlansController', () => {
  let controller: ToCommercePlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToCommercePlansController],
    }).compile();

    controller = module.get<ToCommercePlansController>(ToCommercePlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
