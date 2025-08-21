import { Module } from '@nestjs/common';

import { PropertiesModule } from './properties/properties.module';
import { FavoriteModule } from './favorite/favorite.module';
import { VotesModule } from './votes/votes.module';
import { ViewsModule } from './views/views.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path'; // يجب أن يكون هكذا
import { GlobalCacheModule } from '@malaz/contracts/modules/set/cache-global.module';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module';


@Module({
  imports : [PropertiesModule,FavoriteModule,ViewsModule,VotesModule,JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return {
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      };
    },

  })   , ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env`,
  }),  I18nSetModule,GlobalCacheModule],


})
export class PropertiesMicroModule {}
