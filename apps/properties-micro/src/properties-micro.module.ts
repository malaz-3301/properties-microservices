import { Module } from '@nestjs/common';

import { PropertiesModule } from './properties/properties.module';
import { FavoriteModule } from './favorite/favorite.module';
import { VotesModule } from './votes/votes.module';
import { ViewsModule } from './views/views.module';
import { GlobalCacheModule } from '@malaz/contracts/modules/set/cache-global.module';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module';
import { JwtConfigModule } from '@malaz/contracts/modules/set/jwt-config.module';
import { ConfigSetModule } from '@malaz/contracts/modules/set/config-set.module';
import { GeoQueRpcModule } from '@malaz/contracts/modules/rpc/geo-que-rpc.module';
import { ProGeoModule } from './pro-geo/pro-geo.module';
import { FromRpcToPropertiesModule } from './a-from-rpc-to-properties/from-rpc-to-properties.module';

@Module({
  imports: [
    ProGeoModule,
    GeoQueRpcModule,
    PropertiesModule,
    FavoriteModule,
    ViewsModule,
    VotesModule,
    JwtConfigModule,
    ConfigSetModule,
    I18nSetModule,
    GlobalCacheModule,
    FromRpcToPropertiesModule,
  ],
})
export class PropertiesMicroModule {}
