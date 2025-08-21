import { Module } from '@nestjs/common';
import { UsersMicroController } from './users-micro.controller';
import { UsersMicroService } from './users-micro.service';
import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { GlobalCacheModule } from '@malaz/contracts/modules/set/cache-global.module';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module';
import { ContractsModule } from './contracts/contracts.module';
import { JwtConfigModule } from '@malaz/contracts/modules/set/jwt-config.module';
import { ConfigSetModule } from '@malaz/contracts/modules/set/config-set.module';

@Module({
  imports: [
    AuditModule,
    ContractsModule,
    AuditModule,
    GlobalCacheModule,
    UsersModule,
    JwtConfigModule,
    ConfigSetModule,
    I18nSetModule,
  ],
  controllers: [UsersMicroController],
  providers: [UsersMicroService],
})
export class UsersMicroModule {}
