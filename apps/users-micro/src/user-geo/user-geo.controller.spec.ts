import { Test, TestingModule } from '@nestjs/testing';
import { UserGeoController } from './user-geo.controller';
import { UserGeoService } from './user-geo.service';

describe('UserGeoController', () => {
  let controller: UserGeoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGeoController],
      providers: [UserGeoService],
    }).compile();

    controller = module.get<UserGeoController>(UserGeoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
