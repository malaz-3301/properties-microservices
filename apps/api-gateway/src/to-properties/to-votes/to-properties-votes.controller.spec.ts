import { Test, TestingModule } from '@nestjs/testing';
import { ToPropertiesVotesController } from './to-properties-votes.controller';

describe('ToPropertiesVotesController', () => {
  let controller: ToPropertiesVotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToPropertiesVotesController],
    }).compile();

    controller = module.get<ToPropertiesVotesController>(ToPropertiesVotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
