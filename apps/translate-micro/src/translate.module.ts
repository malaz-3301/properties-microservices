import { Module } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateController } from './translate.controller';
import { GlobalCacheModule } from '@malaz/contracts/modules/set/cache-global.module';
import { TranslateRpcModule } from '@malaz/contracts/modules/rpc/translate-rpc.module';
import { ConfigSetModule } from '@malaz/contracts/modules/set/config-set.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { FromRpcToTranslateModule } from './a-from-rpc-to-auth/from-rpc-to-auth.module';

@Module({
  imports: [
    FromRpcToTranslateModule,
    GlobalCacheModule,
    TranslateRpcModule,
    ConfigSetModule,
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [TranslateController],
  providers: [TranslateService],
  exports: [TranslateService],
})
export class TranslateMicroModule {}
