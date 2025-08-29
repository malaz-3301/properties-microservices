import { forwardRef, Module } from '@nestjs/common';
import { UsersMicroController } from './users-micro.controller';
import { UsersMicroService } from './users-micro.service';
import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { GlobalCacheModule } from '@malaz/contracts/modules/set/cache-global.module';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module';
import { ContractsModule } from './contracts/contracts.module';
import { JwtConfigModule } from '@malaz/contracts/modules/set/jwt-config.module';
import { ConfigSetModule } from '@malaz/contracts/modules/set/config-set.module';
import { GeoQueRpcModule } from '@malaz/contracts/modules/rpc/geo-que-rpc.module';
import { UserGeoModule } from './user-geo/user-geo.module';
import { UserSmsModule } from './user-sms/user-sms.module';
import { SmsQueRpcModule } from '@malaz/contracts/modules/rpc/sms-que-rpc.module';
import { AnalyticsModule } from '../../automation-analytics-micro/src/analytics/analytics.module';
import { FromRpcToUsersModule } from './a-from-rpc-to-users/from-rpc-to-users.module';
import { PropertiesRpcModule } from '@malaz/contracts/modules/rpc/properties-rpc.module';

@Module({
  imports: [
    UserSmsModule,
    UserGeoModule,
    SmsQueRpcModule,
    GeoQueRpcModule,
    GlobalCacheModule,
    AuditModule,
    forwardRef(() => ContractsModule),
    AuditModule,
    GlobalCacheModule,
    UsersModule,
    JwtConfigModule,
    ConfigSetModule,
    I18nSetModule,
    UserGeoModule,
    UserSmsModule,
    AnalyticsModule,
    FromRpcToUsersModule,
    PropertiesRpcModule,
  ],
  controllers: [UsersMicroController],
  providers: [UsersMicroService],
})
export class UsersMicroModule {}
