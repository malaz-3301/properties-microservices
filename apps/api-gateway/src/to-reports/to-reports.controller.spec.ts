import { Test, TestingModule } from '@nestjs/testing';
import { ToReportsController } from './to-reports.controller';

describe('ToReportsController', () => {
  let controller: ToReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToReportsController],
    }).compile();

    controller = module.get<ToReportsController>(ToReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
