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
import { PropertiesController } from './controllers/properties.controller';
import { FavoriteModule } from '../favorite/favorite.module';
import { AuditModule } from '../../../users-micro/src/audit/audit.module';
import { VotesModule } from '../votes/votes.module';
import { ImgProMulterModule } from '@malaz/contracts/modules/set/img-pro-multer.module';
import { GeoQueRpcModule } from '@malaz/contracts/modules/rpc/geo-que-rpc.module';
import { GeolocationModule } from '../geolocation/geolocation.module';
import { AuthMicroModule } from '../../../auth-micro/src/auth-micro.module';
import { PropertiesOnController } from './controllers/properties-on.controller';
import { PropertiesAgController } from './controllers/properties-ag.controller';
import { PropertiesAdController } from './controllers/properties-ad.controller';
import { UsersRpcModule } from '@malaz/contracts/modules/rpc/users-rpc.module';
import { AnalyticsRpcModule } from '@malaz/contracts/modules/rpc/analytics-rpc.module';
import { TranslateRpcModule } from '@malaz/contracts/modules/rpc/translate-rpc.module';

@Module({
  imports: [
    UsersRpcModule,
    AnalyticsRpcModule,
    TranslateRpcModule,
    TypeOrmModule.forFeature([Property, PriorityRatio]),
    forwardRef(() => AuthMicroModule),
    UsersModule,
    GeolocationModule,
    ImgProMulterModule,
    GeoQueRpcModule,
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
  controllers: [
    PropertiesController,
    PropertiesOnController,
    PropertiesAgController,
    PropertiesAdController,
  ],
})
export class PropertiesModule {
  constructor() {
    console.log('📍📍📍');
  }
}
