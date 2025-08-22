import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesHttpMediaController } from './properties-http-media.controller';
import { PropertiesHttpMediaService } from './properties-http-media.service';

describe('PropertiesHttpMediaController', () => {
  let controller: PropertiesHttpMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesHttpMediaController],
      providers: [PropertiesHttpMediaService],
    }).compile();

    controller = module.get<PropertiesHttpMediaController>(PropertiesHttpMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
