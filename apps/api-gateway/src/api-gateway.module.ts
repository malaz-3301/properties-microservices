import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { AuthRpcModule } from '@malaz/contracts/modules/rpc/auth-rpc.module';
import { ToUsersBannedController } from './to-users/to-banned/to-users-banned.controller';
import { ToUsersUsersController } from './to-users/to-users/to-users-users.controller';
import { ToUsersAuditController } from './to-users/to-audit/to-users-audit.controller';
import { ToUsersContractsController } from './to-users/to-contracts/to-users-contracts.controller';
import { ToCommercePlansController } from './to-commerce/to-plans/to-commerce-plans.controller';
import { ToCommerceOrdersController } from './to-commerce/to-orders/to-commerce-orders.controller';
import { ToPropertiesVotesController } from './to-properties/to-votes/to-properties-votes.controller';
import { ToPropertiesViewsController } from './to-properties/to-views/to-properties-views.controller';
import { ToPropertiesFavoriteController } from './to-properties/to-favorite/to-properties-favorite.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'node:process';
import { ThrottlerModule } from '@nestjs/throttler';
import { rateLimiting } from '@malaz/contracts/utils/constants';
import { ToUsersAuditService } from './to-users/to-audit/to-users-audit.service';
import { AnalyticsRpcModule } from '@malaz/contracts/modules/rpc/analytics-rpc.module';
import { CommerceRpcModule } from '@malaz/contracts/modules/rpc/commerce-rpc.module';
import { NotificationsRpcModule } from '@malaz/contracts/modules/rpc/notifications-rpc.module';
import { PropertiesRpcModule } from '@malaz/contracts/modules/rpc/properties-rpc.module';
import { ReportsRpcModule } from '@malaz/contracts/modules/rpc/reports-rpc.module';
import { UsersRpcModule } from '@malaz/contracts/modules/rpc/users-rpc.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToAnalyticsController } from './to-analytics/to-analytics.controller';
import { ToAuthController } from './to-auth/to-auth.controller';
import { ToPropertiesPropertiesController } from './to-properties/to-properties/to-properties-properties.controller';
import { GlobalCacheModule } from '@malaz/contracts/modules/set/cache-global.module';
import { ToReportsController } from './to-reports/to-reports.controller';
import { dataSourceOptions } from '../../../db/data-source';

@Module({
  imports: [
    GlobalCacheModule,
    AnalyticsRpcModule,
    AuthRpcModule,
    CommerceRpcModule,
    NotificationsRpcModule,
    PropertiesRpcModule,
    ReportsRpcModule,
    UsersRpcModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ThrottlerModule.forRoot({
      //first policy
      throttlers: rateLimiting,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [
    ApiGatewayController,
    ToAuthController,
    ToAnalyticsController,
    ToUsersBannedController,
    ToUsersUsersController,
    ToUsersAuditController,
    ToUsersContractsController,
    ToPropertiesPropertiesController,
    ToPropertiesFavoriteController,
    ToPropertiesViewsController,
    ToPropertiesVotesController,
    ToCommerceOrdersController,
    ToCommercePlansController,
    ToReportsController,
  ],
  providers: [ToUsersAuditService],
})
export class ApiGatewayModule {}
