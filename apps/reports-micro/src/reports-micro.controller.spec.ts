import { Test, TestingModule } from '@nestjs/testing';
import { ReportsMicroController } from './reports-micro.controller';
import { ReportsMicroService } from './reports-micro.service';

describe('ReportsMicroController', () => {
  let controller: ReportsMicroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsMicroController],
      providers: [ReportsMicroService],
    }).compile();

    controller = module.get<ReportsMicroController>(ReportsMicroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
