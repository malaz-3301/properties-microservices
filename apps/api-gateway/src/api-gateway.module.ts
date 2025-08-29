import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { AuthRpcModule } from '@malaz/contracts/modules/rpc/auth-rpc.module';
import { ToUsersBannedController } from './to-users/to-banned/to-users-banned.controller';
import { ToUsersUsersController } from './to-users/to-users/to-users-users.controller';
import { ToUsersAuditController } from './to-users/to-audit/to-users-audit.controller';
import { ToCommercePlansController } from './to-commerce/to-plans/to-commerce-plans.controller';
import { ToCommerceOrdersController } from './to-commerce/to-orders/to-commerce-orders.controller';
import { ToPropertiesVotesController } from './to-properties/to-votes/to-properties-votes.controller';
import { ToPropertiesViewsController } from './to-properties/to-views/to-properties-views.controller';
import { ToPropertiesFavoriteController } from './to-properties/to-favorite/to-properties-favorite.controller';
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

import { ToPropertiesOnPropertiesController } from './to-properties/to-properties/to-properties-on-properties.controller';
import { ToPropertiesAgPropertiesController } from './to-properties/to-properties/to-properties-ag-properties.controller';
import { ToPropertiesAdPropertiesController } from './to-properties/to-properties/to-properties-ad-properties.controller';
import { PropertiesHttpMediaModule } from './media-req-rep/http/properties-http-media/properties-http-media.module';
import { UsersHttpMediaModule } from './media-req-rep/http/users-http-media/users-http-media.module';
import { JwtConfigModule } from '@malaz/contracts/modules/set/jwt-config.module';
import { ConfigSetModule } from '@malaz/contracts/modules/set/config-set.module';
import { ToNotificationsController } from './to-notifications/to-notifications.controller';
import { ContractsRpcModule } from '@malaz/contracts/modules/rpc/contracts-rpc.module';
import { ToUsersContractsController } from './to-users/to-contracts/to-users-contracts.controller';
import { HoneypotModule } from './honeypot/honeypot.module';
import { HoneypotMiddleware } from '@malaz/contracts/utils/middlewares/honeypot.middleware';
import { Honeypot } from './honeypot/entities/honeypot.entity';

@Module({
  imports: [
    GlobalCacheModule,
    AnalyticsRpcModule,
    AuthRpcModule,
    CommerceRpcModule,
    ContractsRpcModule,
    NotificationsRpcModule,
    PropertiesRpcModule,
    NotificationsRpcModule,
    ReportsRpcModule,
    UsersRpcModule,
    ContractsRpcModule,
    JwtConfigModule,
    ConfigSetModule,
    PropertiesHttpMediaModule,
    UsersHttpMediaModule,
    ThrottlerModule.forRoot({
      //first policy
      throttlers: rateLimiting,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([Honeypot]),

    PropertiesHttpMediaModule,
    UsersHttpMediaModule,
    HoneypotModule,
  ],
  controllers: [
    ApiGatewayController,
    ToAuthController,
    ToNotificationsController,
    ToAnalyticsController,
    ToUsersBannedController,
    ToUsersUsersController,
    ToUsersAuditController,
    ToUsersContractsController,
    ToPropertiesFavoriteController,
    ToPropertiesViewsController,
    ToPropertiesVotesController,
    ToCommerceOrdersController,
    ToCommercePlansController,
    ToReportsController,
    ToPropertiesPropertiesController,
    ToPropertiesOnPropertiesController,
    ToPropertiesAgPropertiesController,
    ToPropertiesAdPropertiesController,
    ToPropertiesAgPropertiesController,
  ],
  providers: [ToUsersAuditService],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HoneypotMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
