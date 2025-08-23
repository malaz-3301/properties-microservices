import { Test, TestingModule } from '@nestjs/testing';
import { FromPropertiesController } from './from-properties.controller';

describe('FromPropertiesController', () => {
  let controller: FromPropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FromPropertiesController],
    }).compile();

    controller = module.get<FromPropertiesController>(FromPropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
