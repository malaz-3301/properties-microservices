import { Test, TestingModule } from '@nestjs/testing';
import { FromPropertiesController } from './from-properties.controller';
import { FromPropertiesService } from './from-properties.service';

describe('FromPropertiesController', () => {
  let controller: FromPropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromPropertiesController],
      providers: [FromPropertiesService],
    }).compile();

    controller = module.get<FromPropertiesController>(FromPropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
