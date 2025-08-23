import { Test, TestingModule } from '@nestjs/testing';
import { FromReportsController } from './from-reports.controller';

describe('FromReportsController', () => {
  let controller: FromReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromReportsController],
    }).compile();

    controller = module.get<FromReportsController>(FromReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
