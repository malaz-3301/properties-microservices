import { Module } from '@nestjs/common';
import { UserGeoService } from './user-geo.service';
import { UserGeoController } from './user-geo.controller';
import { GeolocationModule } from '../geolocation/geolocation.module';

@Module({
  imports: [GeolocationModule],
  controllers: [UserGeoController],
  providers: [UserGeoService],
})
export class UserGeoModule {}
