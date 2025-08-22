import { Module } from '@nestjs/common';
import { ProGeoService } from './pro-geo.service';
import { ProGeoController } from './pro-geo.controller';

@Module({
  controllers: [ProGeoController],
  providers: [ProGeoService],
})
export class ProGeoModule {}
