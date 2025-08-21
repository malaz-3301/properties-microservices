import { forwardRef, Module } from '@nestjs/common';
import { AuthMicroService } from './auth-micro.service';
import { AuthMicroController } from './auth-micro.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users-micro/src/users/entities/user.entity';
import { BannedModule } from '../../users-micro/src/banned/banned.module';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module';
import { ConfigSetModule } from '@malaz/contracts/modules/set/config-set.module';
import { UsersMicroModule } from '../../users-micro/src/users-micro.module';
import { UsersModule } from '../../users-micro/src/users/users.module';
import { JwtConfigModule } from '@malaz/contracts/modules/set/jwt-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersMicroModule),
    UsersModule,
    BannedModule,
    JwtConfigModule,
    ConfigSetModule,
    I18nSetModule,
  ],
  controllers: [AuthMicroController],
  providers: [AuthMicroService],
})
export class AuthMicroModule {}
