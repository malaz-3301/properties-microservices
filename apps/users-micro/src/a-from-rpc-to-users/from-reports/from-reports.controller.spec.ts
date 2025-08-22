import { Test, TestingModule } from '@nestjs/testing';
import { FromReportsController } from './from-reports.controller';
import { FromReportsService } from './from-reports.service';

describe('FromReportsController', () => {
  let controller: FromReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromReportsController],
      providers: [FromReportsService],
    }).compile();

    controller = module.get<FromReportsController>(FromReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
