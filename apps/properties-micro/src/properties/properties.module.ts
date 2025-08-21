import { forwardRef, Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Property } from './entities/property.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesImgProvider } from './providers/properties-img.provider';
import { PropertiesDelProvider } from './providers/properties-del.provider';
import { PropertiesGetProvider } from './providers/properties-get.provider';
import { PropertiesUpdateProvider } from './providers/properties-update.provider';
import { PropertiesVoSuViProvider } from './providers/properties-vo-su-vi.provider';
import { PropertiesCreateProvider } from './providers/properties-create.provider';
import { PriorityRatio } from './entities/priority-ratio.entity';
import { UsersModule } from '../../../users-micro/src/users/users.module';
import { PropertiesController } from './properties.controller';
import { FavoriteModule } from '../favorite/favorite.module';
import { AuditModule } from '../../../users-micro/src/audit/audit.module';
import { VotesModule } from '../votes/votes.module';
import { ImgProMulterModule } from '@malaz/contracts/modules/set/img-pro-multer.module';
import { GeoQueClientModule } from '@malaz/contracts/modules/set/geo-que-client.module';
import { GeolocationModule } from '../geolocation/geolocation.module';
import { AuthMicroModule } from '../../../auth-micro/src/auth-micro.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, PriorityRatio]),
    forwardRef(() => AuthMicroModule),
    UsersModule,
    GeolocationModule,
    ImgProMulterModule,
    GeoQueClientModule,
    AuditModule,
    FavoriteModule,
    forwardRef(() => VotesModule),
  ],
  providers: [
    PropertiesService,
    PropertiesCreateProvider,
    PropertiesUpdateProvider,
    PropertiesImgProvider,
    PropertiesDelProvider,
    PropertiesGetProvider,
    PropertiesVoSuViProvider,
  ],
  exports: [
    PropertiesService,
    PropertiesUpdateProvider,
    PropertiesImgProvider,
    PropertiesDelProvider,
    PropertiesGetProvider,
    PropertiesVoSuViProvider,
  ],
  controllers: [PropertiesController],
})
export class PropertiesModule {
  constructor() {
    console.log('📍📍📍');
  }
}
