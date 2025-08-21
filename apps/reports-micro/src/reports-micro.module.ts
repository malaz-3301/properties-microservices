import { Module } from '@nestjs/common';
import { ReportsMicroService } from './reports-micro.service';
import { ReportsMicroController } from './reports-micro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsMicro } from './entities/reports-micro.entity';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module';
import { ConfigSetModule } from '@malaz/contracts/modules/set/config-set.module';
import { UsersModule } from '../../users-micro/src/users/users.module';
import { User } from '../../users-micro/src/users/entities/user.entity';
import { JwtConfigModule } from '@malaz/contracts/modules/set/jwt-config.module';
import { GlobalCacheModule } from '@malaz/contracts/modules/set/cache-global.module';
import { dataSourceOptions } from '../../../db/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    TypeOrmModule.forFeature([ReportsMicro, User]),
    GlobalCacheModule,
    JwtConfigModule,
    ConfigSetModule,
    I18nSetModule,
  ],
  controllers: [ReportsMicroController],
  providers: [ReportsMicroService],
})
export class ReportsMicroModule {}
