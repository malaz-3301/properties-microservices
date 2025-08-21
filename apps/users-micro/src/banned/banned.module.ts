import { forwardRef, Module } from '@nestjs/common';
import { BannedService } from './banned.service';
import { BannedController } from './banned.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banned } from './entities/banned.entity';
import { AuditModule } from '../audit/audit.module';
import { ApiGatewayModule } from '../../../api-gateway/src/api-gateway.module';
import { ToUsersAuditService } from '../../../api-gateway/src/to-users/to-audit/to-users-audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Banned]), forwardRef(() => AuditModule)],
  controllers: [BannedController, ApiGatewayModule],
  providers: [BannedService, ToUsersAuditService],
  exports: [BannedService],
})
export class BannedModule {}
