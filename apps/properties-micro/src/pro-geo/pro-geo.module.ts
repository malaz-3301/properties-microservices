import { Module } from '@nestjs/common';
import { ProGeoService } from './pro-geo.service';
import { ProGeoController } from './pro-geo.controller';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [PropertiesModule],
  controllers: [ProGeoController],
  providers: [ProGeoService],
})
export class ProGeoModule {}
