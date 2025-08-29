import { Module } from '@nestjs/common';
import { I18nSetModule } from '@malaz/contracts/modules/set/i18n-set.module';
import { OrdersModule } from './orders/orders.module';
import { PlansModule } from './plans/plans.module';
import { JwtConfigModule } from '@malaz/contracts/modules/set/jwt-config.module';
import { ConfigSetModule } from '@malaz/contracts/modules/set/config-set.module';
import { PropertiesRpcModule } from '@malaz/contracts/modules/rpc/properties-rpc.module';
import { TranslateRpcModule } from '@malaz/contracts/modules/rpc/translate-rpc.module';

@Module({
  imports: [
    TranslateRpcModule,
    PlansModule,
    OrdersModule,
    JwtConfigModule,
    ConfigSetModule,
    PropertiesRpcModule,
    I18nSetModule,
  ],
})
export class CommerceMicroModule {}
