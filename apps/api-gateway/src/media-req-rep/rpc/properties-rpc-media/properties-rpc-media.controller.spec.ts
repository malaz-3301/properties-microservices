import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesRpcMediaController } from './properties-rpc-media.controller';
import { PropertiesRpcMediaService } from './properties-rpc-media.service';

describe('PropertiesRpcMediaController', () => {
  let controller: PropertiesRpcMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesRpcMediaController],
      providers: [PropertiesRpcMediaService],
    }).compile();

    controller = module.get<PropertiesRpcMediaController>(PropertiesRpcMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
